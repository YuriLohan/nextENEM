from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine, Base
import models.user
import models.course
import models.question

from routers import auth, courses, questions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NextENEM API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(questions.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "NextENEM API"}