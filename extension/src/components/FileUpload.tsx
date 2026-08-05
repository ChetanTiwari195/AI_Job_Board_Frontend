import { useState, useEffect } from 'react';
import { loadResumes, loadResume } from '../services/supabase';

interface FileUploadProps {
  onContent: (content: string) => void;
  content: string;
}

interface SavedResume {
  id: string;
  name: string;
  updated_at: string;
}

export function FileUpload({ onContent, content }: FileUploadProps) {
  const [mode, setMode] = useState<'upload' | 'paste' | 'saved'>('upload');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (mode === 'saved') {
      loadResumes().then(setSavedResumes).catch(console.error);
    }
  }, [mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => onContent(reader.result as string);
    reader.readAsText(file);
  };

  const handleLoadSaved = async (id: string, name: string) => {
    try {
      const resume = await loadResume(id);
      onContent(resume.content);
      setFileName(name);
    } catch (err) {
      console.error('Failed to load resume:', err);
    }
  };

  return (
    <div className="section">
      <label className="section-label">Resume (.tex)</label>
      <div className="input-mode-tabs">
        <button
          className={mode === 'upload' ? 'tab active' : 'tab'}
          onClick={() => setMode('upload')}
        >
          Upload File
        </button>
        <button
          className={mode === 'paste' ? 'tab active' : 'tab'}
          onClick={() => setMode('paste')}
        >
          Paste Code
        </button>
        <button
          className={mode === 'saved' ? 'tab active' : 'tab'}
          onClick={() => setMode('saved')}
        >
          Saved
        </button>
      </div>

      {mode === 'upload' && (
        <div className="upload-area">
          <input type="file" accept=".tex" onChange={handleFileChange} id="tex-upload" />
          {fileName && <span className="file-name">📄 {fileName}</span>}
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
        />
      )}

      {mode === 'saved' && (
        <div className="saved-resumes">
          {savedResumes.length === 0 ? (
            <p className="muted">No saved resumes yet</p>
          ) : (
            savedResumes.map((r) => (
              <button
                key={r.id}
                className="saved-resume-item"
                onClick={() => handleLoadSaved(r.id, r.name)}
              >
                📄 {r.name}
              </button>
            ))
          )}
        </div>
      )}

      {content && (
        <p className="success">✓ Resume loaded ({content.length.toLocaleString()} chars)</p>
      )}
    </div>
  );
}
