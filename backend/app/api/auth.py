

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token
from typing import Any
from pydantic import BaseModel, EmailStr

# Schema para loginbyface
class TokenNooxidRequest(BaseModel):
    tokennooxid: str

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas para docs
class EmailCheckRequest(BaseModel):
    email: EmailStr


class RegisterByFaceRequest(BaseModel):
    tokennooxid: str
    nombre: str
    apellido: str
    correo: EmailStr

@router.post("/verifyexist", summary="Verifica si un email existe", response_model=dict)
def verify_exist(body: EmailCheckRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.correo == body.email).first()
    return {"exists": bool(user)}

@router.post("/registerbyface", summary="Registra usuario por token facial", response_model=dict)
def register_by_face(body: RegisterByFaceRequest, db: Session = Depends(get_db)):
    user = User(
        nombre=body.nombre,
        apellido=body.apellido,
        correo=body.correo,
        password=None,
        nooxid_token_encrypted=body.tokennooxid,
        google_refresh_token=None,
        profile_img_url=None
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"ok": True, "user_id": user.id}

@router.post("/loginbyface", summary="Login por token facial", response_model=dict)
def login_by_face(body: TokenNooxidRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.nooxid_token_encrypted == body.tokennooxid).first()
    if not user:
        raise HTTPException(status_code=401, detail="Token facial inválido")
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

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
