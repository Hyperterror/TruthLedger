from motor.motor_asyncio import AsyncIOMotorClient as AsyncIOMongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    db = None

    @classmethod
    async def connect_db(cls):
        try:
            settings = get_settings()
            cls.client = AsyncIOMongoClient(settings.DATABASE_URL)
            await cls.client.admin.command('ping')
            cls.db = cls.client[settings.MONGO_DATABASE]
            logger.info("✅ Connected to MongoDB successfully")
            
            # Create indexes
            await cls._create_indexes()
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise

    @classmethod
    def close_db(cls):
        if cls.client:
            cls.client.close()
            logger.info("✅ MongoDB connection closed")

    @classmethod
    async def _create_indexes(cls):
        """Create necessary indexes for performance"""
        await cls.db.donations.create_index("donor")
        await cls.db.donations.create_index("cause")
        await cls.db.donations.create_index("timestamp")
        await cls.db.projects.create_index("beneficiary")
        await cls.db.projects.create_index("status")
        logger.info("✅ Database indexes created")

    @classmethod
    def get_db(cls):
        return cls.db
