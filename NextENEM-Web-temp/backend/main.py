# ─────────────────────────────────────────
# Importações
# FastAPI, CORS, banco de dados e rotas
# ─────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, questions


# ─────────────────────────────────────────
# Inicialização do banco
# Cria as tabelas automaticamente com base
# nos models definidos no SQLAlchemy
# ─────────────────────────────────────────
Base.metadata.create_all(bind=engine)


# ─────────────────────────────────────────
# Instância da aplicação
# ─────────────────────────────────────────
app = FastAPI(title="NextENEM API")


# ─────────────────────────────────────────
# Middleware — CORS
# Permite requisições do frontend em
# desenvolvimento (localhost:5173)
# ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────
# Rotas
# Registra os roteadores de auth e questões
# com seus respectivos prefixos e tags
# ─────────────────────────────────────────
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(questions.router, prefix="/questions", tags=["questions"])


# ─────────────────────────────────────────
# Rota — GET /
# Health check simples para confirmar
# que a API está no ar
# ─────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "NextENEM API rodando!"}