from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email_sender = Column(String(100), nullable=False)
