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
  <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)", marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 26, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.64px", margin: 0, fontFeatureSettings: '"ss01"' }}>{title}</h1>
          {badge && <span className="pill-tag" style={{ fontSize: 11 }}>{badge}</span>}
        </div>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "4px 0 0" }}>{subtitle}</p>
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{actions}</div>}
    </div>
  </div>
);

// ── Skeleton grid ──────────────────────────────────────────────────────────
const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton-shimmer" style={{ height: 18, borderRadius: 6, width: "70%" }} />
          <div className="skeleton-shimmer" style={{ height: 18, width: 18, borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="skeleton-shimmer" style={{ height: 14, borderRadius: 9999, width: 72 }} />
          <div className="skeleton-shimmer" style={{ height: 14, borderRadius: 9999, width: 56 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="skeleton-shimmer" style={{ height: 12, borderRadius: 4, width: "100%" }} />
          <div className="skeleton-shimmer" style={{ height: 12, borderRadius: 4, width: "83%" }} />
        </div>
      </div>
    ))}
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState: React.FC<{
  icon: React.ReactNode; title: string; body: string; action?: React.ReactNode;
}> = ({ icon, title, body, action }) => (
  <div className="card" style={{ textAlign: "center", padding: "64px 32px", border: "1px dashed var(--border-subtle)" }}>
    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--primary)" }}>
      {icon}
    </div>
    <h3 style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px", fontFeatureSettings: '"ss01"' }}>{title}</h3>
    <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", maxWidth: 320, margin: "0 auto 20px", lineHeight: 1.6 }}>{body}</p>
    {action}
  </div>
);

// ── Search input ───────────────────────────────────────────────────────────
const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = "Filter jobs…" }) => (
  <div style={{ position: "relative", width: 240 }}>
    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", paddingLeft: 32, paddingRight: value ? 28 : 10, height: 36, borderRadius: 9999, border: "1px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, fontWeight: 300, outline: "none", transition: "border-color 0.15s ease, box-shadow 0.15s ease" }}
      onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; e.target.style.boxShadow = "none"; }}
    />
    {value && (
      <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
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
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Job Feed"
        subtitle="Curated roles matched to your target profile"
        badge={loading ? undefined : `${jobs.length} total`}
        actions={
          <>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Filter by title, company…" />
            <button onClick={handleRefresh} disabled={refreshing} className="btn-ghost" style={{ height: 36, gap: 6, fontSize: 13 }}>
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} style={{ color: refreshing ? "var(--primary)" : undefined }} />
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
                ? <button onClick={() => setSearchQuery('')} className="btn-secondary" style={{ fontSize: 13 }}>Clear filter</button>
                : <button onClick={handleRefresh} className="btn-primary" style={{ fontSize: 13 }}>Refresh Sources</button>
              }
            />
          : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
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
