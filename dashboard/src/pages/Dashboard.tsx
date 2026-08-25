import React, { useEffect, useState } from 'react';
import { getJobs, saveJob, unsaveJob, applyJob, refreshJobs } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { RefreshCw, Search, Briefcase, X } from 'lucide-react';

// ── Stripe-style page header ───────────────────────────────────────────────
const PageHeader: React.FC<{
  title: string; subtitle: string; badge?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, badge, actions }) => (
  <div className="flex flex-col gap-1 pb-5 border-b border-[var(--border-subtle)] mb-6">
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[26px] font-light text-[var(--text-primary)] tracking-tight m-0 [font-feature-settings:'ss01']">{title}</h1>
          {badge && <span className="pill-tag text-[11px]">{badge}</span>}
        </div>
        <p className="text-sm font-light text-[var(--text-muted)] mt-1 mb-0">{subtitle}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </div>
);

// ── Skeleton grid ──────────────────────────────────────────────────────────
const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
    {[...Array(count)].map((_, i) => (
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

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState: React.FC<{
  icon: React.ReactNode; title: string; body: string; action?: React.ReactNode;
}> = ({ icon, title, body, action }) => (
  <div className="card text-center py-16 px-8 border border-dashed border-[var(--border-subtle)]">
    <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
      {icon}
    </div>
    <h3 className="text-base font-normal text-[var(--text-primary)] m-0 mb-1.5 [font-feature-settings:'ss01']">{title}</h3>
    <p className="text-sm font-light text-[var(--text-muted)] max-w-xs mx-auto mb-5 leading-relaxed">{body}</p>
    {action}
  </div>
);

// ── Search input ───────────────────────────────────────────────────────────
const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = "Filter jobs…" }) => (
  <div className="relative w-60">
    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full pl-8 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] text-[13px] font-light outline-none transition-all duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] ${value ? 'pr-7' : 'pr-2.5'}`}
    />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text-muted)] p-0.5">
        <X size={12} />
      </button>
    )}
  </div>
);

// ── Dashboard page ─────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async () => {
    try { setLoading(true); setJobs(await getJobs()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async (id: number, saved: boolean) => {
    try {
      saved ? await unsaveJob(id) : await saveJob(id);
      setJobs(j => j.map(x => x.id === id ? { ...x, saved: !saved } : x));
      if (selectedJob?.id === id) setSelectedJob(s => s && { ...s, saved: !saved });
    } catch (e) { console.error(e); }
  };

  const handleApply = async (url: string, id: number) => {
    try { await applyJob(id); window.open(url, '_blank'); }
    catch (e) { console.error(e); }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshJobs();
      setTimeout(() => { fetchJobs(); setRefreshing(false); }, 4000);
    } catch (e) { console.error(e); setRefreshing(false); }
  };

  const filtered = jobs.filter(j =>
    [j.title, j.company, j.location ?? ""].some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-7 px-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Job Feed"
        subtitle="Curated roles matched to your target profile"
        badge={loading ? undefined : `${jobs.length} total`}
        actions={
          <>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Filter by title, company…" />
            <button onClick={handleRefresh} disabled={refreshing} className="btn-ghost h-9 gap-1.5 text-[13px]">
              <RefreshCw size={13} className={refreshing ? "animate-spin text-blue-600" : ""} />
              {refreshing ? "Fetching…" : "Refresh"}
            </button>
          </>
        }
      />

      {loading ? <SkeletonGrid />
        : filtered.length === 0
          ? <EmptyState icon={<Briefcase size={22} />}
              title={searchQuery ? "No matching jobs" : "No jobs in feed"}
              body={searchQuery ? "Try different keywords or clear the filter." : "Click Refresh to scan your configured job boards."}
              action={searchQuery
                ? <button onClick={() => setSearchQuery('')} className="btn-secondary text-[13px]">Clear filter</button>
                : <button onClick={handleRefresh} className="btn-primary text-[13px]">Refresh Sources</button>
              }
            />
          : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
              {filtered.map(job => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} onSave={handleSave} onApply={handleApply} />
              ))}
            </div>
          )
      }

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onSave={handleSave} onApply={handleApply} />
      )}
    </div>
  );
};
