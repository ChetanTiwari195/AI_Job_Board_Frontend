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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d253d]/55 backdrop-blur-[4px] animate-[fadeUp_0.15s_ease_forwards]"
      onClick={onClose}
    >
      <div
        className="animate-modal-scale bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-[680px] max-h-[88vh] flex flex-col shadow-[var(--s-shadow-2)] overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top indigo strip */}
        <div className="h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--primary-border)] to-[var(--primary)] shrink-0" />

        {/* Header */}
        <div className="flex justify-between items-start pt-6 px-7 pb-5 border-b border-[var(--border-subtle)] shrink-0">
          <div className="pr-4 flex-1 min-w-0">
            <h2 id="modal-title" className="text-[20px] font-light text-[var(--text-primary)] m-0 mb-2 tracking-tight [font-feature-settings:'ss01']">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-normal text-[var(--text-secondary)]">
                <Building size={13} className="text-[var(--text-muted)]" /> {job.company}
              </span>
              {job.location && (
                <>
                  <span className="text-[var(--border-strong)]">·</span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-light text-[var(--text-muted)]">
                    <MapPin size={12} /> {job.location}
                  </span>
                </>
              )}
              {job.source && (
                <span className="text-[11px] font-light py-0.5 px-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  {job.source}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-center text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-6 px-7 flex flex-col gap-6 overscroll-contain">
          {/* AI Summary */}
          {job.ai_summary && (
            <div className="bg-indigo-600/5 border border-blue-600/10 rounded-xl py-4 px-5">
              <div className="flex items-center gap-1.5 text-[11px] font-normal text-[var(--primary)] tracking-wide uppercase mb-2.5">
                <Sparkles size={12} /> AI Job Insights
              </div>
              <p className="text-sm font-light text-[var(--text-secondary)] leading-relaxed m-0">
                {job.ai_summary}
              </p>
              {job.missing_skills && job.missing_skills.length > 0 && (
                <div className="mt-3.5 pt-3.5 border-t border-blue-600/10">
                  <span className="text-[11px] font-normal text-[var(--text-muted)] block mb-2">Skills to highlight:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.missing_skills.map((skill, i) => (
                      <span key={i} className="text-xs font-light py-1 px-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
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
            <div className="text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-3.5">Job Description</div>
            <div className="text-sm font-light text-[var(--text-secondary)] leading-[1.8] whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center py-4 px-7 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
          <button
            onClick={() => onSave(job.id, job.saved)}
            className="btn-ghost text-[13px]"
          >
            {job.saved ? <BookmarkCheck size={14} className="text-[var(--primary)]" /> : <Bookmark size={14} />}
            {job.saved ? "Saved" : "Save Job"}
          </button>

          <button
            onClick={() => onApply(job.apply_url, job.id)}
            className="btn-primary text-sm py-2.5 px-6"
          >
            <ExternalLink size={14} /> Apply on {job.source || 'Website'}
          </button>
        </div>
      </div>
    </div>
  );
};
