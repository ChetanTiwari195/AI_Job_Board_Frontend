import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobMatches, saveJob, unsaveJob, applyJob } from '../services/api';
import type { MatchResponse, Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Search, Star, FileText, X } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string; actions?: React.ReactNode }> = ({ title, subtitle, badge, actions }) => (
  <div className="flex items-start justify-between gap-3 flex-wrap pb-5 border-b border-[var(--border-subtle)] mb-6">
    <div>
      <div className="flex items-center gap-2.5">
        <h1 className="text-[26px] font-light text-[var(--text-primary)] tracking-tight m-0 [font-feature-settings:'ss01']">{title}</h1>
        {badge && <span className="pill-tag text-[11px]">{badge}</span>}
      </div>
      <p className="text-sm font-light text-[var(--text-muted)] mt-1 mb-0">{subtitle}</p>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="card p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="skeleton-shimmer h-[18px] rounded-md w-[70%]" />
          <div className="skeleton-shimmer h-[18px] w-[18px] rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-3.5 rounded-full w-[72px]" />
          <div className="skeleton-shimmer h-3.5 rounded-full w-[56px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="skeleton-shimmer h-3 rounded w-full" />
          <div className="skeleton-shimmer h-3 rounded w-[83%]" />
        </div>
      </div>
    ))}
  </div>
);

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="relative w-60">
    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Search matches…"
      className={`w-full pl-8 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] text-[13px] font-light outline-none transition-all duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] ${value ? 'pr-7' : 'pr-2.5'}`} />
    {value && <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text-muted)] p-0.5"><X size={12} /></button>}
  </div>
);

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
      setMatches(prev => skipCount === 0 ? data : [...prev, ...data]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMatches(0); }, []);

  const handleSave = async (id: number, saved: boolean) => {
    try {
      saved ? await unsaveJob(id) : await saveJob(id);
      setMatches(m => m.map(x => x.job.id === id ? { ...x, job: { ...x.job, saved: !saved } } : x));
      if (selectedJob?.id === id) setSelectedJob(s => s && { ...s, saved: !saved });
    } catch (e) { console.error(e); }
  };

  const handleApply = async (url: string, id: number) => {
    try { await applyJob(id); window.open(url, '_blank'); }
    catch (e) { console.error(e); }
  };

  const filtered = matches.filter(m =>
    [m.job.title, m.job.company, m.job.location ?? ""].some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-7 px-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Resume Matches"
        subtitle="Ranked by keyword overlap and skill alignment with your uploaded resumes"
        badge={!loading && matches.length > 0 ? `${matches.length} matched` : undefined}
        actions={<SearchInput value={searchQuery} onChange={setSearchQuery} />}
      />

      {loading && skip === 0 ? <SkeletonGrid />
        : filtered.length === 0
          ? (
            <div className="card text-center py-16 px-8 border border-dashed border-[var(--border-subtle)]">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
                <Star size={22} />
              </div>
              <h3 className="text-base font-normal text-[var(--text-primary)] m-0 mb-1.5">
                {searchQuery ? "No matching roles found" : "No resume matches yet"}
              </h3>
              <p className="text-sm font-light text-[var(--text-muted)] max-w-[320px] mx-auto mb-5 leading-relaxed">
                {searchQuery ? "Try refining your search keyword." : "Upload a LaTeX resume to automatically scan and rank matching opportunities."}
              </p>
              {!searchQuery && (
                <Link to="/resumes" className="btn-primary text-[13px]">
                  <FileText size={13} /> Upload Resume
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {filtered.map((match, idx) => {
                  const job: Job = { ...match.job, ai_score: match.match_score ?? match.job.ai_score };
                  return <JobCard key={idx} job={job} onClick={() => setSelectedJob(job)} onSave={handleSave} onApply={handleApply} />;
                })}
              </div>
              {matches.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button onClick={() => { const next = skip + limit; setSkip(next); fetchMatches(next); }} disabled={loading} className="btn-ghost text-sm py-2.5 px-6">
                    {loading ? "Loading…" : "Load more matches"}
                  </button>
                </div>
              )}
            </>
          )
      }

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onSave={handleSave} onApply={handleApply} />}
    </div>
  );
};
