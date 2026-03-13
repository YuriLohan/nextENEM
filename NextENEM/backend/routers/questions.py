from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from database.database import get_db
from schemas.question import QuestionOut, AnswerIn, AnswerResult
from services.auth_service import get_current_user
from models.question import Question, UserAnswer
from models.course import Subject

router = APIRouter(prefix="/questions", tags=["Questions"])

def _serialize_question(q: Question) -> QuestionOut:
    return QuestionOut(
        id=q.id,
        code=q.code,
        subject=q.subject.name,
        difficulty=q.difficulty.value,
        statement=q.statement,
        options=[{"key": o.key, "text": o.text} for o in q.options],
        hint=q.hint,
    )

@router.get("", response_model=List[QuestionOut])
def list_questions(
    subject_id: int,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    questions = (
        db.query(Question)
        .filter(Question.subject_id == subject_id)
        .limit(limit)
        .all()
    )
    return [_serialize_question(q) for q in questions]

@router.post("/{question_id}/answer", response_model=AnswerResult)
def answer_question(
    question_id: int,
    payload: AnswerIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Questão não encontrada.")

    correct_option = next((o for o in question.options if o.is_correct), None)
    if not correct_option:
        raise HTTPException(status_code=500, detail="Questão sem gabarito.")

    is_correct = payload.selected_key.upper() == correct_option.key

    db.add(UserAnswer(
        user_id=current_user.id,
        question_id=question.id,
        selected_key=payload.selected_key.upper(),
        is_correct=is_correct,
    ))
    db.commit()

    return AnswerResult(
        is_correct=is_correct,
        correct_key=correct_option.key,
        explanation=question.explanation or f"A alternativa correta é {correct_option.key}.",
    )