from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import transactions, analytics

app = FastAPI(title="iGrow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(analytics.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
