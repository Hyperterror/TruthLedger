from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Database
from routes import donations, projects, auth, blockchain

app = FastAPI(title="C-DAC Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set proper CORS in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Database.connect_db()

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(donations.router, prefix="/api/donations", tags=["donations"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(blockchain.router, prefix="/api/blockchain", tags=["blockchain"])

@app.get("/health")
def health():
    return {"status": "healthy"}
