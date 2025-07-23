from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, DECIMAL
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class TransactionTypeEnum(str, enum.Enum):
    entrada = "entrada"
    salida = "salida"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id", ondelete="SET NULL"), nullable=True)
    type = Column(Enum(TransactionTypeEnum), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(10), default="PEN")
    date = Column(DateTime, nullable=False)
    subject = Column(Text)
    raw_email_snippet = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
