from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal, engine, Base
from models import Usuario

app = FastAPI()

# Criar tabelas no banco
Base.metadata.create_all(bind=engine)

# Servir arquivos estáticos (CSS e JS)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# ========================
# 📌 MODELOS (Pydantic)
# ========================

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioLogin(BaseModel):
    email: str
    senha: str

# ========================
# 📌 CONEXÃO COM BANCO
# ========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========================
# 📌 ROTAS DE PÁGINA
# ========================

@app.get("/")
def login_page():
    return FileResponse("frontend/login.html")

@app.get("/cadastro")
def cadastro_page():
    return FileResponse("frontend/cadastro.html")

# ========================
# 📌 ROTAS DA API
# ========================

@app.post("/usuarios")
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica se email já existe
    if db.query(Usuario).filter(Usuario.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="Email já existe")

    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=usuario.senha
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return {"mensagem": "Usuário criado"}

@app.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@app.post("/login")
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(
        Usuario.email == usuario.email,
        Usuario.senha == usuario.senha
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")

    return {"mensagem": "Login ok"}