import { Moon, Sun, Save, Search, Zap, LogOut } from 'lucide-react';
import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { JobDescription } from '../components/JobDescription';
import { ProgressBar } from '../components/ProgressBar';
import { Results } from '../components/Results';
import { KeywordSelector } from '../components/KeywordSelector';
import { analyzeResume, optimizeResume, saveResume, signOut } from '../services/api';
import { AnalyzeResponse, OptimizeResponse, ProgressStep } from '../types';

interface PopupProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Popup({ theme, toggleTheme }: PopupProps) {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [progress, setProgress] = useState<ProgressStep>('idle');
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState('');
  // Track the loaded resume's ID for cached keyword lookup
  const [loadedResumeId, setLoadedResumeId] = useState<string | undefined>(undefined);
  const [savingResume, setSavingResume] = useState(false);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

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
      setSavingResume(true);
      const saved = await saveResume(name, resumeContent);
      setLoadedResumeId(saved.id);
      alert('Resume saved!');
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSavingResume(false);
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
        <div className="header-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="white" />}
          </button>
          <button className="btn-text" onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <FileUpload
        onContent={handleResumeContent}
        content={resumeContent}
        onLoadingChange={setIsResumeLoading}
      />

      {resumeContent && (
        <button className="btn-secondary" onClick={handleSaveResume} disabled={savingResume || isResumeLoading}>
          {savingResume ? (
            <><span className="spinner" style={{ width: '13px', height: '13px', marginRight: '6px' }} /> Saving Resume...</>
          ) : (
            <><Save size={16} className="inline mr-1" /> Save Resume to Cloud</>
          )}
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
        disabled={isProcessing || isResumeLoading}
      >
        {isAnalyzing ? (
          <><span className="spinner" style={{ width: '14px', height: '14px', marginRight: '6px', borderColor: '#fff', borderTopColor: 'transparent' }} /> Analyzing Resume...</>
        ) : (
          <><Search size={16} className="inline mr-1" /> Get ATS Score & Keywords</>
        )}
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
            ? <><span className="spinner" style={{ width: '14px', height: '14px', marginRight: '6px', borderColor: '#fff', borderTopColor: 'transparent' }} /> Optimizing Resume...</>
            : <><Zap size={16} className="inline mr-1" /> Optimize with {selectedKeywords.size} Selected Keywords</>}
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
