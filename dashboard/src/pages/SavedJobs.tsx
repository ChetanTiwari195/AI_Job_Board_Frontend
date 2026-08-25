import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSavedJobs, saveJob, unsaveJob, applyJob } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Bookmark, LayoutDashboard } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string }> = ({ title, subtitle, badge }) => (
  <div className="pb-5 border-b border-[var(--border-subtle)] mb-6">
    <div className="flex items-center gap-2.5">
      <h1 className="text-[26px] font-light text-[var(--text-primary)] tracking-tight m-0 [font-feature-settings:'ss01']">{title}</h1>
      {badge && <span className="pill-tag text-[11px]">{badge}</span>}
    </div>
    <p className="text-sm font-light text-[var(--text-muted)] mt-1 mb-0">{subtitle}</p>
  </div>
);

export const SavedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetch = async () => {
    try { setLoading(true); setJobs(await getSavedJobs()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (id: number, saved: boolean) => {
    try {
      if (saved) { await unsaveJob(id); setJobs(j => j.filter(x => x.id !== id)); }
      else await saveJob(id);
      if (selectedJob?.id === id) setSelectedJob(null);
    } catch (e) { console.error(e); }
  };

  const handleApply = async (url: string, id: number) => {
    try { await applyJob(id); window.open(url, '_blank'); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="py-7 px-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Saved Jobs"
        subtitle="Review and manage your shortlisted opportunities"
        badge={!loading && jobs.length > 0 ? `${jobs.length} bookmarked` : undefined}
      />

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 flex flex-col gap-3">
              <div className="skeleton-shimmer h-[18px] rounded-md w-[70%]" />
              <div className="flex gap-2">
                <div className="skeleton-shimmer h-3.5 rounded-full w-[72px]" />
                <div className="skeleton-shimmer h-3.5 rounded-full w-[56px]" />
              </div>
              <div className="skeleton-shimmer h-3 rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16 px-8 border border-dashed border-[var(--border-subtle)]">
          <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
            <Bookmark size={22} />
          </div>
          <h3 className="text-base font-normal text-[var(--text-primary)] m-0 mb-1.5">No saved jobs yet</h3>
          <p className="text-sm font-light text-[var(--text-muted)] max-w-[300px] mx-auto mb-5 leading-relaxed">
            Bookmark interesting listings in your job feed to review them later.
          </p>
          <Link to="/dashboard" className="btn-primary text-[13px]">
            <LayoutDashboard size={13} /> Browse Job Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} onSave={handleSave} onApply={handleApply} />
          ))}
        </div>
      )}

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onSave={handleSave} onApply={handleApply} />}
    </div>
  );
};
