from fastapi import FastAPI
from app.db.init_db import init_db
from app.api import auth, providers, transactions

app = FastAPI(title="Noox Expenses Tracker API")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router)
app.include_router(providers.router)
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"message": "Noox Expenses Tracker API is running!"}
