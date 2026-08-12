import { OptimizeResponse, AnalyzeResponse } from '../types';

const API_URL = import.meta.env.PROD 
  ? 'https://ai-job-board-backend-6s14.onrender.com/api' 
  : 'http://localhost:8002/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Auth ---

export async function signUp(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${res.status}`);
  }
  const data = await res.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
}


export async function signIn(email: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${res.status}`);
  }
  const data = await res.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
}

export function signOut() {
  localStorage.removeItem('access_token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

// --- Resumes ---

export async function loadResumes() {
  const res = await fetch(`${API_URL}/resumes/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load resumes');
  return res.json();
}

export async function loadResume(id: string) {
  const res = await fetch(`${API_URL}/resumes/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load resume');
  return res.json();
}

export async function saveResume(name: string, content: string) {
  const res = await fetch(`${API_URL}/resumes/`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content }),
  });
  if (!res.ok) throw new Error('Failed to save resume');
  return res.json();
}

export async function deleteResume(id: string) {
  const res = await fetch(`${API_URL}/resumes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete resume');
  return res.json();
}

// --- ATS Analysis (lightweight keyword comparison) ---

export async function analyzeResume(
  resumeTex: string,
  jobDescription: string,
  resumeId?: string,
  jobId?: string,
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  const blob = new Blob([resumeTex], { type: 'text/plain' });
  formData.append('resume', blob, 'resume.tex');
  formData.append('job_description', jobDescription);
  if (resumeId) formData.append('resume_id', resumeId);
  if (jobId) formData.append('job_id', jobId);

  const response = await fetch(`${API_URL}/resumes/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

// --- AI Optimizer (full optimization with selected keywords) ---

export async function optimizeResume(
  resumeTex: string,
  jobDescription: string,
  selectedKeywords: string[] = [],
): Promise<OptimizeResponse> {
  const formData = new FormData();
  const blob = new Blob([resumeTex], { type: 'text/plain' });
  formData.append('resume', blob, 'resume.tex');
  formData.append('job_description', jobDescription);
  formData.append('selected_keywords', JSON.stringify(selectedKeywords));

  const response = await fetch(`${API_URL}/resumes/optimize`, {
    method: 'POST',
    body: formData,
    // Note: optimization might not require auth, but if it does, add getAuthHeaders() here
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
