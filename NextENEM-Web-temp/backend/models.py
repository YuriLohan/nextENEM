from sqlalchemy import Column, Integer, String, Boolean
from database import Base


# ─────────────────────────────────────────
# Model — User
# Representa a tabela "users" no banco.
# Armazena dados de autenticação e controle
# de verificação de email por token UUID
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