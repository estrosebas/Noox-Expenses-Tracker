from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderOut
from app.core.dependencies import get_current_user, get_db
from typing import List

router = APIRouter(prefix="/providers", tags=["providers"])

@router.post("/", response_model=ProviderOut)
def create_provider(provider_in: ProviderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    provider = Provider(**provider_in.dict())
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider

@router.get("/", response_model=List[ProviderOut])
def list_providers(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Provider).all()

@router.get("/{provider_id}", response_model=ProviderOut)
def get_provider(provider_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return provider

@router.put("/{provider_id}", response_model=ProviderOut)
def update_provider(provider_id: int, provider_in: ProviderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    for k, v in provider_in.dict().items():
        setattr(provider, k, v)
    db.commit()
    db.refresh(provider)
    return provider

@router.delete("/{provider_id}")
def delete_provider(provider_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(provider)
    db.commit()
    return {"ok": True}
