from fastapi import APIRouter, Depends, HTTPException
from app.core.database import Database
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def get_all_donations(skip: int = 0, limit: int = 10):
    """Get all donations with pagination"""
    try:
        db = Database.get_db()
        donations = []
        async for doc in db.donations.find().skip(skip).limit(limit):
            doc["id"] = str(doc["_id"])
            donations.append(doc)
        return donations
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch donations")

@router.get("/by-cause/{cause}")
async def get_donations_by_cause(cause: str):
    """Get donations filtered by cause"""
    try:
        db = Database.get_db()
        donations = await db.donations.find({"cause": cause}).to_list(length=100)
        total = sum(float(d.get("amount", 0)) for d in donations)
        return {
            "cause": cause,
            "count": len(donations),
            "total_amount": total,
            "donations": donations
        }
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")

@router.get("/by-donor/{donor_address}")
async def get_donations_by_donor(donor_address: str):
    """Get donations by specific donor"""
    try:
        db = Database.get_db()
        donations = await db.donations.find({"donor": donor_address}).to_list(length=100)
        total = sum(float(d.get("amount", 0)) for d in donations)
        return {
            "donor": donor_address,
            "count": len(donations),
            "total_amount": total,
            "donations": donations
        }
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")

@router.get("/statistics/summary")
async def get_donation_statistics():
    """Get donation summary statistics"""
    try:
        db = Database.get_db()
        total_count = await db.donations.count_documents({})
        donations_list = await db.donations.find().to_list(length=None)
        total_amount = sum(float(d.get("amount", 0)) for d in donations_list)
        
        return {
            "total_donations": total_count,
            "total_amount": total_amount,
            "average_donation": total_amount / total_count if total_count > 0 else 0
        }
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")
