from pydantic import BaseModel

class ProviderBase(BaseModel):
    name: str
    email_sender: str

class ProviderCreate(ProviderBase):
    pass

class ProviderOut(ProviderBase):
    id: int
    class Config:
        orm_mode = True
