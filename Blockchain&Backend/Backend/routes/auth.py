from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class WalletLogin(BaseModel):
    wallet_address: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=Token)
async def login_with_wallet(request: WalletLogin):
    """Web3 wallet authentication"""
    if not request.wallet_address.startswith("0x") or len(request.wallet_address) != 42:
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    payload = {
        "sub": request.wallet_address,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    logger.info(f"✅ Login successful: {request.wallet_address}")
    return {"access_token": token, "token_type": "bearer"}

@router.get("/verify")
async def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return {"valid": True, "address": payload.get("sub")}
    except:
        return {"valid": False}
