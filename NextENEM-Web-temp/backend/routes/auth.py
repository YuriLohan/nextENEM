from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from database import get_db
from models import User
from fastapi.security import OAuth2PasswordBearer
import uuid
import smtplib
from email.mime.text import MIMEText
import webbrowser  # 🔹 novo
import time

router = APIRouter()

SECRET_KEY = "nextenem-secret-key"
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
    body = f"Olá! Por favor, confirme seu email clicando no link: {link}"

    # 🔹 debug: imprime link e abre automaticamente no navegador
    print(f"[DEBUG] Link para ativação: {link}", flush=True)
    try:
        time.sleep(0.5)  # pequeno delay para evitar travar
        webbrowser.open(link)
    except Exception as e:
        print(f"[WARN] Não foi possível abrir o navegador: {e}", flush=True)

    msg = MIMEText(body)
    msg['Subject'] = "Confirmação de Email"
    msg['From'] = "no-reply@seusite.com"
    msg['To'] = email

    try:
        with smtplib.SMTP("localhost", 1025) as server:
            server.send_message(msg)
    except Exception as e:
        print(f"[WARN] Não foi possível enviar email: {e}", flush=True)

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
    
    return {"message": "Usuário criado com sucesso. Verifique seu email para ativar a conta."}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    if not user.is_verified:
        if user.verification_token:
            link = f"http://localhost:8000/auth/verify-email?token={user.verification_token}"
            print(f"[DEBUG] Usuário não verificado. Link de ativação: {link}", flush=True)
            try:
                time.sleep(0.5)
                webbrowser.open(link)
            except Exception as e:
                print(f"[WARN] Não foi possível abrir o navegador: {e}", flush=True)
        raise HTTPException(status_code=400, detail="Email não verificado. Por favor, verifique seu email.")
    
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
    return {"message": "Email verificado com sucesso. Agora você pode fazer login."}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_active": current_user.is_active
    }