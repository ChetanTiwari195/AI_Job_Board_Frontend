import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobMatches, saveJob, unsaveJob, applyJob } from '../services/api';
import type { MatchResponse, Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Search, Star, FileText, X } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string; actions?: React.ReactNode }> = ({ title, subtitle, badge, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)", marginBottom: 24 }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.64px", margin: 0, fontFeatureSettings: '"ss01"' }}>{title}</h1>
        {badge && <span className="pill-tag" style={{ fontSize: 11 }}>{badge}</span>}
      </div>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "4px 0 0" }}>{subtitle}</p>
    </div>
    {actions && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{actions}</div>}
  </div>
);

const SkeletonGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
    {[...Array(6)].map((_, i) => (
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

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div style={{ position: "relative", width: 240 }}>
    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Search matches…"
      style={{ width: "100%", paddingLeft: 32, paddingRight: value ? 28 : 10, height: 36, borderRadius: 9999, border: "1px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, fontWeight: 300, outline: "none", transition: "border-color 0.15s ease, box-shadow 0.15s ease" }}
      onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; e.target.style.boxShadow = "none"; }} />
    {value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}><X size={12} /></button>}
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
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Resume Matches"
        subtitle="Ranked by keyword overlap and skill alignment with your uploaded resumes"
        badge={!loading && matches.length > 0 ? `${matches.length} matched` : undefined}
        actions={<SearchInput value={searchQuery} onChange={setSearchQuery} />}
      />

      {loading && skip === 0 ? <SkeletonGrid />
        : filtered.length === 0
          ? (
            <div className="card" style={{ textAlign: "center", padding: "64px 32px", border: "1px dashed var(--border-subtle)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--primary)" }}>
                <Star size={22} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px" }}>
                {searchQuery ? "No matching roles found" : "No resume matches yet"}
              </h3>
              <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", maxWidth: 320, margin: "0 auto 20px", lineHeight: 1.6 }}>
                {searchQuery ? "Try refining your search keyword." : "Upload a LaTeX resume to automatically scan and rank matching opportunities."}
              </p>
              {!searchQuery && (
                <Link to="/resumes" className="btn-primary" style={{ fontSize: 13 }}>
                  <FileText size={13} /> Upload Resume
                </Link>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map((match, idx) => {
                  const job: Job = { ...match.job, ai_score: match.match_score ?? match.job.ai_score };
                  return <JobCard key={idx} job={job} onClick={() => setSelectedJob(job)} onSave={handleSave} onApply={handleApply} />;
                })}
              </div>
              {matches.length > 0 && (
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
                  <button onClick={() => { const next = skip + limit; setSkip(next); fetchMatches(next); }} disabled={loading} className="btn-ghost" style={{ fontSize: 14, padding: "10px 24px" }}>
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
