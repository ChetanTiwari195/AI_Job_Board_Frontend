import React from 'react';
import type { Job } from '../services/api';
import { X, ExternalLink, Bookmark, BookmarkCheck, Sparkles, Building, MapPin } from 'lucide-react';

interface JobDetailsModalProps {
    job: Job;
    onClose: () => void;
    onSave: (id: number, saved: boolean) => void;
    onApply: (url: string, id: number) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onSave, onApply }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-modal-scale overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="pr-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-2">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                <Building className="w-4 h-4 text-slate-400" />
                                {job.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {job.location}
                            </span>
                            {job.source && (
                                <>
                                    <span>•</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {job.source}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        aria-label="Close modal"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {job.ai_summary && (
                        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-4 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI Job Insights</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {job.ai_summary}
                            </p>
                            
                            {job.missing_skills && job.missing_skills.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-blue-100/80 dark:border-blue-900/30">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
                                        Skills to highlight:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {job.missing_skills.map((skill, i) => (
                                            <span 
                                                key={i} 
                                                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                            Job Description
                        </h3>
                        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {job.description}
                        </div>
                    </div>
                </div>
                
                {/* Footer Actions */}
                <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-[#0c1220]">
                    <button 
                        onClick={() => onSave(job.id, job.saved)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                        {job.saved ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <Bookmark className="w-4 h-4" />
                        )}
                        <span>{job.saved ? 'Saved' : 'Save Job'}</span>
                    </button>
                    
                    <button 
                        onClick={() => onApply(job.apply_url, job.id)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
                    >
                        <span>Apply on {job.source || 'Website'}</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
