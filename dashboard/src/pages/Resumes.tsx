import React, { useState, useEffect } from 'react';
import { getResumes, saveResumeContent, deleteResume, type SavedResume } from '../services/api';
import { Upload, FileText, Code2, Trash2, CheckCircle2, AlertCircle, Save, X, Sparkles } from 'lucide-react';

export const Resumes: React.FC = () => {
  const [mode, setMode] = useState<'saved' | 'upload' | 'paste'>('saved');
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    }
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
    if (!content.trim()) {
      setError('Resume content cannot be empty.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const name = fileName || `resume_${new Date().getTime()}.tex`;
      await saveResumeContent(name, content);
      setSuccessMsg('Resume uploaded successfully and keywords extracted!');
      setContent('');
      setFileName('');
      setMode('saved');
      await fetchResumes();
    } catch (err) {
      setError('Failed to save resume. Make sure the backend server is reachable.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this resume?')) return;
    try {
      await deleteResume(id);
      await fetchResumes();
    } catch (err) {
      console.error("Failed to delete resume", err);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              My Resumes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              LaTeX (.tex)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your profiles to automatically scan keywords and match opportunities
          </p>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        {/* Segmented Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl max-w-md mb-6 border border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => setMode('saved')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
              mode === 'saved'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Saved Resumes ({resumes.length})</span>
          </button>
          
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          
          <button
            onClick={() => setMode('paste')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
              mode === 'paste'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Paste Code</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-3 text-sm text-rose-700 dark:text-rose-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="flex-1">{successMsg}</p>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: Saved Resumes */}
        {mode === 'saved' && (
          <div>
            {resumes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  No saved resumes found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Upload your LaTeX resume file or paste raw TeX code to start matching roles.
                </p>
                <button
                  onClick={() => setMode('upload')}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Upload First Resume
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resumes.map(resume => (
                  <div 
                    key={resume.id} 
                    className="bg-slate-50/50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm" title={resume.name}>
                        {resume.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Keywords indexed</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end items-center">
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Remove resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload Mode */}
        {mode === 'upload' && (
          <div className="space-y-5">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 bg-slate-50/50 dark:bg-[#0c1220] rounded-2xl p-10 text-center transition-all cursor-pointer">
              <input 
                type="file" 
                accept=".tex" 
                onChange={handleFileChange} 
                id="resume-upload" 
                className="hidden" 
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Choose a LaTeX resume file
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Accepts standard <code className="text-blue-600 dark:text-blue-400">.tex</code> resume templates
                </p>
                <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                  Browse Files
                </span>
              </label>
            </div>
            
            {fileName && content && (
              <div className="bg-slate-50 dark:bg-[#0c1220] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fileName}</p>
                    <p className="text-xs text-slate-400">{(content.length / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isLoading ? 'Processing...' : 'Save & Index'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paste Code */}
        {mode === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Resume Title
              </label>
              <input 
                type="text" 
                placeholder="e.g., Software_Engineer_2026.tex"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                LaTeX Source Code
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="\documentclass[letterpaper,11pt]{article}&#10;\begin{document}&#10;...&#10;\end{document}"
                className="w-full h-80 bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all leading-relaxed"
                spellCheck={false}
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={isLoading || !content.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Indexing Resume...' : 'Save & Index Resume'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
