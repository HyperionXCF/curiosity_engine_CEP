from flask import Blueprint, request, jsonify
from app import db
from models import User, ChatSession, Message
from services import update_user_interest
from datetime import datetime

main = Blueprint("main", __name__)


@main.route("/")
def home():
    return "Curioplay Backend Running 🚀"


# CREATE USER
@main.route("/create-user", methods=["POST"])
def create_user():
    data = request.json or {}

    missing = [key for key in ["full_name", "email", "password"] if not data.get(key)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password_hash=data["password"],
        grade_level=data["grade_level"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User Created", "user_id": user.id}), 201


# START CHAT SESSION
@main.route("/start-session/<int:user_id>", methods=["POST"])
def start_session(user_id):
    data = request.json or {}

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    session = ChatSession(
        user_id=user_id,
        session_title=data.get("title", "New Chat")
    )

    db.session.add(session)
    db.session.commit()

    return jsonify({"session_id": session.id})


# SEND MESSAGE
@main.route("/send-message/<int:session_id>", methods=["POST"])
def send_message(session_id):
    data = request.json or {}

    if not data.get("sender") or not data.get("message"):
        return jsonify({"error": "Fields 'sender' and 'message' are required"}), 400

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    message = Message(
        session_id=session_id,
        sender=data["sender"],
        message_text=data["message"]
    )

    db.session.add(message)
    db.session.commit()

    # Dummy topic detection (replace later with AI)
    if "plant" in data["message"].lower():
        update_user_interest(session.user_id, "Photosynthesis")

    return jsonify({"message": "Message Stored", "message_id": message.id}), 201


# GET CHAT HISTORY
@main.route("/chat-history/<int:session_id>")
def chat_history(session_id):
    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    messages = Message.query.filter_by(
        session_id=session_id
    ).order_by(Message.created_at.asc()).all()

    return jsonify([
        {
            "sender": m.sender,
            "message": m.message_text,
            "time": m.created_at
        }
        for m in messages
    ])


# CLOSE SESSION
@main.route("/close-session/<int:session_id>", methods=["POST"])
def close_session(session_id):
    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    session.ended_at = datetime.utcnow()
    session.is_active = False

    db.session.commit()

    return jsonify({"message": "Session Closed"})
