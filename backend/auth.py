import os
import smtplib
import random
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

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

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyRequest(BaseModel):
    email: EmailStr
    token: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def send_otp_email(to_email: str, otp: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD or SMTP_PASSWORD == "your_16_char_app_password":
        print(f"WARNING: SMTP credentials not fully configured. The OTP for {to_email} is {otp}")
        return

    msg = EmailMessage()
    msg.set_content(f"Your verification code is: {otp}")
    msg["Subject"] = "Verify your email address"
    msg["From"] = f"Resume Optimizer <{SMTP_EMAIL}>"
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {e}")

@router.post("/signup")
async def signup(request: SignUpRequest, conn=Depends(get_db)):
    # Check if user already exists
    existing_user = await conn.fetchrow("SELECT id, is_verified FROM custom_users WHERE email = $1", request.email)
    if existing_user:
        if existing_user["is_verified"]:
            raise HTTPException(status_code=400, detail="User already exists and is verified.")
        # Re-send OTP if they exist but aren't verified
        user_id = existing_user["id"]
        # Password might have changed, so update it just in case
        password_hash = hash_password(request.password)
        await conn.execute("UPDATE custom_users SET password_hash = $1 WHERE email = $2", password_hash, request.email)
    else:
        password_hash = hash_password(request.password)
        await conn.execute(
            "INSERT INTO custom_users (email, password_hash) VALUES ($1, $2)",
            request.email, password_hash
        )

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    await conn.execute(
        """
        INSERT INTO custom_otps (email, otp, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at
        """,
        request.email, otp, expires_at
    )

    # Send email
    send_otp_email(request.email, otp)
    
    return {"message": "Verification code sent to email."}

@router.post("/verify")
async def verify(request: VerifyRequest, conn=Depends(get_db)):
    otp_record = await conn.fetchrow("SELECT otp, expires_at FROM custom_otps WHERE email = $1", request.email)
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid request. Please sign up first.")
    
    if str(otp_record["otp"]) != str(request.token):
        raise HTTPException(status_code=400, detail="Invalid verification code.")
        
    if otp_record["expires_at"] < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Verification code expired.")

    # Mark user as verified
    await conn.execute("UPDATE custom_users SET is_verified = TRUE WHERE email = $1", request.email)
    
    # Delete OTP
    await conn.execute("DELETE FROM custom_otps WHERE email = $1", request.email)

    # Log them in by generating JWT
    user = await conn.fetchrow("SELECT id FROM custom_users WHERE email = $1", request.email)
    access_token = create_access_token(data={"sub": str(user["id"])})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
async def login(request: LoginRequest, conn=Depends(get_db)):
    user = await conn.fetchrow("SELECT id, password_hash, is_verified FROM custom_users WHERE email = $1", request.email)
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password.")
        
    if not user["is_verified"]:
        raise HTTPException(status_code=400, detail="Please verify your email first.")

    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}
