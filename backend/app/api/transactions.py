from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.transaction import Transaction, TransactionTypeEnum
from app.schemas.transaction import TransactionCreate, TransactionOut
from app.core.dependencies import get_current_user, get_db
from typing import List

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionOut)
def create_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tx = Transaction(**tx_in.dict())
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.get("/", response_model=List[TransactionOut])
def list_transactions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Transaction).all()

@router.get("/{tx_id}", response_model=TransactionOut)
def get_transaction(tx_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    return tx

@router.put("/{tx_id}", response_model=TransactionOut)
def update_transaction(tx_id: int, tx_in: TransactionCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    for k, v in tx_in.dict().items():
        setattr(tx, k, v)
    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    db.delete(tx)
    db.commit()
    return {"ok": True}
