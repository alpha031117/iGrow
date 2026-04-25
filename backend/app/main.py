from fastapi import FastAPI
from app.routes import transactions, financing

app = FastAPI(title="iGlow API", version="1.0.0")

app.include_router(transactions.router)
app.include_router(financing.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
