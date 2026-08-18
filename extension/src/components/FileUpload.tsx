import { useState, useEffect } from 'react';
import { loadResumes, loadResume, uploadPdfResume } from '../services/api';
import { CheckCircle2, X } from 'lucide-react';

interface FileUploadProps {
  onContent: (content: string, resumeId?: string) => void;
  content: string;
  onLoadingChange?: (loading: boolean) => void;
}

interface SavedResume {
  id: string;
  name: string;
  updated_at: string;
}

export function FileUpload({ onContent, content, onLoadingChange }: FileUploadProps) {
  const [mode, setMode] = useState<'upload' | 'paste' | 'saved'>('upload');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);
  const [loadingResumeName, setLoadingResumeName] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBusy = uploadingPdf || readingFile || loadingResumeId !== null;

  useEffect(() => {
    onLoadingChange?.(isBusy);
  }, [isBusy, onLoadingChange]);

  useEffect(() => {
    if (mode === 'saved') {
      setLoadingList(true);
      setError(null);
      loadResumes()
        .then(setSavedResumes)
        .catch((err) => {
          console.error(err);
          setError('Failed to load saved resumes');
        })
        .finally(() => setLoadingList(false));
    }
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const selectedName = file.name;
    setFileName(selectedName);
    setError(null);
    
    if (selectedName.toLowerCase().endsWith('.pdf')) {
      try {
        setUploadingPdf(true);
        const result = await uploadPdfResume(file);
        onContent(result.updated_tex);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to upload PDF');
      } finally {
        setUploadingPdf(false);
      }
    } else {
      setReadingFile(true);
      const reader = new FileReader();
      reader.onload = () => {
        onContent(reader.result as string);
        setReadingFile(false);
      };
      reader.onerror = () => {
        setError('Failed to read resume file');
        setReadingFile(false);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSaved = async (id: string, name: string) => {
    try {
      setLoadingResumeId(id);
      setLoadingResumeName(name);
      setError(null);
      const resume = await loadResume(id);
      onContent(resume.content, id);
      setFileName(name);
    } catch (err: any) {
      console.error('Failed to load resume:', err);
      setError(err?.message || 'Failed to load resume');
    } finally {
      setLoadingResumeId(null);
      setLoadingResumeName('');
    }
  };

  const handleClearResume = () => {
    onContent('', undefined);
    setFileName('');
  };

  return (
    <div className="section">
      <label className="section-label">Resume (.tex or .pdf)</label>
      <div className="input-mode-tabs">
        <button
          className={mode === 'upload' ? 'tab active' : 'tab'}
          onClick={() => setMode('upload')}
          disabled={isBusy}
        >
          Upload File
        </button>
        <button
          className={mode === 'paste' ? 'tab active' : 'tab'}
          onClick={() => setMode('paste')}
          disabled={isBusy}
        >
          Paste Code
        </button>
        <button
          className={mode === 'saved' ? 'tab active' : 'tab'}
          onClick={() => setMode('saved')}
          disabled={isBusy}
        >
          Saved
        </button>
      </div>

      {mode === 'upload' && (
        <div className="upload-area" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="file"
            accept=".tex,.pdf"
            onChange={handleFileChange}
            id="file-upload"
            disabled={isBusy}
          />
          {!isBusy && !fileName && (
            <span className="muted" style={{ fontSize: '11.5px' }}>
              Select a .pdf or .tex resume to get started
            </span>
          )}
        </div>
      )}

      {mode === 'paste' && (
        <textarea
          className="tex-paste"
          placeholder="Paste your LaTeX code here..."
          value={content}
          onChange={(e) => onContent(e.target.value)}
          rows={8}
          spellCheck={false}
          disabled={isBusy}
        />
      )}

      {mode === 'saved' && (
        <div className="saved-resumes">
          {loadingList ? (
            <div className="loading-indicator" style={{ justifyContent: 'center' }}>
              <span className="spinner" />
              <span>Loading saved resumes...</span>
            </div>
          ) : savedResumes.length === 0 ? (
            <p className="muted" style={{ textAlign: 'center', padding: '12px 0' }}>No saved resumes yet</p>
          ) : (
            savedResumes.map((r) => (
              <button
                key={r.id}
                className={`saved-resume-item ${loadingResumeId === r.id ? 'loading' : ''}`}
                onClick={() => handleLoadSaved(r.id, r.name)}
                disabled={isBusy}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  📄 {r.name}
                </span>
                {loadingResumeId === r.id && (
                  <span className="spinner" style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Resume Loading State Card */}
      {isBusy && (
        <div className="resume-loading-card">
          <span className="spinner" />
          <div className="loading-content">
            <div className="loading-title">
              {uploadingPdf
                ? 'Parsing PDF Resume...'
                : readingFile
                ? 'Reading Resume File...'
                : `Loading "${loadingResumeName || 'Resume'}"...`}
            </div>
            <div className="loading-subtitle">
              {uploadingPdf
                ? 'Extracting structure and generating LaTeX template...'
                : readingFile
                ? 'Processing LaTeX document...'
                : 'Retrieving resume content from cloud...'}
            </div>
          </div>
        </div>
      )}

      {error && <p className="error" style={{ margin: '8px 0 0 0' }}>{error}</p>}

      {/* Resume Loaded Success Card */}
      {content && !isBusy && (
        <div className="resume-loaded-card">
          <div className="resume-loaded-info">
            <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <span className="resume-loaded-name" title={fileName || 'Resume Loaded'}>
              {fileName ? fileName : 'Resume Loaded'}
            </span>
            <span className="resume-loaded-badge">
              ({content.length.toLocaleString()} chars)
            </span>
          </div>
          <button
            type="button"
            className="btn-clear-resume"
            onClick={handleClearResume}
            title="Clear resume"
            aria-label="Clear resume"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
