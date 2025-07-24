from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import Dict, List
import calendar

router = APIRouter(prefix="/expenses", tags=["expenses"])

# Endpoint para desglose de gastos por categoría (subject)
@router.get("/categories/breakdown", response_model=List[Dict])
def category_breakdown(
    period: str = Query("monthly", description="Periodo de agrupación: monthly"),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Agrupar por subject (categoría) y sumar solo gastos (salida)
    q = db.query(
        Transaction.subject.label("name"),
        func.sum(Transaction.amount).label("amount")
    ).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.salida
    ).group_by(Transaction.subject)

    q = q.order_by(func.sum(Transaction.amount).desc())
    results = q.all()

    total = sum([float(r.amount) for r in results]) or 1.0
    # Colores de ejemplo (puedes ajustar o mapear por subject)
    colors = ["#06B6D4", "#8B5CF6", "#F59E42", "#F43F5E", "#22C55E", "#EAB308"]
    breakdown = []
    for idx, r in enumerate(results):
        breakdown.append({
            "name": r.name,
            "amount": float(r.amount),
            "color": colors[idx % len(colors)],
            "percentage": round((float(r.amount) / total) * 100, 1)
        })
    return breakdown


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
