import React, { useEffect, useState } from 'react';
import { getJobMatches, saveJob, unsaveJob, applyJob } from '../services/api';
import type { MatchResponse, Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Search } from 'lucide-react';

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
        m.job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Resume Matches</h1>
                    <p className="text-gray-400 mt-1">Jobs ranked by keyword overlap with your resumes</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search matches..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {loading && skip === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="animate-pulse flex space-x-2">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            ) : filteredMatches.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
                    <p className="text-gray-400">No matches found. Upload a resume via the extension to see matches.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMatches.map((match, idx) => (
                            <div key={idx} className="relative">
                                {/* Score Badge */}
                                <div className="absolute -top-3 -right-3 z-10 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg border border-blue-400/20">
                                    {match.match_score}% Match
                                </div>
                                <JobCard 
                                    job={match.job} 
                                    onClick={() => setSelectedJob(match.job)} 
                                    onSave={handleSave}
                                    onApply={handleApply}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {matches.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
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
