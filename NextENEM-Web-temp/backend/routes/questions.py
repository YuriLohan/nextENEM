from fastapi import APIRouter, HTTPException
import httpx
import random

router = APIRouter()

ENEM_API_BASE = "https://api.enem.dev/v1"

# Anos disponíveis na API
AVAILABLE_YEARS = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]


@router.get("/random")
async def get_random_question():
    year = random.choice(AVAILABLE_YEARS)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Busca lista de questões do ano
            res = await client.get(f"{ENEM_API_BASE}/exams/{year}/questions")
            res.raise_for_status()
            questions = res.json()

            if not questions:
                raise HTTPException(status_code=404, detail="Nenhuma questão encontrada")

            question = random.choice(questions)
            return question

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar questão: {str(e)}")


@router.get("/by-year/{year}")
async def get_questions_by_year(year: int):
    if year not in AVAILABLE_YEARS:
        raise HTTPException(status_code=400, detail=f"Ano inválido. Disponíveis: {AVAILABLE_YEARS}")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(f"{ENEM_API_BASE}/exams/{year}/questions")
            res.raise_for_status()
            return res.json()

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar questões: {str(e)}")