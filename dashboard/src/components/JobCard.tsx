import React from "react";
import type { Job } from "../services/api";
import {
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building,
  Globe,
} from "lucide-react";
import { Button, Badge, Pill } from "./ui";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onSave: (id: number, saved: boolean) => void;
  onApply: (url: string, id: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  onSave,
  onApply,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 dark:hover:border-blue-500/40 rounded-xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-slate-900/40 transition-all duration-200 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header with Title & Bookmark */}
        <div className="flex justify-between items-start gap-3 mb-2.5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(job.id, job.saved);
            }}
            title={job.saved ? "Remove from saved" : "Save job"}
            className="p-1.5 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
          >
            {job.saved ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Metadata Pills */}
        <div className="flex flex-wrap gap-2 mb-3.5">
          <Pill icon={<Building className="w-3.5 h-3.5" />}>{job.company}</Pill>
          <Pill icon={<MapPin className="w-3.5 h-3.5" />}>{job.location}</Pill>
          {job.source && (
            <Pill icon={<Globe className="w-3.5 h-3.5" />}>{job.source}</Pill>
          )}
        </div>

        {/* Job Description Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
        <div className="flex items-center gap-2">
          {job.ai_score !== undefined && job.ai_score !== null && (
            <Badge variant="score" score={job.ai_score} />
          )}
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {new Date(job.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onApply(job.apply_url, job.id);
          }}
          icon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
