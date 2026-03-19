# nextENEM

Plataforma mobile de estudos para o ENEM com React Native e FastAPI.

## Como rodar

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python database/seed.py
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
npm install
npx expo start --clear
```

## Stack
- **Frontend:** React Native + Expo + TypeScript
- **Backend:** Python + FastAPI + SQLite
