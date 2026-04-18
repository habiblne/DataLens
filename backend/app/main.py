from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, upload

load_dotenv()

app = FastAPI(
    title="DataLens API",
    description="Upload CSV files and ask natural-language questions safely.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
