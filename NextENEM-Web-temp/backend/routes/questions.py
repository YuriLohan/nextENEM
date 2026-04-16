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

AVAILABLE_YEARS = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]


# ─────────────────────────────────────────
# Rota — GET /disciplines
# Retorna as áreas disponíveis
# ─────────────────────────────────────────
@router.get("/disciplines")
def get_disciplines():
    return [
        {"value": "matematica", "label": "Matemática"},
        {"value": "linguagens", "label": "Linguagens"},
        {"value": "ciencias-humanas", "label": "Ciências Humanas"},
        {"value": "ciencias-da-natureza", "label": "Ciências da Natureza"},
    ]


# ─────────────────────────────────────────
# Rota — GET /random
# Questão aleatória com filtro opcional
# ─────────────────────────────────────────
@router.get("/random")
async def get_random_question(discipline: str = None):
    year = random.choice(AVAILABLE_YEARS)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{ENEM_API_BASE}/exams/{year}/questions"
            if discipline:
                url += f"?discipline={discipline}"

            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            questions = data.get("questions", data) if isinstance(data, dict) else data

            if not questions:
                raise HTTPException(status_code=404, detail="Nenhuma questão encontrada")

            return random.choice(questions)

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar questão: {str(e)}")


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