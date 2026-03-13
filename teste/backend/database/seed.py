import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import engine, SessionLocal, Base
import models.user
import models.course
import models.question
from models.course import Course, Subject
from models.question import Question, QuestionOption, DifficultyEnum

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🌱 Criando dados iniciais...")

# Cursos
courses_data = [
    {"name": "Medicina", "slug": "medicina", "color": "#E53935"},
    {"name": "Direito", "slug": "direito", "color": "#43A047"},
    {"name": "Computação", "slug": "computacao", "color": "#1E88E5"},
    {"name": "Outros", "slug": "outros", "color": "#FB8C00"},
]
courses = {}
for cd in courses_data:
    existing = db.query(Course).filter_by(slug=cd["slug"]).first()
    if not existing:
        c = Course(**cd)
        db.add(c)
        db.flush()
        courses[cd["slug"]] = c
    else:
        courses[cd["slug"]] = existing

# Matérias
subjects_data = [
    {"name": "Matemática Básica", "course_slug": "medicina", "is_premium": False},
    {"name": "Geometria", "course_slug": "medicina", "is_premium": False},
    {"name": "Trigonometria", "course_slug": "medicina", "is_premium": True},
    {"name": "Estatística", "course_slug": "medicina", "is_premium": True},
    {"name": "Português", "course_slug": "direito", "is_premium": False},
    {"name": "Redação", "course_slug": "direito", "is_premium": False},
    {"name": "Lógica", "course_slug": "computacao", "is_premium": False},
    {"name": "Programação", "course_slug": "computacao", "is_premium": True},
]
subjects = {}
for sd in subjects_data:
    course = courses.get(sd["course_slug"])
    if not course:
        continue
    existing = db.query(Subject).filter_by(name=sd["name"], course_id=course.id).first()
    if not existing:
        s = Subject(name=sd["name"], course_id=course.id, is_premium=sd["is_premium"])
        db.add(s)
        db.flush()
        subjects[sd["name"]] = s
    else:
        subjects[sd["name"]] = existing

# Questões
questions_data = [
    {
        "code": "QT110",
        "subject_name": "Geometria",
        "difficulty": DifficultyEnum.facil,
        "statement": "Qual é a área de um triângulo de base 6 cm e altura 4 cm?",
        "hint": "Área = base × altura / 2",
        "explanation": "Área = 6 × 4 / 2 = 12 cm²",
        "options": [
            {"key": "A", "text": "10 cm²", "is_correct": False},
            {"key": "B", "text": "12 cm²", "is_correct": True},
            {"key": "C", "text": "24 cm²", "is_correct": False},
            {"key": "D", "text": "18 cm²", "is_correct": False},
        ],
    },
    {
        "code": "QT111",
        "subject_name": "Geometria",
        "difficulty": DifficultyEnum.medio,
        "statement": "Um círculo tem raio de 5 cm. Qual é a sua área aproximada? (π ≈ 3,14)",
        "hint": "Área = π × r²",
        "explanation": "Área = 3,14 × 25 = 78,5 cm²",
        "options": [
            {"key": "A", "text": "31,4 cm²", "is_correct": False},
            {"key": "B", "text": "78,5 cm²", "is_correct": True},
            {"key": "C", "text": "62,8 cm²", "is_correct": False},
            {"key": "D", "text": "157 cm²", "is_correct": False},
        ],
    },
    {
        "code": "QT112",
        "subject_name": "Matemática Básica",
        "difficulty": DifficultyEnum.facil,
        "statement": "Qual é o resultado de 2³ + √16?",
        "hint": "2³ = 8 e √16 = 4",
        "explanation": "2³ = 8 e √16 = 4, portanto 8 + 4 = 12",
        "options": [
            {"key": "A", "text": "10", "is_correct": False},
            {"key": "B", "text": "14", "is_correct": False},
            {"key": "C", "text": "12", "is_correct": True},
            {"key": "D", "text": "16", "is_correct": False},
        ],
    },
]
for qd in questions_data:
    if db.query(Question).filter_by(code=qd["code"]).first():
        continue
    subject = subjects.get(qd["subject_name"])
    if not subject:
        continue
    q = Question(
        code=qd["code"],
        subject_id=subject.id,
        difficulty=qd["difficulty"],
        statement=qd["statement"],
        hint=qd.get("hint"),
        explanation=qd.get("explanation"),
    )
    db.add(q)
    db.flush()
    for opt in qd["options"]:
        db.add(QuestionOption(question_id=q.id, **opt))

db.commit()
print("✅ Seed concluído!")
db.close()