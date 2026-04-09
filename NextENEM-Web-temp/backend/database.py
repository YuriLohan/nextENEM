from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os


# ─────────────────────────────────────────
# Configuração do banco de dados
# Lê a URL de conexão do .env, com fallback
# para MySQL local sem senha (desenvolvimento)
# ─────────────────────────────────────────
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/nextenem")

engine = create_engine(DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ─────────────────────────────────────────
# Dependência — get_db
# Abre uma sessão por requisição e garante
# o fechamento mesmo em caso de erro
# ─────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()