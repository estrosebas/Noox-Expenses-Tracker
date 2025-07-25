import os
import requests
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import Dict
from sqlalchemy import func

router = APIRouter(prefix="/summary", tags=["summary"])

# Endpoint para IA (Gemini)
from fastapi import Body

@router.post("/monthly-ai")
def get_monthly_summary_ai(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    user_message: str = Body(default="", embed=True)
):
    # 1. Obtener datos igual que /monthly
    income = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.entrada
    ).scalar() or 0.0

    expenses = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.salida
    ).scalar() or 0.0

    savings = income - expenses
    budget_left = savings


    # 2. Formatear datos en texto plano (incluye nombre del usuario)
    datos_texto = f"Usuario: {getattr(user, 'nombre', getattr(user, 'name', ''))}\nResumen mensual:\nIngresos: S/ {income}\nGastos: S/ {expenses}\nAhorros: S/ {savings}\nPresupuesto restante: S/ {budget_left}"

    # 3. Prompt base para Gemini
    prompt_base = "Eres un asistente financiero. Analiza el siguiente resumen y genera una recomendación personalizada para el usuario se breve y evita hablar de criptos o inversiones que no sean seguras evitar ser muy tecnico o usar palabras o terminos complicados, de preferencia menciona los montos del resumen o detalles importantes. "

    prompt_final = prompt_base + datos_texto + "\nMensaje del usuario: " + user_message

    # 4. Preparar request a Gemini
    # La API key debe estar definida en el archivo .env como:
    # GEMINI_API_KEY=tu_api_key_aqui
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"success": False, "message": "No se encontró la API key de Gemini. Defínela en el archivo .env como GEMINI_API_KEY=tu_api_key_aqui"}
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key
    }
    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_final}
                ]
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=body, timeout=15)
        response.raise_for_status()
        data = response.json()
        # Extraer texto generado
        text = ""
        if "candidates" in data and data["candidates"]:
            text = data["candidates"][0]["content"]["parts"][0].get("text", "")
            # Sanitizar respuesta: quitar saltos de línea y markdown
            import re
            text = re.sub(r"\n+", " ", text)  # reemplaza saltos de línea por espacio
            text = re.sub(r"\*\*|__|\*|_", "", text)  # quita markdown bold/italic
            text = re.sub(r"\s{2,}", " ", text)  # colapsa espacios múltiples
            text = text.strip()
        return {"success": True, "message": text}
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/monthly", response_model=Dict[str, float])
def get_monthly_summary(db: Session = Depends(get_db), user=Depends(get_current_user)):

    income = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.entrada
    ).scalar() or 0.0

    expenses = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.salida
    ).scalar() or 0.0

    savings = income - expenses
    budget_left = savings  # Por ahora igual a savings

    return {
        "expenses": float(expenses),
        "income": float(income),
        "savings": float(savings),
        "budget_left": float(budget_left)
    }
