from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    nombre: str
    apellido: str
    correo: EmailStr
    password: str

class UserLogin(BaseModel):
    correo: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    correo: EmailStr
    profile_img_url: Optional[str] = None
    class Config:
        orm_mode = True
