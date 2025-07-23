from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token

from typing import Any

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.correo == user_in.correo).first()
    if user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        nombre=user_in.nombre,
        apellido=user_in.apellido,
        correo=user_in.correo,
        password=hashed_password,
        nooxid_token_encrypted=None,
        google_refresh_token=None,
        profile_img_url=None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.correo == user_in.correo).first()
    if not user or not verify_password(user_in.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
