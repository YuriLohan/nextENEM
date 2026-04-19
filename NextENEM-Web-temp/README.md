# NextENEM Web
 
Plataforma web de estudos para o ENEM — React + FastAPI + MySQL.
 
---
 
## Pré-requisitos
 
- Node.js 20 LTS
- Python 3.14
- MySQL rodando localmente (porta 3306)
- Git
 
---
 
## Estrutura do projeto
 
```
nextENEM/
└── NextENEM-Web/
    ├── backend/
    │   ├── .venv/
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   ├── auth.py
    │   │   └── questions.py
    │   ├── .env
    │   ├── database.py
    │   ├── main.py
    │   ├── models.py
    │   └── requirements.txt
    └── frontend/
        ├── src/
        │   ├── pages/
        │   │   ├── Login.tsx
        │   │   ├── Register.tsx
        │   │   ├── Home.tsx
        │   │   └── Questions.tsx
        │   ├── services/
        │   │   └── api.ts
        │   ├── App.tsx
        │   └── main.tsx
        ├── package.json
        └── vite.config.ts
```
 
---
 
## Configuração do banco de dados (MySQL)
 
1. Abra o MySQL e crie o banco:
 
```sql
CREATE DATABASE nextenem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nextenem;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) UNIQUE
);
DESCRIBE users;
SELECT * FROM users;

ALTER TABLE users ADD COLUMN study_area VARCHAR(100) DEFAULT NULL;
```
 
2. Certifique-se que o usuário `root` sem senha tem acesso, ou ajuste o `.env`.
 
---
 
## Rodando o Backend
 
```bash
# 1. Entre na pasta
cd NextENEM-Web-temp/backend
 
# 2. Ative o ambiente virtual
#caso você não tenha o venv instalado baixe ele por esse comando
python -m venv .venv
.venv\Scripts\activate       # Windows
 
# 3. Instale as dependências (apenas na primeira vez)
pip install -r requirements.txt
 
# 4. Configure o .env (copie o exemplo)
# Edite o arquivo .env com suas credenciais
 
# 5. Suba o servidor
uvicorn main:app --reload
```
 
O backend estará disponível em: **http://localhost:8000**
Documentação automática: **http://localhost:8000/docs**
 
---
 
## Rodando o Frontend
 
```bash
# 1. Entre na pasta
cd NextENEM-Web/frontend
 
# 2. Instale as dependências (apenas na primeira vez)
npm install
 
# 3. Suba o servidor
npm run dev
```
 
O frontend estará disponível em: **http://localhost:5173**
 
---

## Rodando o Aiosmtpd
```bash
# 1. Entre na pasta
cd NextENEM-Web/backend

#2. Ative o modo vent e instale o aiosmtpd
.venv\Scripts\activate
pip install aiosmtpd

#3. Rodar o servidor SMTP fake
python -m aiosmtpd -n -l localhost:1025
```

---
## Como rodar após tudo instalado
```bash
# 1. Terminal 1 — Backend
cd NextENEM-Web-temp/backend
.venv\Scripts\activate
uvicorn main:app --reload

# 2. Terminal 2 — SMTP fake (para o email de verificação funcionar)
cd NextENEM-Web-temp/backend
.venv\Scripts\activate
python -m aiosmtpd -n -l localhost:1025

# 3. Terminal 3 — Frontend
cd NextENEM-Web/frontend
npm run dev

Depois acesse http://localhost:5173 no navegador. Os três precisam estar rodando ao mesmo tempo para o sistema funcionar completo.
```
## Variáveis de ambiente (backend/.env)
 
```env
SECRET_KEY=sua-chave-secreta-aqui
DATABASE_URL=mysql+pymysql://root:@localhost:3306/nextenem
```
 
---
 
## Funcionalidades atuais
 
- Cadastro de usuário com verificação de email
- Login com JWT
- Tela Home com navegação
- Prática de questões do ENEM via API pública (enem.dev)
 
---
 
## Tecnologias
 
| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Estilização | Tailwind CSS v4 |
| Roteamento | React Router v6 |
| HTTP Client | Axios |
| Backend | Python + FastAPI |
| Autenticação | JWT (python-jose) |
| Banco de dados | MySQL + SQLAlchemy |
| Hash de senha | passlib + bcrypt |    