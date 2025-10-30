from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import logging
from contextlib import asynccontextmanager

from app.core.database import Database
from app.core.config import settings
from routes import donations, auth, blockchain, projects
from services.event_listener import EventListener
from services.web3_service import Web3Service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global instances
event_listener = None
web3_service = None
connected_clients = set()

# Lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    global event_listener, web3_service
    
    # Startup
    logger.info("🚀 Starting up C-DAC Backend...")
    
    # Connect to MongoDB
    Database.connect_db()
    
    # Initialize Web3
    web3_service = Web3Service(settings.ETHEREUM_RPC_URL)
    logger.info("✅ Web3 service initialized")
    
    # Initialize event listener
    event_listener = EventListener(web3_service, Database.get_db())
    
    # Start listening for blockchain events in background
    listener_task = asyncio.create_task(event_listener.start_listening())
    logger.info("✅ Event listener started")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down C-DAC Backend...")
    listener_task.cancel()
    Database.close_db()
    logger.info("✅ Shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="C-DAC Backend API",
    description="Backend for Transparent Charitable Giving Ledger",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(donations.router, prefix="/api/donations", tags=["donations"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(blockchain.router, prefix="/api/blockchain", tags=["blockchain"])

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "C-DAC Backend"}

# WebSocket for real-time updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"✅ WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"❌ WebSocket client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        # Use a list comprehension to create a list of connections that are still active
        # This avoids modifying the list while iterating over it
        active_connections_after_broadcast = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
                active_connections_after_broadcast.append(connection)
            except Exception as e:
                logger.error(f"Error sending WebSocket message, client disconnected: {e}")
        self.active_connections = active_connections_after_broadcast

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
