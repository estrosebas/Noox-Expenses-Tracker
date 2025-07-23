from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    correo = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(Text, nullable=False)
    nooxid_token_encrypted = Column(Text)
    google_refresh_token = Column(Text)
    profile_img_url = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
