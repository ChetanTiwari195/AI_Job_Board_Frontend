import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { JobDescription } from '../components/JobDescription';
import { ProgressBar } from '../components/ProgressBar';
import { Results } from '../components/Results';
import { KeywordSelector } from '../components/KeywordSelector';
import { analyzeResume, optimizeResume } from '../services/api';
import { saveResume, signOut } from '../services/api';
import { OptimizeResponse, AnalyzeResponse, ProgressStep } from '../types';

export function Popup() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [progress, setProgress] = useState<ProgressStep>('idle');
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState('');
  // Track the loaded resume's ID for cached keyword lookup
  const [loadedResumeId, setLoadedResumeId] = useState<string | undefined>(undefined);

  // --- Step 1: Analyze (lightweight) ---
  const handleAnalyze = async () => {
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
    setAnalysis(null);
    setSelectedKeywords(new Set());
    setProgress('analyzing');

    try {
      const response = await analyzeResume(
        resumeContent,
        jobDescription,
        loadedResumeId,
      );

      setProgress('done');
      setAnalysis(response);
    } catch (err: any) {
      setProgress('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // --- Step 2: Optimize with selected keywords ---
  const handleOptimize = async () => {
    if (!resumeContent.trim() || !jobDescription.trim()) return;
    if (selectedKeywords.size === 0) return;

    setError('');
    setResult(null);
    setProgress('uploading');

    try {
      await delay(400);
      setProgress('extracting_keywords');

      const timer1 = setTimeout(() => setProgress('optimizing'), 4000);
      const timer2 = setTimeout(() => setProgress('compiling'), 12000);

      const response = await optimizeResume(
        resumeContent,
        jobDescription,
        Array.from(selectedKeywords),
      );

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
      const saved = await saveResume(name, resumeContent);
      setLoadedResumeId(saved.id);
      alert('Resume saved!');
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  // Keyword selection handlers
  const toggleKeyword = (kw: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  };

  const selectAll = () => {
    if (analysis) {
      setSelectedKeywords(new Set(analysis.missing_keywords));
    }
  };

  const deselectAll = () => {
    setSelectedKeywords(new Set());
  };

  // When resume content changes from FileUpload, capture the resume ID if loaded from saved
  const handleResumeContent = (content: string, resumeId?: string) => {
    setResumeContent(content);
    setLoadedResumeId(resumeId);
    // Reset analysis when resume changes
    setAnalysis(null);
    setSelectedKeywords(new Set());
    setResult(null);
  };

  const isProcessing =
    progress !== 'idle' && progress !== 'done' && progress !== 'error';

  const isAnalyzing = progress === 'analyzing';
  const isOptimizing = isProcessing && progress !== 'analyzing';

  // Show optimize button only when analysis is done and we have missing keywords
  const showOptimizeButton = analysis && analysis.missing_keywords.length > 0 && !result;

  return (
    <div className="popup">
      <header className="popup-header">
        <h1>Resume Optimizer</h1>
        <button className="btn-text" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <FileUpload onContent={handleResumeContent} content={resumeContent} />

      {resumeContent && (
        <button className="btn-secondary" onClick={handleSaveResume}>
          💾 Save Resume to Cloud
        </button>
      )}

      <JobDescription value={jobDescription} onChange={(val) => {
        setJobDescription(val);
        // Reset analysis when JD changes
        setAnalysis(null);
        setSelectedKeywords(new Set());
        setResult(null);
      }} />

      {/* Step 1: Analyze Button */}
      <button
        className="btn-primary btn-analyze"
        onClick={handleAnalyze}
        disabled={isProcessing}
      >
        {isAnalyzing ? 'Analyzing...' : '🔍 Get ATS Score & Keywords'}
      </button>

      {error && <p className="error">{error}</p>}

      {/* Analysis progress (only during analyze) */}
      {isAnalyzing && <ProgressBar step={progress} />}

      {/* Keyword Selector (after analysis) */}
      {analysis && !result && (
        <KeywordSelector
          analysis={analysis}
          selectedKeywords={selectedKeywords}
          onToggleKeyword={toggleKeyword}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      )}

      {/* Step 2: Optimize Button */}
      {showOptimizeButton && (
        <button
          className="btn-primary btn-optimize"
          onClick={handleOptimize}
          disabled={isOptimizing || selectedKeywords.size === 0}
          title={selectedKeywords.size === 0 ? 'Select keywords to optimize' : ''}
        >
          {isOptimizing
            ? 'Processing...'
            : `🚀 Optimize with ${selectedKeywords.size} Selected Keywords`}
        </button>
      )}

      {/* Optimize progress (during optimization) */}
      {isOptimizing && <ProgressBar step={progress} />}

      {result && <Results result={result} />}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
