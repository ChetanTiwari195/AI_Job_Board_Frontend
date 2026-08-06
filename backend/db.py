import os
import asyncpg
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env")

# Supabase Postgres connection pooling standard format
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgres://", 1)

pool = None

async def init_db():
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, statement_cache_size=0)
    
    async with pool.acquire() as conn:
        # Create users table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS custom_users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        
        # Create resumes table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS custom_resumes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES custom_users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, name)
            )
        """)
        print("Database tables initialized successfully.")

async def get_db():
    if not pool:
        await init_db()
    async with pool.acquire() as conn:
        yield conn
