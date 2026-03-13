from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    is_premium = Column(Boolean, default=False)
    selected_course_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())