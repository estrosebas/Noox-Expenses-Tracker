from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    user_id: int
    provider_id: int
    type: str
    amount: float
    currency: str = "PEN"
    date: datetime
    subject: Optional[str] = None
    raw_email_snippet: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionOut(TransactionBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True
