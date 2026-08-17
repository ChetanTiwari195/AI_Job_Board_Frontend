import React, { useEffect, useState } from 'react';
import { getJobs, saveJob, unsaveJob, applyJob, refreshJobs } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { RefreshCw, Search, Briefcase, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getJobs();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
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
            } else {
                await saveJob(id);
            }
            setJobs(jobs.map(j => j.id === id ? { ...j, saved: !currentlySaved } : j));
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

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await refreshJobs();
            setTimeout(() => {
                fetchJobs();
                setRefreshing(false);
            }, 4000);
        } catch (error) {
            console.error("Failed to refresh", error);
            setRefreshing(false);
        }
    };

    const filteredJobs = jobs.filter(j => 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.location && j.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Job Feed
                        </h1>
                        {!loading && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {jobs.length} total
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Explore curated roles matched to your target profile
                    </p>
                </div>
                
                {/* Search & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Filter by title, company..." 
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
                    
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-all shadow-xs hover:shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
                        <span>{refreshing ? 'Fetching...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                /* Sleek Shimmer Skeleton Grid */
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
            ) : filteredJobs.length === 0 ? (
                /* Elegant Empty State */
                <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {searchQuery ? "No matching jobs found" : "No jobs in feed"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        {searchQuery 
                            ? "Try adjusting your search keywords or clear the filter." 
                            : "Click refresh to scan your configured job boards for new listings."}
                    </p>
                    {searchQuery ? (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Clear search query
                        </button>
                    ) : (
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                        >
                            Refresh Sources
                        </button>
                    )}
                </div>
            ) : (
                /* Grid of Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredJobs.map(job => (
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
