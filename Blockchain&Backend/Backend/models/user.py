from pydantic import BaseModel

class User(BaseModel):
    id: str = None
    wallet_address: str
    role: str  # "donor", "charity", "admin"
