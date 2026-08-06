import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, HTTPException, Depends
import bcrypt
from pydantic import BaseModel, EmailStr

from db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt



@router.post("/signup")
async def signup(request: SignUpRequest, conn=Depends(get_db)):
    # Check if user already exists
    existing_user = await conn.fetchrow("SELECT id FROM custom_users WHERE email = $1", request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")
        
    password_hash = hash_password(request.password)
    user = await conn.fetchrow(
        "INSERT INTO custom_users (email, password_hash) VALUES ($1, $2) RETURNING id",
        request.email, password_hash
    )

    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/login")
async def login(request: LoginRequest, conn=Depends(get_db)):
    user = await conn.fetchrow("SELECT id, password_hash FROM custom_users WHERE email = $1", request.email)
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}
