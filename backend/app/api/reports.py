from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.core.dependencies import get_current_user, get_db
from app.models.transaction import Transaction, TransactionTypeEnum
from typing import List, Optional
import datetime
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

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
    # Filtros base para expenses (aplica categorías solo a expenses)
    query = db.query(Transaction).filter(Transaction.user_id == user.id)
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
    # Expenses: aplica filtro de categorías si corresponde
    expenses_query = query
    if req.categories:
        expenses_query = expenses_query.filter(Transaction.subject.in_(req.categories))
    # Incomes: NO aplica filtro de categorías, solo periodo
    income_query = db.query(Transaction).filter(Transaction.user_id == user.id)
    if req.period == "monthly":
        income_query = income_query.filter(
            extract('year', Transaction.date) == now.year,
            extract('month', Transaction.date) == now.month
        )
    elif req.period == "year":
        income_query = income_query.filter(
            extract('year', Transaction.date) == now.year
        )
    total_income = income_query.filter(Transaction.type == TransactionTypeEnum.entrada).with_entities(func.sum(Transaction.amount)).scalar() or 0.0

    # Tipo de reporte
    if req.type == "summary":
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

    # Obtener nombre y apellido del usuario
    user_db = db.query(type(user)).filter_by(id=user.id).first()
    nombre_completo = f"{getattr(user_db, 'nombre', '') or ''} {getattr(user_db, 'apellido', '') or ''}".strip() or f"ID {user.id}"

    # Generar PDF real con estilo
    uploads_dir = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    filename = f"{user.id}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf_path = os.path.join(uploads_dir, filename)
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    # Encabezado
    c.setFont("Helvetica-Bold", 20)
    c.setFillColorRGB(0.09, 0.55, 0.36)
    c.drawCentredString(width/2, height-60, "Reporte Financiero Personalizado")
    c.setFillColorRGB(0,0,0)
    c.setFont("Helvetica", 12)
    y = height-100
    c.setStrokeColorRGB(0.09, 0.55, 0.36)
    c.setLineWidth(2)
    c.line(40, y+10, width-40, y+10)
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"Usuario: {nombre_completo}")
    y -= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Fecha de generación: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    y -= 30
    c.setFont("Helvetica-Bold", 15)
    c.setFillColorRGB(0.13, 0.47, 0.85)
    c.drawString(50, y, "Resumen financiero")
    c.setFillColorRGB(0,0,0)
    c.setFont("Helvetica", 12)
    y -= 20
    import locale
    try:
        locale.setlocale(locale.LC_ALL, 'es_ES.UTF-8')
    except:
        locale.setlocale(locale.LC_ALL, '')
    if req.type == "summary":
        labels = {"income": "Ingresos", "expenses": "Gastos", "savings": "Ahorro"}
        for k, v in data.items():
            if k in ["income", "expenses", "savings"]:
                c.setFont("Helvetica-Bold", 12)
                c.drawString(70, y, f"{labels[k]}:")
                c.setFont("Helvetica", 12)
                c.drawString(180, y, f"S/ {v:,.2f}")
                y -= 22
        c.setStrokeColorRGB(0.13, 0.47, 0.85)
        c.setLineWidth(1)
        c.line(60, y+8, width-60, y+8)
        y -= 10
    elif req.type == "all":
        c.setFont("Helvetica-Bold", 13)
        c.setFillColorRGB(0.13, 0.47, 0.85)
        c.drawString(50, y, "Transacciones")
        c.setFillColorRGB(0,0,0)
        y -= 18
        headers = ["ID", "Tipo", "Categoría", "Monto", "Fecha"]
        c.setFont("Helvetica-Bold", 12)
        for i, h in enumerate(headers):
            c.drawString(60 + i*90, y, h)
        c.setFont("Helvetica", 12)
        y -= 16
        for tx in data:
            c.drawString(60, y, str(tx["id"]))
            tipo = "Ingreso" if tx["type"].lower() == "entrada" else "Gasto"
            c.drawString(150, y, tipo)
            c.drawString(240, y, tx["subject"])
            c.drawString(330, y, f"S/ {tx['amount']:,.2f}")
            c.drawString(420, y, tx["date"])
            y -= 16
            if y < 60:
                c.showPage()
                y = height-60
    c.save()
    report_url = f"/uploads/{filename}"
    return {"success": True, "reportUrl": report_url, "data": data}
