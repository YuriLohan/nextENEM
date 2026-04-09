from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from database import get_db
from models import User
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import uuid
import smtplib
from email.mime.text import MIMEText
import os
from fastapi.responses import RedirectResponse


load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-inseguro")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def send_verification_email(email: str, token: str):
    link = f"http://localhost:8000/auth/verify-email?token={token}"
    body = f"Olá! Por favor, confirme seu email clicando no link:\n\n{link}"

    print(f"[DEBUG] Link de verificação: {link}", flush=True)

    msg = MIMEText(body)
    msg['Subject'] = "NextENEM — Confirmação de Email"
    msg['From'] = "no-reply@nextenem.com"
    msg['To'] = email

    try:
        with smtplib.SMTP("localhost", 1025) as server:
            server.send_message(msg)
    except Exception as e:
        print(f"[WARN] Email não enviado (sem servidor SMTP local): {e}", flush=True)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    verification_token = str(uuid.uuid4())
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_verified=False,
        verification_token=verification_token
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, verification_token)

    # ✅ Retorna o link direto na resposta
    verification_link = f"http://localhost:8000/auth/verify-email?token={verification_token}"
    return {
        "message": "Usuário criado! Clique no link para verificar seu email.",
        "verification_link": verification_link
    }


@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email não verificado. Verifique seu email antes de fazer login."
        )

    token = create_token({"sub": user.email, "name": user.name})
    return {"access_token": token, "token_type": "bearer", "name": user.name}


@router.get("/verify-email")
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
    user.is_verified = True
    user.verification_token = None
    db.commit()
    print(f"[INFO] Usuário {user.email} verificado com sucesso!", flush=True)
    return RedirectResponse(url="http://localhost:5173/verified")

@router.get("/get-verification-link")
def get_verification_link(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email já verificado")
    if not user.verification_token:
        raise HTTPException(status_code=400, detail="Token não encontrado")
    link = f"http://localhost:8000/auth/verify-email?token={user.verification_token}"
    return {"verification_link": link}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_active": current_user.is_active
    }