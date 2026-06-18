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
    study_area VARCHAR(100)
);

CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    estado CHAR(2) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    endereco VARCHAR(255)
);

CREATE TABLE university_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    curso VARCHAR(100) NOT NULL,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

DESCRIBE users;
SELECT * FROM users;

INSERT INTO universities (nome, estado, cidade, endereco) VALUES
('Universidade Federal do Ceará (UFC)', 'CE', 'Fortaleza', 'Av. da Universidade, 2853, Fortaleza - CE'),
('Universidade Regional do Cariri (URCA)', 'CE', 'Crato', 'Rua Cel. Antônio Luiz, 1161, Crato - CE'),
('Faculdade Leão Sampaio (FLS)', 'CE', 'Crato', 'Av. Leão Sampaio, 612, Juazeiro do Norte - CE'),
('Centro Universitário Dr. Leão Sampaio (UNILEÃO)', 'CE', 'Crato', 'Av. Leão Sampaio, 612, Juazeiro do Norte - CE'),
('Universidade Federal do Ceará - Campus Sobral (UFC)', 'CE', 'Sobral', 'Rua Coronel Estanislau Frota, s/n, Sobral - CE'),
('Universidade Estadual Vale do Acaraú (UVA)', 'CE', 'Sobral', 'Av. da Universidade, 850, Sobral - CE'),
('Faculdade Luciano Feijão (FLF)', 'CE', 'Sobral', 'Rua José Martins Duque, 296, Sobral - CE'),
('Universidade de São Paulo (USP)', 'SP', 'São Paulo', 'Rua da Reitoria, 374, São Paulo - SP'),
('Universidade Estadual Paulista (UNESP)', 'SP', 'São Paulo', 'Av. Engenheiro Luiz Edmundo Carrijo Coube, 14-01, Bauru - SP'),
('Universidade Estadual de Campinas (UNICAMP)', 'SP', 'Campinas', 'Cidade Universitária Zeferino Vaz, Campinas - SP'),
('Universidade São Francisco (USF)', 'SP', 'Campinas', 'Av. São Francisco de Assis, 218, Bragança Paulista - SP'),
('Universidade Federal de Minas Gerais (UFMG)', 'MG', 'Belo Horizonte', 'Av. Antônio Carlos, 6627, Belo Horizonte - MG'),
('Universidade Federal do Rio de Janeiro (UFRJ)', 'RJ', 'Rio de Janeiro', 'Av. Pedro Calmon, 550, Rio de Janeiro - RJ'),
('Universidade de Brasília (UnB)', 'DF', 'Brasília', 'Campus Universitário Darcy Ribeiro, Brasília - DF'),
('Universidade Federal de Pernambuco (UFPE)', 'PE', 'Recife', 'Av. Prof. Moraes Rego, 1235, Recife - PE');

INSERT INTO university_courses (university_id, curso) VALUES
-- 1 UFC Fortaleza
(1,'medicina'),(1,'direito'),(1,'computacao'),(1,'engenharia'),(1,'administracao'),
-- 2 URCA
(2,'medicina'),(2,'direito'),(2,'enfermagem'),(2,'pedagogia'),
-- 3 FLS
(3,'direito'),(3,'administracao'),(3,'psicologia'),
-- 4 UNILEÃO
(4,'medicina'),(4,'direito'),(4,'enfermagem'),(4,'psicologia'),
-- 5 UFC Sobral
(5,'medicina'),(5,'engenharia'),(5,'computacao'),
-- 6 UVA
(6,'direito'),(6,'pedagogia'),(6,'administracao'),
-- 7 FLF
(7,'direito'),(7,'administracao'),(7,'computacao'),
-- 8 USP
(8,'medicina'),(8,'direito'),(8,'engenharia'),(8,'computacao'),
-- 9 UNESP
(9,'medicina'),(9,'direito'),(9,'engenharia'),
-- 10 UNICAMP
(10,'medicina'),(10,'computacao'),(10,'engenharia'),
-- 11 USF
(11,'medicina'),(11,'direito'),(11,'psicologia'),
-- 12 UFMG
(12,'medicina'),(12,'direito'),(12,'engenharia'),
-- 13 UFRJ
(13,'medicina'),(13,'direito'),(13,'engenharia'),
-- 14 UnB
(14,'medicina'),(14,'direito'),(14,'computacao'),
-- 15 UFPE
(15,'medicina'),(15,'direito'),(15,'engenharia');
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