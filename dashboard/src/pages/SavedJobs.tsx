import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSavedJobs, saveJob, unsaveJob, applyJob } from '../services/api';
import type { Job } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Bookmark, LayoutDashboard } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string; badge?: string }> = ({ title, subtitle, badge }) => (
  <div style={{ paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)", marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <h1 style={{ fontSize: 26, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.64px", margin: 0, fontFeatureSettings: '"ss01"' }}>{title}</h1>
      {badge && <span className="pill-tag" style={{ fontSize: 11 }}>{badge}</span>}
    </div>
    <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "4px 0 0" }}>{subtitle}</p>
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
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Saved Jobs"
        subtitle="Review and manage your shortlisted opportunities"
        badge={!loading && jobs.length > 0 ? `${jobs.length} bookmarked` : undefined}
      />

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton-shimmer" style={{ height: 18, borderRadius: 6, width: "70%" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <div className="skeleton-shimmer" style={{ height: 14, borderRadius: 9999, width: 72 }} />
                <div className="skeleton-shimmer" style={{ height: 14, borderRadius: 9999, width: 56 }} />
              </div>
              <div className="skeleton-shimmer" style={{ height: 12, borderRadius: 4, width: "100%" }} />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 32px", border: "1px dashed var(--border-subtle)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--primary)" }}>
            <Bookmark size={22} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px" }}>No saved jobs yet</h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", maxWidth: 300, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Bookmark interesting listings in your job feed to review them later.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ fontSize: 13 }}>
            <LayoutDashboard size={13} /> Browse Job Feed
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} onSave={handleSave} onApply={handleApply} />
          ))}
        </div>
      )}

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onSave={handleSave} onApply={handleApply} />}
    </div>
  );
};
