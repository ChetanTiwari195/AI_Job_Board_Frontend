import React, { useState, useEffect } from 'react';
import { getResumes, saveResumeContent, deleteResume, type SavedResume } from '../services/api';
import { Upload, FileText, Code2, Trash2, CheckCircle2, AlertCircle, Save, X, Sparkles } from 'lucide-react';

// ── Tab button ─────────────────────────────────────────────────────────────
const Tab: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} style={{
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "8px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 400 : 300,
    color: active ? "var(--primary)" : "var(--text-muted)",
    background: active ? "var(--bg-card)" : "transparent",
    boxShadow: active ? "var(--s-shadow-1)" : "none",
    transition: "all 0.15s ease",
    touchAction: "manipulation",
  }}>
    {icon} {label}
  </button>
);

// ── Alert banner ───────────────────────────────────────────────────────────
const Banner: React.FC<{ type: 'success' | 'error'; msg: string; onDismiss: () => void }> = ({ type, msg, onDismiss }) => {
  const ok = type === 'success';
  return (
    <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: `1px solid var(--s-${ok ? 'success' : 'danger'}-border)`, background: `var(--s-${ok ? 'success' : 'danger'}-bg)`, color: `var(--s-${ok ? 'success' : 'danger'}-text)`, fontSize: 14, fontWeight: 300, marginBottom: 20 }}>
      {ok ? <CheckCircle2 size={15} style={{ flexShrink: 0 }} /> : <AlertCircle size={15} style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "currentcolor", padding: 2, opacity: 0.6 }}><X size={14} /></button>
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

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 400, color: "var(--text-muted)", letterSpacing: "0.1px", textTransform: "uppercase", marginBottom: 8 };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)", marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 26, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.64px", margin: 0, fontFeatureSettings: '"ss01"' }}>My Resumes</h1>
            <span className="pill-tag">LaTeX (.tex)</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "4px 0 0" }}>
            Manage your profiles to automatically scan keywords and match opportunities
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="card" style={{ padding: 28 }}>
        {/* Tab switcher */}
        <div style={{ display: "flex", background: "var(--bg-surface)", borderRadius: 10, padding: 4, maxWidth: 440, marginBottom: 28, border: "1px solid var(--border-subtle)" }}>
          <Tab active={mode === 'saved'} icon={<FileText size={13} />} label={`Saved (${resumes.length})`} onClick={() => setMode('saved')} />
          <Tab active={mode === 'upload'} icon={<Upload size={13} />} label="Upload File" onClick={() => setMode('upload')} />
          <Tab active={mode === 'paste'} icon={<Code2 size={13} />} label="Paste Code" onClick={() => setMode('paste')} />
        </div>

        {error && <Banner type="error" msg={error} onDismiss={() => setError(null)} />}
        {successMsg && <Banner type="success" msg={successMsg} onDismiss={() => setSuccessMsg(null)} />}

        {/* Saved */}
        {mode === 'saved' && (
          resumes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 32px", border: "1px dashed var(--border-subtle)", borderRadius: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--primary)" }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px" }}>No saved resumes found</h3>
              <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", maxWidth: 300, margin: "0 auto 20px", lineHeight: 1.6 }}>
                Upload your LaTeX resume file or paste raw TeX code to start matching roles.
              </p>
              <button onClick={() => setMode('upload')} className="btn-primary" style={{ fontSize: 13 }}>
                <Upload size={13} /> Upload First Resume
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {resumes.map(resume => (
                <div key={resume.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "border-color 0.15s ease" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"}>
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                        <FileText size={17} />
                      </div>
                      <span className="tnum" style={{ fontSize: 11, fontWeight: 300, color: "var(--text-muted)" }}>
                        {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={resume.name}>{resume.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 300, color: "var(--text-muted)" }}>
                      <Sparkles size={12} color="var(--primary)" /> Keywords indexed
                    </div>
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => handleDelete(resume.id)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 300, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "color 0.15s ease, background 0.15s ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--s-danger-text)"; (e.currentTarget as HTMLElement).style.background = "var(--s-danger-bg)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ border: "1.5px dashed var(--border-subtle)", borderRadius: 12, padding: "48px 32px", textAlign: "center", background: "var(--bg-surface)", transition: "border-color 0.15s ease" }}
              onDragOver={e => e.preventDefault()}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.4)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"}>
              <input type="file" accept=".tex" onChange={handleFileChange} id="resume-upload" style={{ display: "none" }} />
              <label htmlFor="resume-upload" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", marginBottom: 12 }}>
                  <Upload size={24} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px" }}>Choose a LaTeX resume file</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: "var(--text-muted)", marginBottom: 16 }}>Accepts standard <code style={{ color: "var(--primary)", fontFamily: "monospace" }}>.tex</code> resume templates</p>
                <span className="btn-primary" style={{ fontSize: 13 }}>Browse Files</span>
              </label>
            </div>

            {fileName && content && (
              <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <FileText size={17} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 400, color: "var(--text-primary)", margin: 0 }}>{fileName}</p>
                    <p className="tnum" style={{ fontSize: 12, fontWeight: 300, color: "var(--text-muted)", margin: "2px 0 0" }}>{(content.length / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={handleSave} disabled={isLoading} className="btn-primary" style={{ fontSize: 13 }}>
                  {isLoading ? <><div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing…</> : <><Save size={13} /> Save & Index</>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Paste */}
        {mode === 'paste' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={labelStyle}>Resume Title</label>
              <input type="text" placeholder="e.g., Software_Engineer_2026.tex" value={fileName} onChange={e => setFileName(e.target.value)} className="s-input" />
            </div>
            <div>
              <label style={labelStyle}>LaTeX Source Code</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={"\\documentclass[letterpaper,11pt]{article}\n\\begin{document}\n...\n\\end{document}"}
                style={{ width: "100%", height: 320, background: "#0d1117", color: "#e8edf3", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: 13, padding: "16px", borderRadius: 10, border: "1px solid var(--border-subtle)", outline: "none", lineHeight: 1.6, resize: "vertical", transition: "border-color 0.15s ease" }}
                spellCheck={false}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSave} disabled={isLoading || !content.trim()} className="btn-primary" style={{ fontSize: 14, padding: "10px 24px" }}>
                {isLoading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Indexing…</> : <><Save size={14} /> Save & Index Resume</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
