import React, { useEffect, useState } from 'react';
import { getSavedJobs, saveJob, unsaveJob, applyJob } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';

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
                // Shouldn't happen here normally since they are already saved,
                // but if we toggle, we just fetch again or update state.
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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Saved Jobs</h1>
                <p className="text-gray-400 mt-1">Your bookmarked opportunities</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-pulse flex space-x-2">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
                    <p className="text-gray-400">No saved jobs yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
