import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { JobDescription } from '../components/JobDescription';
import { ProgressBar } from '../components/ProgressBar';
import { Results } from '../components/Results';
import { optimizeResume } from '../services/api';
import { saveResume, signOut } from '../services/supabase';
import { OptimizeResponse, ProgressStep } from '../types';

export function Popup() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [progress, setProgress] = useState<ProgressStep>('idle');
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    if (!resumeContent.trim()) {
      setError('Please upload or paste your resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setError('');
    setResult(null);
    setProgress('uploading');

    try {
      // Simulate initial delay so user sees "Reading Resume..."
      await delay(400);
      setProgress('extracting_keywords');

      // Backend handles the full pipeline.
      // We estimate progress timing on the frontend.
      const timer1 = setTimeout(() => setProgress('optimizing'), 4000);
      const timer2 = setTimeout(() => setProgress('compiling'), 12000);

      const response = await optimizeResume(resumeContent, jobDescription);

      clearTimeout(timer1);
      clearTimeout(timer2);

      setProgress('done');
      setResult(response);
    } catch (err: any) {
      setProgress('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleSaveResume = async () => {
    const name = prompt('Resume name:');
    if (!name) return;
    try {
      await saveResume(name, resumeContent);
      alert('Resume saved!');
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  const isProcessing =
    progress !== 'idle' && progress !== 'done' && progress !== 'error';

  return (
    <div className="popup">
      <header className="popup-header">
        <h1>Resume Optimizer</h1>
        <button className="btn-text" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <FileUpload onContent={setResumeContent} content={resumeContent} />

      {resumeContent && (
        <button className="btn-secondary" onClick={handleSaveResume}>
          💾 Save Resume to Cloud
        </button>
      )}

      <JobDescription value={jobDescription} onChange={setJobDescription} />

      <button
        className="btn-primary btn-optimize"
        onClick={handleOptimize}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : '🚀 Optimize Resume'}
      </button>

      {error && <p className="error">{error}</p>}

      <ProgressBar step={progress} />

      {result && <Results result={result} />}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
