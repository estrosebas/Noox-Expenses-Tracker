
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api import auth, providers, transactions, summary, expenses


app = FastAPI(title="Noox Expenses Tracker API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a los orígenes específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router)
app.include_router(providers.router)
app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(expenses.router)

@app.get("/")
def root():
    return {"message": "Noox Expenses Tracker API is running!"}
