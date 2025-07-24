from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=True)
    apellido = Column(String(50), nullable=True)
    correo = Column(String(100), unique=True, nullable=True, index=True)
    password = Column(Text, nullable=True)
    nooxid_token_encrypted = Column(Text)
    google_refresh_token = Column(Text)
    profile_img_url = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
