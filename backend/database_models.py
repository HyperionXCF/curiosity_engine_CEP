from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, func
import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer , nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String)


class History(Base):
    __tablename__ = "history"

    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user_question = Column(String)
    topic = Column(String)
    ai_answer = Column(String)
    ai_counter_question = Column(String)
    searched_at = Column(DateTime(timezone=True), server_default=func.now())


class Session(Base):
    __tablename__ = "session"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    session_start = Column(DateTime(timezone=True), server_default=func.now())
    current_level = Column(Integer, default=1)


class Interest(Base):
    __tablename__ = "interest"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    score = Column(Integer, default=0)