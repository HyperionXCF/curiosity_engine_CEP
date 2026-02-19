from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from llm_service import send_prompt_to_llm
from prompt_service import generate_socratic_prompt
from topic_extraction import extract_topic_from_user_input
from database import engine, session
import database_models
import models
from sqlalchemy.orm import Session
from security import (
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from fastapi.middleware.cors import CORSMiddleware

database_models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


@app.post("/register", response_model=models.RegisterResponse)
def register(request: models.RegisterRequest, db: Session = Depends(init_db)):
    # Check if email already exists
    existing_user = (
        db.query(database_models.User)
        .filter(database_models.User.email == request.email)
        .first()
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pwd = hash_password(request.password)

    # Create user
    new_user = database_models.User(
        name=request.name,
        email=request.email,
        age=request.age,
        hashed_password=hashed_pwd,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return success
    return {"message": "User registered successfully"}


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(init_db)
):
    user = (
        db.query(database_models.User)
        .filter(database_models.User.email == form_data.username)
        .first()
    )

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@app.post("/refresh")
def refresh_token(request: models.RefreshRequest):
    email = decode_refresh_token(request.refresh_token)

    if not email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(email)

    return {"access_token": new_access_token, "token_type": "bearer"}


# Mapping current_level to description
level_description = {
    1: "basic explanation",
    2: "intermediate explanation",
    3: "in-depth explanation",
}


@app.post("/start-learning")
def start_learning(
    request: models.StartLearningRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(init_db),
):
    try:
        # Decode token
        email = decode_access_token(token)
        if not email:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        # Fetch user from database
        user = (
            db.query(database_models.User)
            .filter(database_models.User.email == email)
            .first()
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        topic = extract_topic_from_user_input(request.user_input)

        # Step 2: Check if a session for this topic exists
        existing_session = (
            db.query(database_models.Session)
            .filter(database_models.Session.user_id == user.id)
            .filter(database_models.Session.topic == topic)
            .order_by(database_models.Session.session_start.desc())
            .first()
        )

        if existing_session:
            # Restore current level from previous session
            current_level = existing_session.current_level
            session_obj = existing_session

            interest = (
                db.query(database_models.Interest)
                .filter(database_models.Interest.user_id == user.id)
                .filter(database_models.Interest.topic == topic)
                .first()
            )

            if interest:
                # Repeated search
                interest.score += 1

                # Apply decay if last search was long ago
                last_session = (
                    db.query(database_models.Session)
                    .filter(database_models.Session.user_id == user.id)
                    .filter(database_models.Session.topic == topic)
                    .order_by(database_models.Session.session_start.desc())
                    .first()
                )
                if last_session:
                    days_since_last = (
                        datetime.now(timezone.utc) - last_session.session_start
                    ).days
                    if days_since_last > 5:
                        decay_factor = 0.02
                        interest.score *= max(0, 1 - days_since_last * decay_factor)
            db.commit()

        else:
            # Create new session
            session_obj = database_models.Session(
                user_id=user.id,
                topic=topic,
                current_level=1,  # start with basic
                session_start=datetime.now(timezone.utc),
            )
            db.add(session_obj)
            db.commit()
            db.refresh(session_obj)
            current_level = 1

            new_interest = database_models.Interest(
                user_id=user.id, topic=topic, score=1
            )
            db.add(new_interest)
            db.commit()

        # Fetch personalized data
        history = (
            db.query(database_models.History)
            .filter(database_models.History.user_id == user.id)
            .order_by(database_models.History.searched_at.desc())
            .all()
        )
        sessions = (
            db.query(database_models.Session)
            .filter(database_models.Session.user_id == user.id)
            .order_by(database_models.Session.session_start.desc())
            .all()
        )
        interests = (
            db.query(database_models.Interest)
            .filter(database_models.Interest.user_id == user.id)
            .all()
        )

        history_data = [
            {
                "topic": h.topic,
                "user_question": h.user_question,
                "ai_answer": h.ai_answer,
                "ai_counter_question": h.ai_counter_question,
            }
            for h in history
        ]

        sessions_data = [
            {
                "topic": s.topic,
                "current_level": s.current_level,
                "session_start": s.session_start,
            }
            for s in sessions
        ]

        interests_data = [{"topic": i.topic, "score": i.score} for i in interests]

        current_level_text = level_description.get(current_level, "basic explanation")

        # generate the prompt to send it to llm
        socratic_prompt = generate_socratic_prompt(
            user=user,
            topic=topic,
            current_level_text=current_level_text,
            history_data=history_data,
            sessions_data=sessions_data,
            interests_data=interests_data,
            user_input=request.user_input,
        )

        personalized_data = {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "age": user.age,
            },
            "history": [h.topic for h in history],
            "sessions": [
                {"topic": s.topic, "started_at": s.session_start} for s in sessions
            ],
            "interests": [i.topic for i in interests],
        }

        # calling our ai action agent for socratic learning
        ai_output = send_prompt_to_llm(
            socratic_prompt
        )  # this comprise of both main answer and follow-ups

        # Retrieve main AI answer
        # ai_answer = ai_output.get("ai_answer", "")

        # Retrieve follow-up questions
        # follow_ups = ai_output.get("follow_up_questions", [])  # list of strings

        # update the history db once response is get
        import json

        # Convert follow-ups to JSON string for DB
        ai_counter_questions_json = json.dumps(ai_output.get("follow_up_questions", []))

        # Store in History
        new_history = database_models.History(
            user_id=user.id,
            topic=topic,
            user_question=request.user_input,
            ai_answer=ai_output.get("ai_answer"),
            ai_counter_question=ai_counter_questions_json,
            searched_at=datetime.now(timezone.utc),
        )
        db.add(new_history)
        db.commit()
        db.refresh(new_history)

        return {
            "topic": topic,
            "ai_answer": ai_output["ai_answer"],
            "follow_up_questions": ai_output["follow_up_questions"],
        }

    except Exception as e:
        # Return actual error for debugging
        raise HTTPException(status_code=500, detail=str(e))


# from frontend token delete karaycha simply...
@app.post("/logout")
def logout():
    return {"msg": "Logged out successfully"}
