from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class LoginRequest(BaseModel):
    wallet_address: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login with wallet address (Web3 auth)"""
    try:
        # Validate wallet address format
        if not request.wallet_address.startswith("0x") or len(request.wallet_address) != 42:
            raise HTTPException(status_code=400, detail="Invalid wallet address")
        
        # Create JWT token
        from app.core.config import settings
        payload = {
            "sub": request.wallet_address,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        logger.info(f"✅ Login successful for wallet: {request.wallet_address}")
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")
