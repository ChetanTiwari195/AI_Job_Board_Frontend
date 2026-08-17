import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobMatches, saveJob, unsaveJob, applyJob } from '../services/api';
import type { MatchResponse, Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Search, Star, FileText, X } from 'lucide-react';

export const ResumeMatches: React.FC = () => {
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [skip, setSkip] = useState(0);
    const limit = 20;

    const fetchMatches = async (skipCount: number) => {
        try {
            setLoading(true);
            const data = await getJobMatches(skipCount, limit);
            if (skipCount === 0) {
                setMatches(data);
            } else {
                setMatches(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error("Failed to fetch job matches", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches(0);
    }, []);

    const handleLoadMore = () => {
        const nextSkip = skip + limit;
        setSkip(nextSkip);
        fetchMatches(nextSkip);
    };

    const handleSave = async (id: number, currentlySaved: boolean) => {
        try {
            if (currentlySaved) {
                await unsaveJob(id);
            } else {
                await saveJob(id);
            }
            setMatches(matches.map(m => m.job.id === id ? { ...m, job: { ...m.job, saved: !currentlySaved } } : m));
            if (selectedJob && selectedJob.id === id) {
                setSelectedJob({ ...selectedJob, saved: !currentlySaved });
            }
        } catch (error) {
            console.error("Failed to toggle save", error);
        }
    };

    const handleApply = async (url: string, id: number) => {
        try {
            await applyJob(id);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Failed to apply", error);
        }
    };

    const filteredMatches = matches.filter(m => 
        m.job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.job.location && m.job.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Resume Matches
                        </h1>
                        {!loading && matches.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                {matches.length} matched
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Ranked by keyword overlap and skill alignment with your uploaded resumes
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search matches..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {loading && skip === 0 ? (
                /* Skeleton Loading */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="h-5 skeleton-shimmer rounded-md w-3/4" />
                                <div className="h-4 skeleton-shimmer rounded-md w-4" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-4 skeleton-shimmer rounded-md w-20" />
                                <div className="h-4 skeleton-shimmer rounded-md w-20" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 skeleton-shimmer rounded-md w-full" />
                                <div className="h-3 skeleton-shimmer rounded-md w-5/6" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div className="h-4 skeleton-shimmer rounded-md w-16" />
                                <div className="h-7 skeleton-shimmer rounded-md w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredMatches.length === 0 ? (
                /* Empty State */
                <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
                        <Star className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {searchQuery ? "No matching roles found" : "No resume matches yet"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        {searchQuery 
                            ? "Try refining your search keyword."
                            : "Upload a LaTeX resume to automatically scan and rank matching opportunities."}
                    </p>
                    {!searchQuery && (
                        <Link
                            to="/resumes"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Upload Resume</span>
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredMatches.map((match, idx) => {
                            // Ensure job includes the match_score
                            const enhancedJob: Job = {
                                ...match.job,
                                ai_score: match.match_score ?? match.job.ai_score,
                            };
                            return (
                                <JobCard 
                                    key={idx} 
                                    job={enhancedJob} 
                                    onClick={() => setSelectedJob(enhancedJob)} 
                                    onSave={handleSave}
                                    onApply={handleApply}
                                />
                            );
                        })}
                    </div>
                    
                    {matches.length > 0 && (
                        <div className="mt-8 flex justify-center pb-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-6 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg shadow-xs hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? 'Loading More...' : 'Load More Matches'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {selectedJob && (
                <JobDetailsModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)}
                    onSave={handleSave}
                    onApply={handleApply}
                />
            )}
        </div>
    );
};
