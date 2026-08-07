import React, { useState, useEffect } from 'react';
import { getResumes, saveResumeContent, deleteResume, type SavedResume } from '../services/api';
import { Upload, FileText, Code, Trash2, CheckCircle, Save, X } from 'lucide-react';

export const Resumes: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'paste' | 'saved'>('saved');
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
      setSuccessMsg('Resume saved successfully and keywords extracted!');
      setContent('');
      setFileName('');
      setMode('saved');
      await fetchResumes();
    } catch (err) {
      setError('Failed to save resume. Make sure the backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await deleteResume(id);
      await fetchResumes();
    } catch (err) {
      console.error("Failed to delete resume", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
          <p className="text-gray-400">Upload and manage your LaTeX (.tex) resumes</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setMode('saved')}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
              mode === 'saved' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <FileText className="w-5 h-5" />
            Saved Resumes
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
              mode === 'upload' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
              mode === 'paste' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Code className="w-5 h-5" />
            Paste Code
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-start gap-3">
              <X className="w-5 h-5 text-red-400 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <p className="text-green-200">{successMsg}</p>
            </div>
          )}

          {mode === 'saved' && (
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved resumes yet.</p>
                  <button onClick={() => setMode('upload')} className="mt-4 text-blue-400 hover:text-blue-300">
                    Upload your first resume
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resumes.map(resume => (
                    <div key={resume.id} className="bg-gray-800 border border-gray-700 p-5 rounded-lg flex flex-col justify-between hover:border-gray-600 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500/20 rounded text-blue-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <h3 className="font-medium text-white truncate" title={resume.name}>{resume.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          Updated {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-gray-500 transition-colors bg-gray-800/50">
                <input 
                  type="file" 
                  accept=".tex" 
                  onChange={handleFileChange} 
                  id="resume-upload" 
                  className="hidden" 
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a LaTeX file</h3>
                  <p className="text-gray-400 mb-6">Supported format: .tex</p>
                  <span className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
                    Browse Files
                  </span>
                </label>
              </div>
              
              {fileName && content && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-400 w-6 h-6" />
                    <div>
                      <p className="text-white font-medium">{fileName}</p>
                      <p className="text-xs text-gray-400">{(content.length / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {isLoading ? 'Saving & Extracting...' : 'Save Resume'}
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'paste' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Resume Name (e.g., Software_Engineer.tex)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your LaTeX code here..."
                className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                spellCheck={false}
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !content.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isLoading ? 'Saving & Extracting...' : 'Save Resume'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
