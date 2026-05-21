from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Answer
from routes.auth import get_current_user
import httpx
import random

router = APIRouter()

ENEM_API_BASE = "https://api.enem.dev/v1"
AVAILABLE_YEARS = [2018, 2019, 2020, 2021, 2022] # Anos mais recentes e estáveis com essa estrutura

@router.get("/random")
async def get_random_question(discipline: str = None):
    years_to_try = AVAILABLE_YEARS.copy()
    random.shuffle(years_to_try)

    # Dicionário com os offsets cirúrgicos que você descobriu!
    DISCIPLINE_MAP = {
        "linguagens": {"offset": 1, "limit": 45},
        "ciencias-humanas": {"offset": 46, "limit": 45},
        "ciencias-da-natureza": {"offset": 91, "limit": 45},
        "matematica": {"offset": 136, "limit": 45}
    }

    while years_to_try:
        year = years_to_try.pop()
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Se o usuário escolheu uma disciplina válida, usamos os seus parâmetros de offset
                if discipline and discipline in DISCIPLINE_MAP:
                    config = DISCIPLINE_MAP[discipline]
                    url = f"{ENEM_API_BASE}/exams/{year}/questions?limit={config['limit']}&offset={config['offset']}"
                else:
                    # Modo geral (Simulado Aleatório) puxa o escopo completo da prova
                    url = f"{ENEM_API_BASE}/exams/{year}/questions?limit=180" # TODO ajeitar o simulado aleatório que ele não está funcionando
                
                res = await client.get(url)
                
                if res.status_code != 200:
                    continue
                
                data = res.json()
                questions = data.get("questions", data) if isinstance(data, dict) else data

                if questions:
                    return random.choice(questions)

        except Exception as e:
            print(f"Erro ao acessar os dados do ano {year}: {e}")
            continue

    raise HTTPException(
        status_code=404, 
        detail=f"Não conseguimos resgatar questões de '{discipline}' nas instâncias remotas."
    )


# ─────────────────────────────────────────
# Schema — AnswerPayload
# ─────────────────────────────────────────
class AnswerPayload(BaseModel):
    question_index: int
    year: int
    discipline: str
    selected: str
    correct: str
    is_correct: bool


# ─────────────────────────────────────────
# Rota — POST /answer
# Salva a resposta do usuário no banco
# ─────────────────────────────────────────
@router.post("/answer")
def save_answer(
    payload: AnswerPayload,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    answer = Answer(
        user_id=current_user.id,
        question_index=payload.question_index,
        year=payload.year,
        discipline=payload.discipline,
        selected=payload.selected,
        correct=payload.correct,
        is_correct=payload.is_correct,
    )
    db.add(answer)
    db.commit()
    return {"message": "Resposta salva"}


# ─────────────────────────────────────────
# Rota — GET /performance
# Desempenho do usuário por área
# ─────────────────────────────────────────
@router.get("/performance")
def get_performance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    answers = db.query(Answer).filter(Answer.user_id == current_user.id).all()

    if not answers:
        return {"total": 0, "correct": 0, "score": 0, "by_discipline": {}}

    total = len(answers)
    correct = sum(1 for a in answers if a.is_correct)
    score = round((correct / total) * 100)

    by_discipline: dict = {}
    for a in answers:
        d = a.discipline
        if d not in by_discipline:
            by_discipline[d] = {"total": 0, "correct": 0}
        by_discipline[d]["total"] += 1
        if a.is_correct:
            by_discipline[d]["correct"] += 1

    for d in by_discipline:
        t = by_discipline[d]["total"]
        c = by_discipline[d]["correct"]
        by_discipline[d]["score"] = round((c / t) * 100)

    return {
        "total": total,
        "correct": correct,
        "score": score,
        "by_discipline": by_discipline,
    }