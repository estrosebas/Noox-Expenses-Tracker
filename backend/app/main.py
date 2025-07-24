
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api import auth, providers, transactions, summary, expenses, analytics, reports
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="Noox Expenses Tracker API")
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

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
app.include_router(analytics.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "Noox Expenses Tracker API is running!"}
