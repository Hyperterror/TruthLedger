from pydantic import BaseModel
from typing import List

class Milestone(BaseModel):
    description: str
    fund_percentage: int
    is_verified: bool = False

class Project(BaseModel):
    id: str = None
    name: str
    beneficiary: str
    total_funds: float
    milestones: List[Milestone]
    status: str
