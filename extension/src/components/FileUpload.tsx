import { useState, useEffect } from 'react';
import { loadResumes, loadResume, loadTemplates, uploadPdfResume, API_URL } from '../services/api';

interface FileUploadProps {
  onContent: (content: string, resumeId?: string) => void;
  content: string;
}

interface SavedResume {
  id: string;
  name: string;
  updated_at: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

function getDirectImageUrl(url?: string): string {
  if (!url) return '/templates/template_1.png';
  
  // If it's a relative static URL from our backend, resolve it against the backend base URL
  if (url.startsWith('/static/')) {
    const baseUrl = API_URL.replace(/\/api$/, '');
    return `${baseUrl}${url}`;
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  return url;
}

export function FileUpload({ onContent, content }: FileUploadProps) {
  const [mode, setMode] = useState<'upload' | 'paste' | 'saved'>('upload');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | ''>('');
  const [fileName, setFileName] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mode === 'saved') {
      loadResumes().then(setSavedResumes).catch(console.error);
    } else if (mode === 'upload') {
      loadTemplates().then(t => {
        setTemplates(t);
        if (t.length > 0) setSelectedTemplate(t[0].id);
      }).catch(console.error);
    }
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    if (file.name.toLowerCase().endsWith('.pdf')) {
      if (!selectedTemplate) {
        alert("Please select a template first.");
        return;
      }
      try {
        setUploadingPdf(true);
        const result = await uploadPdfResume(file, selectedTemplate as number);
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
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Template (for PDF uploads):</label>
            <button 
              className="button"
              onClick={() => setIsModalOpen(true)}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : "Choose a Template..."}
            </button>
            
            {isModalOpen && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'var(--bg-color)',
                  border: '2px solid var(--border-color)',
                  boxShadow: 'var(--shadow-solid)',
                  width: '90%',
                  maxWidth: '300px',
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    padding: '10px',
                    borderBottom: '2px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <strong style={{ fontSize: '14px' }}>Select Template</strong>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    {templates.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          setSelectedTemplate(t.id);
                          setIsModalOpen(false);
                        }}
                        style={{
                          cursor: 'pointer',
                          border: selectedTemplate === t.id ? '2px solid var(--border-color)' : '1px solid var(--border-color)',
                          boxShadow: selectedTemplate === t.id ? 'var(--shadow-solid)' : 'none',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          background: 'var(--bg-color)',
                          height: '290px', // Exact height so one full + 20% of next fits in 400px container
                          flexShrink: 0
                        }}
                      >
                        <img 
                          src={getDirectImageUrl(t.image_url)} 
                          alt={t.name} 
                          style={{ 
                            width: '100%', 
                            height: '240px',
                            objectFit: 'cover',
                            objectPosition: 'top',
                            border: '1px solid var(--border-color)', 
                            marginBottom: '10px',
                            background: 'white'
                          }} 
                        />
                        <span style={{ fontSize: '14px', textAlign: 'center', fontWeight: selectedTemplate === t.id ? 'bold' : 'normal' }}>
                          {t.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
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
