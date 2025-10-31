from fastapi import APIRouter, HTTPException
from app.core.database import Database
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def get_all_projects(skip: int = 0, limit: int = 10):
    """Get all projects"""
    try:
        db = Database.get_db()
        projects = []
        async for doc in db.projects.find().skip(skip).limit(limit):
            doc["id"] = str(doc["_id"])
            projects.append(doc)
        return projects
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.get("/{project_id}")
async def get_project(project_id: str):
    """Get specific project details"""
    try:
        db = Database.get_db()
        from bson import ObjectId
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        project["id"] = str(project["_id"])
        return project
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")

@router.get("/status/{status}")
async def get_projects_by_status(status: str):
    """Filter projects by status"""
    try:
        db = Database.get_db()
        projects = await db.projects.find({"status": status}).to_list(length=100)
        return projects
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error")
