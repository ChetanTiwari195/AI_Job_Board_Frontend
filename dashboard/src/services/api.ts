export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    source: string;
    apply_url: string;
    extracted_keywords: string[] | null;
    salary_range: string | null;
    experience: string | null;
    domain: string | null;
    saved: boolean;
    applied: boolean;
    created_at: string;
    ai_score?: number;
    ai_summary?: string;
    missing_skills?: string[];
}

export interface MatchResponse {
    job: Job;
    match_score: number;
    best_resume_id: string | null;
}

export interface UserSettings {
    hiringcafe_url: string | null;
    scraper_interval_hours: number;
}

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "https://ai-job-board-backend-6s14.onrender.com/api" : "http://localhost:8002/api");

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// ─── Jobs ────────────────────────────────────────────────────────

export const getJobs = async (): Promise<Job[]> => {
    const res = await fetch(`${API_BASE}/jobs`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load jobs");
    return res.json();
};

export const getSavedJobs = async (): Promise<Job[]> => {
    const res = await fetch(`${API_BASE}/saved`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load saved jobs");
    return res.json();
};

export const saveJob = async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/save/${id}`, { method: "POST", headers: getHeaders() });
};

export const unsaveJob = async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/save/${id}`, { method: "DELETE", headers: getHeaders() });
};

export const applyJob = async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/apply/${id}`, { method: "POST", headers: getHeaders() });
};

export const refreshJobs = async (): Promise<void> => {
    const res = await fetch(`${API_BASE}/refresh`, { method: "POST", headers: getHeaders() });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to start refresh");
    }
};

// ─── Matches ─────────────────────────────────────────────────────

export const getJobMatches = async (skip: number = 0, limit: number = 20): Promise<MatchResponse[]> => {
    const res = await fetch(`${API_BASE}/jobs/matches?skip=${skip}&limit=${limit}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
};

// ─── Settings ────────────────────────────────────────────────────

export const getSettings = async (): Promise<UserSettings> => {
    const res = await fetch(`${API_BASE}/settings`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load settings");
    return res.json();
};

export const updateSettings = async (data: Partial<UserSettings>): Promise<UserSettings> => {
    const res = await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
};

// ─── Resumes (Talks to Resume Optimizer Backend) ─────────────────

const RESUMES_API_BASE = `${API_BASE}/resumes`;

export interface SavedResume {
    id: string;
    name: string;
    updated_at: string;
    content?: string;
}

export const getResumes = async (): Promise<SavedResume[]> => {
    const res = await fetch(RESUMES_API_BASE, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load resumes");
    return res.json();
};

export const getResume = async (id: string): Promise<SavedResume> => {
    const res = await fetch(`${RESUMES_API_BASE}/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load resume");
    return res.json();
};

export const saveResumeContent = async (name: string, content: string): Promise<SavedResume> => {
    const res = await fetch(RESUMES_API_BASE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, content })
    });
    if (!res.ok) throw new Error("Failed to save resume");
    return res.json();
};

export const deleteResume = async (id: string): Promise<void> => {
    const res = await fetch(`${RESUMES_API_BASE}/${id}`, { 
        method: "DELETE", 
        headers: getHeaders() 
    });
    if (!res.ok) throw new Error("Failed to delete resume");
};
