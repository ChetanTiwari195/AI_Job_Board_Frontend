import { OptimizeResponse } from '../types';

const API_URL = import.meta.env.PROD 
  ? 'https://resume-optimizer-extension.onrender.com' 
  : 'http://localhost:8000';

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
  return res.json();
}

export async function verifyOtp(email: string, token: string) {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token }),
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
  const res = await fetch(`${API_URL}/auth/login`, {
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

// --- AI Optimizer ---

export async function optimizeResume(
  resumeTex: string,
  jobDescription: string,
  forceKeywords: boolean = false
): Promise<OptimizeResponse> {
  const formData = new FormData();
  const blob = new Blob([resumeTex], { type: 'text/plain' });
  formData.append('resume', blob, 'resume.tex');
  formData.append('job_description', jobDescription);
  formData.append('force_keywords', forceKeywords.toString());

  const response = await fetch(`${API_URL}/optimize`, {
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
