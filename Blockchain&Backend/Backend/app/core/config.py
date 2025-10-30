from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # MongoDB
    DATABASE_URL: str = "mongodb://admin:cdac_password_secure_123@localhost:27017/cdac?authSource=admin"
    MONGO_DATABASE: str = "cdac"
    
    # Blockchain
    ETHEREUM_RPC_URL: str = "https://rpc-amoy.polygon.technology"
    ETHEREUM_CHAIN_ID: int = 80002
    DONATION_TOKEN_ADDRESS: str = ""
    FUND_ALLOCATION_ADDRESS: str = ""
    PROJECT_MILESTONE_ADDRESS: str = ""
    ACCESS_CONTROL_ADDRESS: str = ""
    
    # JWT Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Web3
    WEB3_POLLING_INTERVAL: int = 2
    
    # Server
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
