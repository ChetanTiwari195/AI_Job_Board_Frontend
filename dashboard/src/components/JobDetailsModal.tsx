import React, { useEffect } from 'react';
import type { Job } from '../services/api';
import { X, ExternalLink, Bookmark, BookmarkCheck, Sparkles, Building, MapPin } from 'lucide-react';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onSave: (id: number, saved: boolean) => void;
  onApply: (url: string, id: number) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onSave, onApply }) => {
  // Keyboard close + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(13,37,61,0.55)", backdropFilter: "blur(4px)", animation: "fadeUp 0.15s ease forwards" }}
      onClick={onClose}
    >
      <div
        className="animate-modal-scale"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "var(--s-shadow-2)", overflow: "hidden" }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top indigo strip */}
        <div style={{ height: 3, background: "linear-gradient(90deg, var(--primary), var(--primary-border), var(--primary))", flexShrink: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px 28px 20px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
          <div style={{ paddingRight: 16, flex: 1, minWidth: 0 }}>
            <h2 id="modal-title" style={{ fontSize: 20, fontWeight: 300, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.4px", fontFeatureSettings: '"ss01"' }}>
              {job.title}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 400, color: "var(--text-secondary)" }}>
                <Building size={13} style={{ color: "var(--text-muted)" }} /> {job.company}
              </span>
              {job.location && (
                <>
                  <span style={{ color: "var(--border-strong)" }}>·</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 300, color: "var(--text-muted)" }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                </>
              )}
              {job.source && (
                <span style={{ fontSize: 11, fontWeight: 300, padding: "2px 8px", borderRadius: 9999, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                  {job.source}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "background 0.15s ease, color 0.15s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24, overscrollBehavior: "contain" }}>
          {/* AI Summary */}
          {job.ai_summary && (
            <div style={{ background: "rgba(83,58,253,0.04)", border: "1px solid rgba(37,99,235,0.1)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 400, color: "var(--primary)", letterSpacing: "0.1px", textTransform: "uppercase", marginBottom: 10 }}>
                <Sparkles size={12} /> AI Job Insights
              </div>
              <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {job.ai_summary}
              </p>
              {job.missing_skills && job.missing_skills.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(37,99,235,0.08)" }}>
                  <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Skills to highlight:</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {job.missing_skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 300, padding: "3px 10px", borderRadius: 9999, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", letterSpacing: "0.1px", textTransform: "uppercase", marginBottom: 14 }}>Job Description</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {job.description}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)", flexShrink: 0 }}>
          <button
            onClick={() => onSave(job.id, job.saved)}
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            {job.saved ? <BookmarkCheck size={14} color="var(--primary)" /> : <Bookmark size={14} />}
            {job.saved ? "Saved" : "Save Job"}
          </button>

          <button
            onClick={() => onApply(job.apply_url, job.id)}
            className="btn-primary"
            style={{ fontSize: 14, padding: "10px 24px" }}
          >
            <ExternalLink size={14} /> Apply on {job.source || 'Website'}
          </button>
        </div>
      </div>
    </div>
  );
};
