from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, questions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NextENEM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(questions.router, prefix="/questions", tags=["questions"])

@app.get("/")
def root():
    return {"message": "NextENEM API rodando!"}