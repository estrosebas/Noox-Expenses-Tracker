from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import List, Dict

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/insights", response_model=List[Dict])
def analytics_insights(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Tendencia de gastos: compara el total de gastos de los dos últimos meses
    year = func.extract('year', Transaction.date).label('year')
    month = func.extract('month', Transaction.date).label('month')
    gastos_por_mes = db.query(
        year,
        month,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.salida
    ).group_by(year, month).order_by(year.desc(), month.desc()).limit(2).all()

    if len(gastos_por_mes) < 2:
        return [{"message": "fail", "data": "No hay datos suficientes"}]

    actual = gastos_por_mes[0].total
    anterior = gastos_por_mes[1].total
    if anterior == 0:
        tendencia = 100.0
    else:
        tendencia = ((actual - anterior) / anterior) * 100
    trend = "up" if tendencia > 0 else ("down" if tendencia < 0 else "neutral")
    tendencia_str = ("+" if tendencia > 0 else "") + f"{round(tendencia, 1)}%"

    # Categoría principal: subject con mayor gasto total
    cat = db.query(
        Transaction.subject.label('name'),
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user.id,
        Transaction.type == TransactionTypeEnum.salida
    ).group_by(Transaction.subject).order_by(func.sum(Transaction.amount).desc()).first()

    if not cat:
        return [{"message": "fail", "data": "No hay datos suficientes"}]

    total_gastos = sum([float(r.total) for r in gastos_por_mes])
    porcentaje = round((float(cat.total) / float(total_gastos)) * 100, 1) if total_gastos else 0.0

    return [
        {
            "title": "Tendencia de Gastos",
            "value": tendencia_str,
            "description": "Incremento respecto al mes anterior" if tendencia > 0 else "Disminución respecto al mes anterior" if tendencia < 0 else "Sin cambios respecto al mes anterior",
            "trend": trend
        },
        {
            "title": "Categoría Principal",
            "value": cat.name,
            "description": f"{porcentaje}% del total de gastos",
            "trend": "neutral"
        }
    ]
