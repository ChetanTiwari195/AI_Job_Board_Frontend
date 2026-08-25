import React, { useState, useEffect } from 'react';
import { getResumes, saveResumeContent, deleteResume, type SavedResume } from '../services/api';
import { Upload, FileText, Code2, Trash2, CheckCircle2, AlertCircle, Save, X, Sparkles } from 'lucide-react';

// ── Tab button ─────────────────────────────────────────────────────────────
const Tab: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border-none cursor-pointer text-[13px] transition-all duration-150 touch-manipulation ${active ? 'font-normal text-[var(--primary)] bg-[var(--bg-card)] shadow-[var(--s-shadow-1)]' : 'font-light text-[var(--text-muted)] bg-transparent shadow-none'}`}>
    {icon} {label}
  </button>
);

// ── Alert banner ───────────────────────────────────────────────────────────
const Banner: React.FC<{ type: 'success' | 'error'; msg: string; onDismiss: () => void }> = ({ type, msg, onDismiss }) => {
  const ok = type === 'success';
  return (
    <div className={`animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-light mb-5 ${ok ? 'border-[var(--s-success-border)] bg-[var(--s-success-bg)] text-[var(--s-success-text)]' : 'border-[var(--s-danger-border)] bg-[var(--s-danger-bg)] text-[var(--s-danger-text)]'}`}>
      {ok ? <CheckCircle2 size={15} className="shrink-0" /> : <AlertCircle size={15} className="shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onDismiss} className="bg-transparent border-none cursor-pointer text-current p-0.5 opacity-60"><X size={14} /></button>
    </div>
  );
};

export const Resumes: React.FC = () => {
  const [mode, setMode] = useState<'saved' | 'upload' | 'paste'>('saved');
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try { setResumes(await getResumes()); }
    catch (e) { console.error(e); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setContent(reader.result as string);
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!content.trim()) { setError('Resume content cannot be empty.'); return; }
    setIsLoading(true); setError(null); setSuccessMsg(null);
    try {
      await saveResumeContent(fileName || `resume_${Date.now()}.tex`, content);
      setSuccessMsg('Resume uploaded successfully and keywords extracted!');
      setContent(''); setFileName(''); setMode('saved');
      await fetchResumes();
    } catch { setError('Failed to save resume. Make sure the backend server is reachable.'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this resume?')) return;
    try { await deleteResume(id); await fetchResumes(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="py-7 px-8 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[var(--border-subtle)] mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] font-light text-[var(--text-primary)] tracking-tight m-0 [font-feature-settings:'ss01']">My Resumes</h1>
            <span className="pill-tag">LaTeX (.tex)</span>
          </div>
          <p className="text-sm font-light text-[var(--text-muted)] mt-1 mb-0">
            Manage your profiles to automatically scan keywords and match opportunities
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="card p-7">
        {/* Tab switcher */}
        <div className="flex bg-[var(--bg-surface)] rounded-lg p-1 max-w-[440px] mb-7 border border-[var(--border-subtle)]">
          <Tab active={mode === 'saved'} icon={<FileText size={13} />} label={`Saved (${resumes.length})`} onClick={() => setMode('saved')} />
          <Tab active={mode === 'upload'} icon={<Upload size={13} />} label="Upload File" onClick={() => setMode('upload')} />
          <Tab active={mode === 'paste'} icon={<Code2 size={13} />} label="Paste Code" onClick={() => setMode('paste')} />
        </div>

        {error && <Banner type="error" msg={error} onDismiss={() => setError(null)} />}
        {successMsg && <Banner type="success" msg={successMsg} onDismiss={() => setSuccessMsg(null)} />}

        {/* Saved */}
        {mode === 'saved' && (
          resumes.length === 0 ? (
            <div className="text-center py-12 px-8 border border-dashed border-[var(--border-subtle)] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
                <FileText size={22} />
              </div>
              <h3 className="text-base font-normal text-[var(--text-primary)] m-0 mb-1.5">No saved resumes found</h3>
              <p className="text-sm font-light text-[var(--text-muted)] max-w-[300px] mx-auto mb-5 leading-relaxed">
                Upload your LaTeX resume file or paste raw TeX code to start matching roles.
              </p>
              <button onClick={() => setMode('upload')} className="btn-primary text-[13px]">
                <Upload size={13} /> Upload First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
              {resumes.map(resume => (
                <div key={resume.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 flex flex-col justify-between transition-colors duration-150 hover:border-blue-600/20">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-md bg-blue-600/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                        <FileText size={17} />
                      </div>
                      <span className="tnum text-[11px] font-light text-[var(--text-muted)]">
                        {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-normal text-[var(--text-primary)] m-0 mb-2 truncate" title={resume.name}>{resume.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-light text-[var(--text-muted)]">
                      <Sparkles size={12} className="text-[var(--primary)]" /> Keywords indexed
                    </div>
                  </div>
                  <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex justify-end">
                    <button onClick={() => handleDelete(resume.id)} className="flex items-center gap-1.5 text-xs font-light text-[var(--text-muted)] bg-transparent border-none cursor-pointer py-1 px-2 rounded-md transition-colors duration-150 hover:text-[var(--s-danger-text)] hover:bg-[var(--s-danger-bg)]">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Upload */}
        {mode === 'upload' && (
          <div className="flex flex-col gap-4">
            <div className="border-[1.5px] border-dashed border-[var(--border-subtle)] rounded-xl py-12 px-8 text-center bg-[var(--bg-surface)] transition-colors duration-150 hover:border-blue-600/40"
              onDragOver={e => e.preventDefault()}>
              <input type="file" accept=".tex" onChange={handleFileChange} id="resume-upload" className="hidden" />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-[52px] h-[52px] rounded-xl bg-blue-600/10 flex items-center justify-center text-[var(--primary)] mb-3">
                  <Upload size={24} />
                </div>
                <h3 className="text-base font-normal text-[var(--text-primary)] m-0 mb-1.5">Choose a LaTeX resume file</h3>
                <p className="text-[13px] font-light text-[var(--text-muted)] mb-4">Accepts standard <code className="text-[var(--primary)] font-mono">.tex</code> resume templates</p>
                <span className="btn-primary text-[13px]">Browse Files</span>
              </label>
            </div>

            {fileName && content && (
              <div className="animate-fade-in flex items-center justify-between py-3.5 px-4.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-blue-600/10 flex items-center justify-center text-[var(--primary)]">
                    <FileText size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-normal text-[var(--text-primary)] m-0">{fileName}</p>
                    <p className="tnum text-xs font-light text-[var(--text-muted)] m-0 mt-0.5">{(content.length / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={handleSave} disabled={isLoading} className="btn-primary text-[13px]">
                  {isLoading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</> : <><Save size={13} /> Save & Index</>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Paste */}
        {mode === 'paste' && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-2">Resume Title</label>
              <input type="text" placeholder="e.g., Software_Engineer_2026.tex" value={fileName} onChange={e => setFileName(e.target.value)} className="s-input" />
            </div>
            <div>
              <label className="block text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-2">LaTeX Source Code</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={"\\documentclass[letterpaper,11pt]{article}\n\\begin{document}\n...\n\\end{document}"}
                className="w-full h-80 bg-[#0d1117] text-[#e8edf3] font-mono text-[13px] p-4 rounded-lg border border-[var(--border-subtle)] outline-none leading-relaxed resize-y transition-colors duration-150 focus:border-[var(--primary)]"
                spellCheck={false}
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={isLoading || !content.trim()} className="btn-primary text-sm py-2.5 px-6">
                {isLoading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Indexing…</> : <><Save size={14} /> Save & Index Resume</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
