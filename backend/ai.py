import os
import json
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

OPENROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat-v3.1")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def _call_openrouter(messages: list[dict], temperature: float = 0.3) -> str:
    """Send a chat completion request to OpenRouter and return the response text."""
    if not OPENROUTER_API_KEY:
        raise ValueError("OPEN_ROUTER_API_KEY not set in .env file.")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": temperature,
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences from AI responses."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        # Remove opening fence (e.g. ```json)
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
        # Remove closing fence
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
    return cleaned.strip()


async def extract_keywords(job_description: str) -> dict:
    """Extract ATS-relevant keywords from a job description."""
    prompt = f"""Analyze the following job description and extract ATS-relevant keywords.

Return ONLY valid JSON with this exact structure:
{{
    "required_skills": ["skill1", "skill2"],
    "preferred_skills": ["skill1", "skill2"],
    "technologies": ["tech1", "tech2"],
    "experience_level": "junior/mid/senior",
    "key_responsibilities": ["resp1", "resp2"]
}}

Job Description:
{job_description}"""

    messages = [
        {
            "role": "system",
            "content": "You are an ATS keyword extraction expert. Return only valid JSON, no markdown code fences, no explanations.",
        },
        {"role": "user", "content": prompt},
    ]

    response = await _call_openrouter(messages)
    cleaned = _clean_json_response(response)
    return json.loads(cleaned)


async def optimize_resume(
    resume_tex: str, job_description: str, keywords: dict, force_keywords: bool = False
) -> dict:
    """Optimize a LaTeX resume for a job description using extracted keywords."""
    prompt = f"""You are a professional resume optimizer. Optimize the given LaTeX resume for the provided job description.

CRITICAL RULES — YOU MUST FOLLOW ALL OF THESE:
1. NEVER fabricate experience, projects, companies, or certifications.
2. INTEGRATE ALL SOFT SKILLS: You MUST naturally integrate all soft skills mentioned in the JD into the resume summary and bullet points. It must sound natural and not forced.
3. TITLE OPTIMIZATION: If the JD title is slightly different but completely relevant to the candidate's background (e.g. "Software Developer" vs "Gen AI Engineer"), you MAY naturally adjust the candidate's professional headline/title in the resume to better match the JD and increase ATS scoring.
4. HARD SKILLS RULE: { "You MUST force-add ALL missing hard skills from the JD (even if they seem slightly out of domain) by naturally weaving them into the resume summary or relevant bullet points without fabricating entirely new projects." if force_keywords else "You MAY add hard skills from the JD ONLY if they are from the same domain as the candidate's existing skills. If a hard skill is from a totally different domain, DO NOT add it." }
5. ONLY rewrite existing content — improve wording, naturally insert relevant keywords.
6. You MAY reorder skills to prioritize relevant ones first.
7. You MAY improve bullet points for clarity and ATS compatibility.
8. PRESERVE ALL LaTeX formatting: \\documentclass, \\usepackage, \\begin{{document}}, \\end{{document}}, custom commands, macros, spacing, comments.
9. ONLY EDIT these sections: Summary/Objective, Experience bullet points, Project descriptions, Skills ordering/grouping.
10. NEVER modify: document class, packages, formatting commands, custom macros, layout commands.
11. The output LaTeX MUST compile successfully with the same packages as the input.
12. Keep all content truthful. Everything must be based on what exists in the original resume.

JOB DESCRIPTION:
{job_description}

EXTRACTED KEYWORDS:
{json.dumps(keywords, indent=2)}

ORIGINAL RESUME (LaTeX):
{resume_tex}

RESPOND WITH ONLY THIS JSON (no markdown fences):
{{
    "updated_tex": "THE COMPLETE UPDATED LATEX DOCUMENT",
    "ats_score": 85,
    "missing_keywords": ["keywords", "that", "could", "not", "be", "incorporated"],
    "added_skills": ["any", "skills", "you", "added"]
}}

IMPORTANT:
- "updated_tex" must contain the COMPLETE LaTeX document from \\documentclass to \\end{{document}}.
- "ats_score" must be an INTEGER between 0-100 representing a strict, realistic calculation of how well the updated resume matches the JD based on keyword density.
- "missing_keywords" are important JD keywords that couldn't be naturally incorporated without fabrication (e.g. hard skills from totally different domains).
- "added_skills" lists ANY skills you mentioned that were NOT explicitly in the original resume. If none, use an empty array."""

    messages = [
        {
            "role": "system",
            "content": "You are an expert resume optimizer. Return structured JSON with optimized LaTeX. Never fabricate experience. Always preserve LaTeX formatting. Your output must be valid JSON.",
        },
        {"role": "user", "content": prompt},
    ]

    response = await _call_openrouter(messages, temperature=0.2)
    cleaned = _clean_json_response(response)
    result = json.loads(cleaned)

    # Validate required fields
    if "updated_tex" not in result:
        raise ValueError("AI response missing 'updated_tex' field.")

    return {
        "updated_tex": result["updated_tex"],
        "ats_score": result.get("ats_score", 0),
        "missing_keywords": result.get("missing_keywords", []),
        "added_skills": result.get("added_skills", []),
    }
