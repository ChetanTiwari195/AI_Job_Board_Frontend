import os
import base64
import time
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from ai import extract_keywords, optimize_resume
from latex import compile_to_pdf
from db import init_db
from auth import router as auth_router
from resumes import router as resumes_router

# Load .env from parent directory (project root)
load_dotenv(Path(__file__).parent.parent / ".env")


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Resume Optimizer API", lifespan=lifespan)

app.include_router(auth_router)
app.include_router(resumes_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/optimize")
async def optimize(
    resume: UploadFile, 
    job_description: str = Form(...),
    force_keywords: str = Form("false")
):
    """
    Accepts a .tex resume and job description.
    Returns optimized .tex, compiled PDF, ATS score, and keyword analysis.
    """
    # 1. Read resume
    content = await resume.read()
    try:
        resume_tex = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(400, "Invalid file encoding. Please upload a UTF-8 .tex file.")

    if not resume_tex.strip():
        raise HTTPException(400, "Resume file is empty.")

    if len(resume_tex) > 50_000:
        raise HTTPException(400, "Resume too large (max 50KB).")

    if not job_description.strip():
        raise HTTPException(400, "Job description is empty.")

    # 2. Extract ATS keywords from JD
    logger.info("Extracting ATS keywords from JD...")
    step_start = time.time()
    try:
        keywords = await extract_keywords(job_description)
        logger.info(f"-> Keyword extraction took {time.time() - step_start:.2f}s")
    except Exception as e:
        raise HTTPException(500, f"Failed to extract keywords: {e}")

    # 3. Optimize resume with AI
    logger.info("Optimizing resume with AI (this may take a while)...")
    step_start = time.time()
    try:
        force_keywords_bool = force_keywords.lower() == "true"
        result = await optimize_resume(resume_tex, job_description, keywords, force_keywords_bool)
        logger.info(f"-> AI Optimization took {time.time() - step_start:.2f}s")
    except Exception as e:
        raise HTTPException(500, f"Failed to optimize resume: {e}")

    updated_tex = result["updated_tex"]
    ats_score = result["ats_score"]
    missing_keywords = result["missing_keywords"]
    added_skills = result["added_skills"]

    # 4. Compile LaTeX to PDF
    logger.info("Compiling updated LaTeX to PDF...")
    step_start = time.time()
    try:
        pdf_bytes = compile_to_pdf(updated_tex)
        logger.info(f"-> PDF compilation took {time.time() - step_start:.2f}s")
    except Exception as e:
        raise HTTPException(500, f"LaTeX compilation failed: {e}")

    pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

    return {
        "updated_tex": updated_tex,
        "updated_pdf": pdf_base64,
        "ats_score": ats_score,
        "missing_keywords": missing_keywords,
        "added_skills": added_skills,
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
