import { OptimizeResponse } from '../types';

const API_URL = 'http://localhost:8000';

export async function optimizeResume(
  resumeTex: string,
  jobDescription: string
): Promise<OptimizeResponse> {
  const formData = new FormData();
  const blob = new Blob([resumeTex], { type: 'text/plain' });
  formData.append('resume', blob, 'resume.tex');
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_URL}/optimize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
