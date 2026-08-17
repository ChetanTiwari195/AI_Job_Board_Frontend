import { useState, useEffect } from 'react';
import { loadResumes, loadResume, uploadPdfResume } from '../services/api';

interface FileUploadProps {
  onContent: (content: string, resumeId?: string) => void;
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
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    if (mode === 'saved') {
      loadResumes().then(setSavedResumes).catch(console.error);
    }
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        setUploadingPdf(true);
        const result = await uploadPdfResume(file);
        onContent(result.updated_tex);
      } catch (err) {
         console.error(err);
         alert("Failed to upload PDF");
      } finally {
        setUploadingPdf(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => onContent(reader.result as string);
      reader.readAsText(file);
    }
  };

  const handleLoadSaved = async (id: string, name: string) => {
    try {
      const resume = await loadResume(id);
      onContent(resume.content, id);
      setFileName(name);
    } catch (err) {
      console.error('Failed to load resume:', err);
    }
  };

  return (
    <div className="section">
      <label className="section-label">Resume (.tex or .pdf)</label>
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
        <div className="upload-area" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="file" accept=".tex,.pdf" onChange={handleFileChange} id="file-upload" disabled={uploadingPdf} />
          {uploadingPdf && <span className="muted">Parsing PDF and generating template...</span>}
          {fileName && !uploadingPdf && <span className="file-name">📄 {fileName}</span>}
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

      {content && !uploadingPdf && (
        <p className="success">✓ Resume loaded ({content.length.toLocaleString()} chars)</p>
      )}
    </div>
  );
}

