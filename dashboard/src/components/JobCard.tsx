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
  if (score >= 80) return "bg-[var(--s-success-bg)] text-[var(--s-success-text)] border-[var(--s-success-border)]";
  if (score >= 50) return "bg-[var(--s-warning-bg)] text-[var(--s-warning-text)] border-[var(--s-warning-border)]";
  return "bg-[var(--s-danger-bg)] text-[var(--s-danger-text)] border-[var(--s-danger-border)]";
};

// Small meta pill
const MetaPill: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-light text-[var(--text-muted)] max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
    <span className="shrink-0 opacity-70">{icon}</span>
    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>
  </span>
);

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onSave, onApply }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 cursor-pointer shadow-[var(--s-shadow-1)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-600/25 hover:shadow-[var(--s-shadow-2)] group"
    >
      <div>
        {/* Title + bookmark */}
        <div className="flex justify-between items-start gap-2.5 mb-2.5">
          <h3 className="text-[15px] font-normal text-[var(--text-primary)] tracking-tight leading-[1.35] m-0 line-clamp-2 transition-colors duration-150 group-hover:text-[var(--primary)]">
            {job.title}
          </h3>
          <button
            onClick={e => { e.stopPropagation(); onSave(job.id, job.saved); }}
            aria-label={job.saved ? "Remove from saved" : "Save job"}
            title={job.saved ? "Remove from saved" : "Save job"}
            className={`shrink-0 bg-transparent border-none cursor-pointer p-1 rounded-md transition-colors duration-150 -mt-0.5 -mr-1 touch-manipulation hover:bg-blue-600/10 ${job.saved ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
          >
            {job.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <MetaPill icon={<Building size={10} />}>{job.company}</MetaPill>
          {job.location && <MetaPill icon={<MapPin size={10} />}>{job.location}</MetaPill>}
          {job.source && <MetaPill icon={<Globe size={10} />}>{job.source}</MetaPill>}
        </div>

        {/* Description snippet */}
        <p className="text-[13px] font-light text-[var(--text-muted)] leading-relaxed m-0 line-clamp-3">
          {job.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          {job.ai_score != null && (
            <span className={`tnum text-[11px] font-normal py-0.5 px-2 rounded-full border ${scoreStyle(job.ai_score)}`}>
              {job.ai_score}% match
            </span>
          )}
          <span className="tnum text-[11px] font-light text-[var(--text-muted)]">
            {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onApply(job.apply_url, job.id); }}
          className="btn-primary text-xs py-1.5 px-3.5 gap-1.5 touch-manipulation"
        >
          Apply <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
};
