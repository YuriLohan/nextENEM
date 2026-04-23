from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from database import get_db
from models import University, UniversityCourse

router = APIRouter()


# ─────────────────────────────────────────
# Rota — GET /universities/search
# Filtra por estado, cidade e curso.
# O campo "curso" é normalizado para
# facilitar comparação sem acento.
# ─────────────────────────────────────────
@router.get("/search")
def search_universities(
    estado: str = Query(..., min_length=2, max_length=2),
    cidade: str = Query(default=""),
    curso: str = Query(default=""),
    db: Session = Depends(get_db)
):
    query = (
        db.query(University)
        .options(joinedload(University.courses))
        .filter(University.estado == estado.upper())
    )

    if cidade.strip():
        query = query.filter(
            func.lower(University.cidade).contains(cidade.strip().lower())
        )

    universities = query.all()

    # Filtra por curso no Python para suportar comparação sem acento
    if curso.strip():
        curso_norm = _normalize(curso.strip())
        universities = [
            u for u in universities
            if any(_normalize(c.curso) == curso_norm or curso_norm in _normalize(c.curso)
                   for c in u.courses)
        ]

    return [
        {
            "id": u.id,
            "instituicao": u.nome,
            "estado": u.estado,
            "cidade": u.cidade,
            "endereco": u.endereco,
            "cursos": [c.curso for c in u.courses],
        }
        for u in universities
    ]


def _normalize(text: str) -> str:
    import unicodedata
    return unicodedata.normalize("NFD", text.lower()).encode("ascii", "ignore").decode()