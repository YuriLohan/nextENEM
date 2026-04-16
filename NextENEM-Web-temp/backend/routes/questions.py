from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Answer
from routes.auth import get_current_user
import httpx
import random
import unicodedata

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

def remove_accents(input_str):
    if not input_str: return ""
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

@router.get("/random")
async def get_random_question(discipline: str = None):
    # Vamos tentar no máximo em 3 anos diferentes para não travar o servidor
    attempts = 0
    max_attempts = 3
    
    # Copia a lista de anos para sortear sem repetir
    years_to_try = AVAILABLE_YEARS.copy()
    random.shuffle(years_to_try)

    while attempts < max_attempts and years_to_try:
        year = years_to_try.pop()
        attempts += 1
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client: # Aumentei para 15s
                url = f"{ENEM_API_BASE}/exams/{year}/questions"
                res = await client.get(url)
                
                if res.status_code != 200:
                    continue # Tenta o próximo ano se este der erro na API externa
                
                data = res.json()
                questions = data.get("questions", data) if isinstance(data, dict) else data

                if discipline:
                    search_term = remove_accents(discipline.lower())
                    filtered = [
                        q for q in questions 
                        if search_term in remove_accents(q.get("discipline", "").lower())
                    ]
                    
                    if filtered:
                        return random.choice(filtered)
                    # Se não achou a disciplina neste ano, o loop continua para o próximo attempt
                else:
                    return random.choice(questions)

        except (httpx.HTTPError, Exception) as e:
            print(f"Erro ao acessar ano {year}: {e}")
            continue # Tenta o próximo ano

    # Se sair do loop sem retornar, é porque realmente não achou
    raise HTTPException(
        status_code=404, 
        detail=f"Não encontramos questões de '{discipline}' após várias tentativas."
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