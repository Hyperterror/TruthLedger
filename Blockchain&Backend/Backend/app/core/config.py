from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Pydantic settings will automatically load variables from environment variables
    or from the .env file specified in the Config class.
    """
    # MongoDB
    DATABASE_URL: str
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_DATABASE: str

    # Blockchain
    ETHEREUM_RPC_URL: str = "https://rpc-amoy.polygon.technology" # Default value if not in .env
    DONATION_TOKEN_ADDRESS: str = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    FUND_ALLOCATION_ADDRESS: str = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    PROJECT_MILESTONE_ADDRESS: str = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    ACCESS_CONTROL_ADDRESS: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    
    # JWT Security
    SECRET_KEY: str = "_poJa4Wy-SpsXLOg1yHtbLvEq1Qbr14sYxKdOw-O9ss"
    ALGORITHM: str = "HS256" # Default value
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Default value
    
    # Web3
    WEB3_POLLING_INTERVAL: int = 2 # Default value
    
    # Server
    DEBUG: bool = True # Default value
    HOST: str = "0.0.0.0" # Default value
    PORT: int = 8000 # Default value
    ETHEREUM_CHAIN_ID: int = 80002 # Default value

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
