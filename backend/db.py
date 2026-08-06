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
    print("Database pool initialized successfully.")

async def get_db():
    if not pool:
        await init_db()
    async with pool.acquire() as conn:
        yield conn
