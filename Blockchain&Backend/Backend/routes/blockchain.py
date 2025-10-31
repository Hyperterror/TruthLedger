from fastapi import APIRouter, HTTPException
from app.core.config import settings
from app.core.database import Database
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/contracts/addresses")
async def get_contract_addresses():
    """Get deployed contract addresses"""
    return {
        "donation_token": settings.DONATION_TOKEN_ADDRESS,
        "fund_allocation": settings.FUND_ALLOCATION_ADDRESS,
        "project_milestone": settings.PROJECT_MILESTONE_ADDRESS,
        "access_control": settings.ACCESS_CONTROL_ADDRESS
    }

@router.get("/transaction/{tx_hash}")
async def get_transaction_details(tx_hash: str):
    """Get transaction details from blockchain"""
    try:
        from services.web3_service import Web3Service
        web3 = Web3Service(settings.ETHEREUM_RPC_URL)
        receipt = web3.get_transaction_receipt(tx_hash)
        return {"status": receipt.get("status"), "block": receipt.get("blockNumber")}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching transaction")

@router.get("/block/latest")
async def get_latest_block():
    """Get latest blockchain block number"""
    try:
        from services.web3_service import Web3Service
        web3 = Web3Service(settings.ETHEREUM_RPC_URL)
        latest = web3.get_latest_block()
        return {"block_number": latest}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")
