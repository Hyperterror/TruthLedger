from web3 import Web3
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class Web3Service:
    def __init__(self, rpc_url: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to {rpc_url}")
        logger.info("✅ Connected to Ethereum RPC")
        
        # Load contract ABIs
        self.donation_token_abi = self._load_abi("DonationToken")
        self.fund_allocation_abi = self._load_abi("FundAllocation")

    def _load_abi(self, contract_name: str):
        """Load ABI from artifacts"""
        try:
            with open(f"../c-dac-blockchain/artifacts/contracts/{contract_name}.sol/{contract_name}.json") as f:
                return json.load(f)["abi"]
        except FileNotFoundError:
            logger.error(f"ABI file not found for {contract_name}")
            return None

    def get_contract(self, address: str, abi: list):
        """Get contract instance"""
        return self.w3.eth.contract(address=Web3.to_checksum_address(address), abi=abi)

    def create_event_filter(self, contract_address: str, abi: list, event_name: str, from_block: str = "latest"):
        """Create event filter"""
        contract = self.get_contract(contract_address, abi)
        event = getattr(contract.events, event_name)
        return event.create_filter(from_block=from_block)

    def get_latest_block(self):
        """Get latest block number"""
        return self.w3.eth.block_number

    def get_transaction_receipt(self, tx_hash: str):
        """Get transaction receipt"""
        return self.w3.eth.get_transaction_receipt(tx_hash)
