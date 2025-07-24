from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import Dict, List
import calendar

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.get("/chart", response_model=Dict[str, List])
def get_expense_chart(
    period: str = Query("monthly", description="Periodo de agrupación: monthly"),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Agrupar por mes y año
    results = db.query(
        extract('year', Transaction.date).label('year'),
        extract('month', Transaction.date).label('month'),
        func.sum(
            case((Transaction.type == TransactionTypeEnum.salida, Transaction.amount), else_=0)
        ).label('expenses'),
        func.sum(
            case((Transaction.type == TransactionTypeEnum.entrada, Transaction.amount), else_=0)
        ).label('income')
    ).filter(
        Transaction.user_id == user.id
    ).group_by('year', 'month')
    
    # Ordenar por año y mes
    results = results.order_by('year', 'month').all()

    labels = []
    expenses = []
    income = []
    for row in results:
        month_name = calendar.month_abbr[int(row.month)]
        labels.append(month_name)
        expenses.append(float(row.expenses))
        income.append(float(row.income))

    return {
        "labels": labels,
        "expenses": expenses,
        "income": income
    }
