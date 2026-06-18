from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import University

router = APIRouter()

def _normalize(text: str) -> str:
    import unicodedata
    if not text:
        return ""
    # Remove acentos, espaços extras nas pontas e joga tudo para minúsculo
    return unicodedata.normalize("NFD", text.strip().lower()).encode("ascii", "ignore").decode()

@router.get("/search")
def search_universities(
    estado: str = Query(..., min_length=2, max_length=2),
    cidade: str = Query(default=""),
    curso: str = Query(default=""),
    db: Session = Depends(get_db)
):
    # 1. Buscamos todas as universidades do Estado de uma vez (GARANTE que Juazeiro do Norte vem junto)
    universities = (
        db.query(University)
        .options(joinedload(University.courses))
        .filter(University.estado == estado.upper())
        .all()
    )

    # 2. Filtragem de CIDADE feita direto no Python (Super segura contra espaços e acentos)
    if cidade.strip():
        cidade_norm = _normalize(cidade)
        universities = [
            u for u in universities
            if cidade_norm in _normalize(u.cidade)
        ]

    # 3. Filtragem de CURSO feita no Python
    if curso.strip():
        curso_norm = _normalize(curso)
        universities = [
            u for u in universities
            if any(curso_norm in _normalize(c.curso) or _normalize(c.curso) in curso_norm
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