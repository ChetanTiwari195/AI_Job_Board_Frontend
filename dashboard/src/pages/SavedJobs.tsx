import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSavedJobs, saveJob, unsaveJob, applyJob } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Bookmark, LayoutDashboard } from 'lucide-react';

export const SavedJobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getSavedJobs();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch saved jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSave = async (id: number, currentlySaved: boolean) => {
        try {
            if (currentlySaved) {
                await unsaveJob(id);
                setJobs(jobs.filter(j => j.id !== id));
            } else {
                await saveJob(id);
            }
            if (selectedJob && selectedJob.id === id) {
                setSelectedJob(null);
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

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Saved Jobs
                        </h1>
                        {!loading && jobs.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                {jobs.length} bookmarked
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Review and manage your shortlisted opportunities
                    </p>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                /* Skeleton Loader */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
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
                        </div>
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                /* Empty State */
                <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        No saved jobs yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        Bookmark interesting listings in your job feed to review them later here.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Browse Job Feed</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {jobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onClick={() => setSelectedJob(job)} 
                            onSave={handleSave}
                            onApply={handleApply}
                        />
                    ))}
                </div>
            )}

            {/* Details Modal */}
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
