from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    db = None

    @classmethod
    def connect_db(cls):
        try:
            cls.client = MongoClient(settings.DATABASE_URL)
            cls.client.admin.command('ping')
            cls.db = cls.client[settings.MONGO_DATABASE]
            logger.info("✅ Connected to MongoDB successfully")
            
            # Create indexes
            cls._create_indexes()
        except ConnectionFailure as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise

    @classmethod
    def close_db(cls):
        if cls.client:
            cls.client.close()
            logger.info("✅ MongoDB connection closed")

    @classmethod
    def _create_indexes(cls):
        """Create necessary indexes for performance"""
        cls.db.donations.create_index("donor")
        cls.db.donations.create_index("cause")
        cls.db.donations.create_index("timestamp")
        cls.db.projects.create_index("beneficiary")
        cls.db.projects.create_index("status")
        logger.info("✅ Database indexes created")

    @classmethod
    def get_db(cls):
        return cls.db

# Initialize database
db = Database()
