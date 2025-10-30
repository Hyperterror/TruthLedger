from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class DonationBase(BaseModel):
    donor: str
    amount: float
    cause: str
    timestamp: datetime
    tx_hash: str

class DonationCreate(BaseModel):
    amount: float
    cause: str

class Donation(DonationBase):
    id: Optional[str] = Field(None, alias="_id")
    
    class Config:
        populate_by_name = True

class DonationResponse(BaseModel):
    id: str
    donor: str
    amount: float
    cause: str
    timestamp: str
    tx_hash: str
