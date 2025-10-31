import asyncio
import logging
from .web3_services import Web3Service
from app.core.config import settings

logger = logging.getLogger(__name__)

class EventListener:
    def __init__(self, web3_service: Web3Service, db):
        self.web3 = web3_service
        self.db = db
        self.polling_interval = settings.WEB3_POLLING_INTERVAL

    async def start_listening(self):
        """Start listening for blockchain events"""
        logger.info("🔍 Event listener started")
        
        # Create event filters
        donation_filter = self.web3.create_event_filter(
            settings.DONATION_TOKEN_ADDRESS,
            self.web3.donation_token_abi,
            "DonationReceived"
        )
        
        while True:
            try:
                # Poll for new events
                new_events = donation_filter.get_new_entries()
                
                for event in new_events:
                    await self._process_donation_event(event)
                
                await asyncio.sleep(self.polling_interval)
            except Exception as e:
                logger.error(f"Error in event listener: {e}")
                await asyncio.sleep(self.polling_interval)

    async def _process_donation_event(self, event):
        """Process DonationReceived event"""
        try:
            donation_data = {
                "donor": event.args.donor,
                "amount": str(event.args.amount),
                "cause": event.args.cause,
                "tx_hash": event.transactionHash.hex(),
                "block_number": event.blockNumber,
                "timestamp": event.args.timestamp,
                "donation_id": event.args.donationId,
                "indexed_at": asyncio.get_event_loop().time()
            }
            
            # Insert into MongoDB
            result = await self.db.donations.insert_one(donation_data)
            logger.info(f"✅ Donation indexed: {result.inserted_id}")
            
            # Broadcast to WebSocket clients (implement later)
        except Exception as e:
            logger.error(f"Error processing donation event: {e}")
