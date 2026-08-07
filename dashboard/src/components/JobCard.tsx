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
    return (
        <div 
            onClick={onClick}
            className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => { e.stopPropagation(); onSave(job.id, job.saved); }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                    {job.saved ? <BookmarkCheck className="w-4 h-4 text-blue-400" /> : <Bookmark className="w-4 h-4 text-gray-400" />}
                </button>
            </div>
            
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-100 pr-12">{job.title}</h3>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {job.source}</span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {job.description}
            </p>
            
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    {job.ai_score !== undefined && job.ai_score !== null && (
                        <div className={`px-2 py-1 rounded-md text-xs font-medium ${job.ai_score! > 80 ? 'bg-green-900/50 text-green-400' : job.ai_score! > 50 ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                            {job.ai_score}% Match
                        </div>
                    )}
                    <span className="text-xs text-gray-600">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                
                <button
                    onClick={(e) => { e.stopPropagation(); onApply(job.apply_url, job.id); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Apply <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
