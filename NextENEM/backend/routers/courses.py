from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from schemas.course import CourseOut, SubjectOut
from services.auth_service import get_current_user
from models.course import Course, Subject, UserSubjectProgress

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.post("/{course_id}/select")
def select_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user.selected_course_id = course_id
    db.commit()
    return {"message": "Curso selecionado com sucesso."}

@router.get("/{course_id}/subjects", response_model=List[SubjectOut])
def list_subjects(
    course_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subjects = db.query(Subject).filter(Subject.course_id == course_id).all()
    result = []
    for s in subjects:
        progress_row = (
            db.query(UserSubjectProgress)
            .filter_by(user_id=current_user.id, subject_id=s.id)
            .first()
        )
        progress = progress_row.progress if progress_row else 0.0
        is_locked = s.is_premium and not current_user.is_premium
        result.append(
            SubjectOut(
                id=s.id,
                name=s.name,
                course_id=s.course_id,
                is_premium=s.is_premium,
                progress=progress,
                is_locked=is_locked,
            )
        )
    return result