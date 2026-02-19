from datetime import datetime

from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.Text, nullable=False)
    grade_level = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    chat_sessions = db.relationship(
        "ChatSession", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    topic_interests = db.relationship(
        "UserTopic", backref="user", lazy=True, cascade="all, delete-orphan"
    )


class ChatSession(db.Model):
    __tablename__ = "chat_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    session_title = db.Column(db.String(200), nullable=False, default="New Chat")
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    messages = db.relationship(
        "Message", backref="session", lazy=True, cascade="all, delete-orphan"
    )


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(
        db.Integer,
        db.ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender = db.Column(db.String(50), nullable=False)
    message_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)


class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    topic_name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    subject = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user_interests = db.relationship(
        "UserTopic", backref="topic", lazy=True, cascade="all, delete-orphan"
    )


class UserTopic(db.Model):
    __tablename__ = "user_topics"
    __table_args__ = (
        db.UniqueConstraint("user_id", "topic_id", name="uq_user_topic"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    topic_id = db.Column(
        db.Integer, db.ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True
    )
    interest_score = db.Column(db.Integer, nullable=False, default=0)
    last_interaction = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
