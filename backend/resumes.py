import os
import jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from db import get_db

router = APIRouter(prefix="/resumes", tags=["resumes"])

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-change-me")
ALGORITHM = "HS256"

class SaveResumeRequest(BaseModel):
    name: str
    content: str

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/")
async def list_resumes(user_id: str = Depends(get_current_user_id), conn=Depends(get_db)):
    resumes = await conn.fetch(
        "SELECT id, name, created_at, updated_at FROM custom_resumes WHERE user_id = $1 ORDER BY updated_at DESC", 
        user_id
    )
    return [dict(r) for r in resumes]

@router.get("/{resume_id}")
async def get_resume(resume_id: str, user_id: str = Depends(get_current_user_id), conn=Depends(get_db)):
    resume = await conn.fetchrow(
        "SELECT * FROM custom_resumes WHERE id = $1 AND user_id = $2", 
        resume_id, user_id
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return dict(resume)

@router.post("/")
async def save_resume(request: SaveResumeRequest, user_id: str = Depends(get_current_user_id), conn=Depends(get_db)):
    # Upsert logic based on name
    row = await conn.fetchrow(
        """
        INSERT INTO custom_resumes (user_id, name, content, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, name) 
        DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
        RETURNING id, name, updated_at
        """,
        user_id, request.name, request.content
    )
    return dict(row)

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str, user_id: str = Depends(get_current_user_id), conn=Depends(get_db)):
    status = await conn.execute(
        "DELETE FROM custom_resumes WHERE id = $1 AND user_id = $2",
        resume_id, user_id
    )
    if status == "DELETE 0":
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Deleted successfully"}
