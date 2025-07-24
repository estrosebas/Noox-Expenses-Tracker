from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import Dict
from sqlalchemy import func

router = APIRouter(prefix="/summary", tags=["summary"])

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
