import React from 'react';
import type { Job } from '../services/api';
import { ExternalLink, Bookmark, BookmarkCheck, MapPin, Building, Globe } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onSave: (id: number, saved: boolean) => void;
  onApply: (url: string, id: number) => void;
}

// Score band → colors
const scoreStyle = (score: number) => {
  if (score >= 80) return { bg: "var(--s-success-bg)", text: "var(--s-success-text)", border: "var(--s-success-border)" };
  if (score >= 50) return { bg: "var(--s-warning-bg)", text: "var(--s-warning-text)", border: "var(--s-warning-border)" };
  return { bg: "var(--s-danger-bg)", text: "var(--s-danger-text)", border: "var(--s-danger-border)" };
};

// Small meta pill
const MetaPill: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 9999, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", fontSize: 11, fontWeight: 300, color: "var(--text-muted)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
    <span style={{ flexShrink: 0, opacity: 0.7 }}>{icon}</span>
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
  </span>
);

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onSave, onApply }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "rgba(37,99,235,0.25)" : "var(--border-subtle)"}`,
        borderRadius: 12, padding: 20, cursor: "pointer",
        boxShadow: hovered ? "var(--s-shadow-2)" : "var(--s-shadow-1)",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "border-color 0.15s ease, box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <div>
        {/* Title + bookmark */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 400, color: hovered ? "var(--primary)" : "var(--text-primary)", letterSpacing: "-0.2px", lineHeight: 1.35, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.15s ease" }}>
            {job.title}
          </h3>
          <button
            onClick={e => { e.stopPropagation(); onSave(job.id, job.saved); }}
            aria-label={job.saved ? "Remove from saved" : "Save job"}
            title={job.saved ? "Remove from saved" : "Save job"}
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: job.saved ? "var(--primary)" : "var(--text-muted)", transition: "color 0.15s ease, background 0.15s ease", marginTop: -2, marginRight: -4, touchAction: "manipulation" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.06)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            {job.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Meta pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          <MetaPill icon={<Building size={10} />}>{job.company}</MetaPill>
          {job.location && <MetaPill icon={<MapPin size={10} />}>{job.location}</MetaPill>}
          {job.source && <MetaPill icon={<Globe size={10} />}>{job.source}</MetaPill>}
        </div>

        {/* Description snippet */}
        <p style={{ fontSize: 13, fontWeight: 300, color: "var(--text-muted)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {job.description}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {job.ai_score != null && (() => {
            const s = scoreStyle(job.ai_score!);
            return (
              <span className="tnum" style={{ fontSize: 11, fontWeight: 400, padding: "2px 8px", borderRadius: 9999, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                {job.ai_score}% match
              </span>
            );
          })()}
          <span className="tnum" style={{ fontSize: 11, fontWeight: 300, color: "var(--text-muted)" }}>
            {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onApply(job.apply_url, job.id); }}
          className="btn-primary"
          style={{ fontSize: 12, padding: "6px 14px", gap: 5, touchAction: "manipulation" }}
        >
          Apply <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
};
