from pydantic import BaseModel
from typing import List, Optional

class QuestionOptionOut(BaseModel):
    key: str
    text: str

    class Config:
        orm_mode = True

class QuestionOut(BaseModel):
    id: int
    code: str
    subject: str
    difficulty: str
    statement: str
    options: List[QuestionOptionOut]
    hint: Optional[str] = None

    class Config:
        orm_mode = True

class AnswerIn(BaseModel):
    selected_key: str

class AnswerResult(BaseModel):
    is_correct: bool
    correct_key: str
    explanation: str