from pydantic import BaseModel

class BlockchainEvent(BaseModel):
    tx_hash: str
    event_type: str
    data: dict
    block_number: int
    timestamp: int
