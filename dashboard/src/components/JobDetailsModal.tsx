import React from 'react';
import type { Job } from '../services/api';
import { X, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

interface JobDetailsModalProps {
    job: Job;
    onClose: () => void;
    onSave: (id: number, saved: boolean) => void;
    onApply: (url: string, id: number) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onSave, onApply }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">{job.title}</h2>
                        <p className="text-gray-400 mt-1">{job.company} • {job.location}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {job.ai_summary && (
                        <div className="mb-6 bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl">
                            <h4 className="text-blue-400 font-medium mb-2">AI Summary</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">{job.ai_summary}</p>
                            
                            {job.missing_skills && job.missing_skills.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="text-sm text-gray-400 mb-2">Missing Skills:</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {job.missing_skills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Job Description</h3>
                        <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-800 flex justify-between items-center bg-gray-900 rounded-b-2xl">
                    <button 
                        onClick={() => onSave(job.id, job.saved)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
                    >
                        {job.saved ? <BookmarkCheck className="w-5 h-5 text-blue-400" /> : <Bookmark className="w-5 h-5" />}
                        {job.saved ? 'Saved' : 'Save Job'}
                    </button>
                    
                    <button 
                        onClick={() => onApply(job.apply_url, job.id)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                    >
                        Apply Now <ExternalLink className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
