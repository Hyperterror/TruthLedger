from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError
from models.donation import Donation, DonationCreate, DonationResponse
from app.core.database import Database
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[DonationResponse])
async def get_donations(skip: int = 0, limit: int = 10):
    """Get all donations with pagination"""
    try:
        db = Database.get_db()
        donations = []
        
        async for doc in db.donations.find().skip(skip).limit(limit):
            doc["id"] = str(doc["_id"])
            donations.append(DonationResponse(**doc))
        
        return donations
    except Exception as e:
        logger.error(f"Error fetching donations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch donations")

@router.get("/{cause}")
async def get_donations_by_cause(cause: str):
    """Get donations by cause"""
    try:
        db = Database.get_db()
        donations = await db.donations.find({"cause": cause}).to_list(length=100)
        
        total_amount = sum(float(d.get("amount", 0)) for d in donations)
        count = len(donations)
        
        return {
            "cause": cause,
            "count": count,
            "total_amount": total_amount,
            "donations": donations
        }
    except Exception as e:
        logger.error(f"Error fetching donations by cause: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch donations")

@router.get("/donor/{donor_address}")
async def get_donations_by_donor(donor_address: str):
    """Get donations by donor address"""
    try:
        db = Database.get_db()
        donations = await db.donations.find({"donor": donor_address}).to_list(length=100)
        
        return {
            "donor": donor_address,
            "count": len(donations),
            "donations": donations
        }
    except Exception as e:
        logger.error(f"Error fetching donor donations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch donor donations")

@router.get("/stats/summary")
async def get_donation_stats():
    """Get donation summary statistics"""
    try:
        db = Database.get_db()
        
        total_donations = await db.donations.count_documents({})
        total_amount = sum(float(d.get("amount", 0)) for d in await db.donations.find().to_list(length=None))
        
        return {
            "total_donations": total_donations,
            "total_amount": total_amount,
            "average_donation": total_amount / total_donations if total_donations > 0 else 0
        }
    except Exception as e:
        logger.error(f"Error fetching donation stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")
