from pydantic import BaseModel

class CourseOut(BaseModel):
    id: int
    name: str
    slug: str
    color: str

    class Config:
        orm_mode = True

class SubjectOut(BaseModel):
    id: int
    name: str
    course_id: int
    is_premium: bool
    progress: float = 0.0
    is_locked: bool = False

    class Config:
        orm_mode = True