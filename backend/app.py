import os
import base64
from pathlib import Path

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from ai import extract_keywords, optimize_resume
from latex import compile_to_pdf

# Load .env from parent directory (project root)
load_dotenv(Path(__file__).parent.parent / ".env")

app = FastAPI(title="Resume Optimizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/optimize")
async def optimize(resume: UploadFile, job_description: str = Form(...)):
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
    try:
        keywords = await extract_keywords(job_description)
    except Exception as e:
        raise HTTPException(500, f"Failed to extract keywords: {e}")

    # 3. Optimize resume with AI
    try:
        result = await optimize_resume(resume_tex, job_description, keywords)
    except Exception as e:
        raise HTTPException(500, f"Failed to optimize resume: {e}")

    updated_tex = result["updated_tex"]
    ats_score = result["ats_score"]
    missing_keywords = result["missing_keywords"]
    added_skills = result["added_skills"]

    # 4. Compile LaTeX to PDF
    try:
        pdf_bytes = compile_to_pdf(updated_tex)
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
