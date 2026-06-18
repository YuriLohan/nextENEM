from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


# ─────────────────────────────────────────
# Model — User
# ─────────────────────────────────────────
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True, unique=True)
    study_area = Column(String(100), nullable=True) 

    answers = relationship("Answer", back_populates="user")


# ─────────────────────────────────────────
# Model — Answer
# Registra cada resposta do usuário
# ─────────────────────────────────────────
class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    question_index = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    discipline = Column(String(255), nullable=False)

    selected = Column(String(1), nullable=False)
    correct = Column(String(1), nullable=False)
    is_correct = Column(Boolean, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="answers")

# ─────────────────────────────────────────
# Model — Questions
# ─────────────────────────────────────────
class QuestionCache(Base):
    __tablename__ = "question_cache"

    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    discipline = Column(String(255), nullable=False)
    context = Column(Text, nullable=True)
    alternatives_introduction = Column(Text, nullable=True)
    correct_alternative = Column(String(1), nullable=False)
    
    # Salvamos arrays complexos (como as alternativas e os links de imagens) como JSON string 
    # para manter compatibilidade total tanto com SQLite quanto com MySQL
    alternatives = Column(Text, nullable=False)  # Armazenará o JSON das alternativas em string
    files = Column(Text, nullable=True)          # Armazenará a lista de URLs de imagens em string

    created_at = Column(DateTime(timezone=True), server_default=func.now())
# ─────────────────────────────────────────
# Model — University
# ─────────────────────────────────────────
class University(Base):
    __tablename__ = "universities"
 
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    estado = Column(String(2), nullable=False, index=True)
    cidade = Column(String(100), nullable=False)
    endereco = Column(String(255))
 
    courses = relationship("UniversityCourse", back_populates="university", cascade="all, delete")

# ─────────────────────────────────────────
# Model — UniversityCourse
# ─────────────────────────────────────────
class UniversityCourse(Base):
    __tablename__ = "university_courses"
 
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    curso = Column(String(100), nullable=False)
 
    university = relationship("University", back_populates="courses")

