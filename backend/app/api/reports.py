from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import List, Optional
import datetime

router = APIRouter(prefix="/reports", tags=["reports"])

class ReportRequest(BaseModel):
    type: str  # 'summary' o 'all'
    period: str  # 'monthly' o 'year'
    categories: Optional[List[str]] = None

@router.post("/generate")
def generate_report(
    req: ReportRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Filtros base
    query = db.query(Transaction).filter(Transaction.user_id == user.id)
    if req.categories:
        query = query.filter(Transaction.subject.in_(req.categories))

    # Filtro de periodo
    now = datetime.datetime.now()
    if req.period == "monthly":
        query = query.filter(
            extract('year', Transaction.date) == now.year,
            extract('month', Transaction.date) == now.month
        )
    elif req.period == "year":
        query = query.filter(
            extract('year', Transaction.date) == now.year
        )
    # else: sin filtro

    # Tipo de reporte
    if req.type == "summary":
        total_income = query.filter(Transaction.type == TransactionTypeEnum.entrada).with_entities(func.sum(Transaction.amount)).scalar() or 0.0
        total_expense = query.filter(Transaction.type == TransactionTypeEnum.salida).with_entities(func.sum(Transaction.amount)).scalar() or 0.0
        total_income_f = float(total_income)
        total_expense_f = float(total_expense)
        data = {
            "income": total_income_f,
            "expenses": total_expense_f,
            "savings": total_income_f - total_expense_f
        }
    elif req.type == "all":
        data = [
            {
                "id": tx.id,
                "type": tx.type.name,
                "subject": tx.subject,
                "amount": float(tx.amount),
                "date": tx.date.strftime("%Y-%m-%d")
            }
            for tx in query.all()
        ]
    else:
        raise HTTPException(status_code=400, detail="Tipo de reporte no soportado")

    # Simulación de generación de reporte (en real, aquí se generaría el PDF y se guardaría)
    report_url = f"/reports/{user.id}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    return {"success": True, "reportUrl": report_url, "data": data}
