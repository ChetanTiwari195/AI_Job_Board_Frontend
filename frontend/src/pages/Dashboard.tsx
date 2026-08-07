import React, { useEffect, useState } from 'react';
import { getJobs, saveJob, unsaveJob, applyJob, refreshJobs } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { RefreshCw, Search } from 'lucide-react';

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
            // In a real app we'd poll or use websockets to know when refresh is done.
            // For MVP, we just wait a bit and fetch again.
            setTimeout(() => {
                fetchJobs();
                setRefreshing(false);
            }, 5000);
        } catch (error) {
            console.error("Failed to refresh", error);
            setRefreshing(false);
        }
    };

    const filteredJobs = jobs.filter(j => 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        j.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Job Dashboard</h1>
                    <p className="text-gray-400 mt-1">Discover AI-curated opportunities</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-pulse flex space-x-2">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
                    <p className="text-gray-400">No jobs found. Try refreshing the sources.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
