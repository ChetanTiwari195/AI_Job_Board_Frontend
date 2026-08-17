import React from 'react';
import type { Job } from '../services/api';
import { ExternalLink, Bookmark, BookmarkCheck, MapPin, Building, Globe } from 'lucide-react';

interface JobCardProps {
    job: Job;
    onClick: () => void;
    onSave: (id: number, saved: boolean) => void;
    onApply: (url: string, id: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onSave, onApply }) => {
    const getScoreBadge = (score: number) => {
        if (score >= 80) {
            return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
        }
        if (score >= 50) {
            return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
        }
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    };

    return (
        <div 
            onClick={onClick}
            className="group relative bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 dark:hover:border-blue-500/40 rounded-xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-slate-900/40 transition-all duration-200 flex flex-col justify-between h-full"
        >
            <div>
                {/* Header with Title & Bookmark */}
                <div className="flex justify-between items-start gap-3 mb-2.5">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {job.title}
                    </h3>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onSave(job.id, job.saved); }}
                        title={job.saved ? "Remove from saved" : "Save job"}
                        className="p-1.5 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex-shrink-0"
                    >
                        {job.saved ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <Bookmark className="w-4 h-4" />
                        )}
                    </button>
                </div>
                
                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" /> 
                        <span className="truncate max-w-[120px]">{job.company}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                        <span className="truncate max-w-[120px]">{job.location}</span>
                    </span>
                    {job.source && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                            <Globe className="w-3.5 h-3.5 text-slate-400" /> 
                            <span>{job.source}</span>
                        </span>
                    )}
                </div>
                
                {/* Job Description Snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {job.description}
                </p>
            </div>
            
            {/* Card Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                <div className="flex items-center gap-2">
                    {job.ai_score !== undefined && job.ai_score !== null && (
                        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getScoreBadge(job.ai_score)}`}>
                            {job.ai_score}% Match
                        </div>
                    )}
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                
                <button
                    onClick={(e) => { e.stopPropagation(); onApply(job.apply_url, job.id); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-medium rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
                >
                    <span>Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};
