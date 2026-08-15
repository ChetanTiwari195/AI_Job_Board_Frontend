import { Check, X, Sparkles } from 'lucide-react';
import { AnalyzeResponse } from "../types";

interface KeywordSelectorProps {
  analysis: AnalyzeResponse;
  selectedKeywords: Set<string>;
  onToggleKeyword: (keyword: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function KeywordSelector({
  analysis,
  selectedKeywords,
  onToggleKeyword,
  onSelectAll,
  onDeselectAll,
}: KeywordSelectorProps) {
  const scoreColor =
    analysis.ats_score >= 80
      ? "#22c55e"
      : analysis.ats_score >= 60
        ? "#eab308"
        : "#ef4444";

  const allSelected =
    analysis.missing_keywords.length > 0 &&
    analysis.missing_keywords.every((kw) => selectedKeywords.has(kw));

  return (
    <div className="keyword-selector">
      {/* ATS Score */}
      <div className="ats-score">
        <h3>Current ATS Score</h3>
        <div className="score" style={{ color: scoreColor }}>
          {analysis.ats_score}
        </div>
      </div>

      {/* Matched Keywords */}
      {analysis.matched_keywords.length > 0 && (
        <div className="keyword-section">
          <h3><Check size={18} className='inline mr-2' /> Matched Keywords</h3>
          <p className="muted">Already present in your resume</p>
          <div className="keyword-list">
            {analysis.matched_keywords.map((kw) => (
              <span key={kw} className="keyword matched">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {analysis.missing_keywords.length > 0 && (
        <div className="keyword-section">
          <div className="keyword-section-header">
            <h3><X size={18} className='inline mr-2' /> Missing Keywords</h3>
            <button
              className="btn-select-toggle"
              onClick={allSelected ? onDeselectAll : onSelectAll}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <p className="muted">
            Click to select keywords to add to your resume
          </p>
          <div className="keyword-list">
            {analysis.missing_keywords.map((kw) => (
              <button
                key={kw}
                className={`keyword selectable ${selectedKeywords.has(kw) ? "selected" : ""}`}
                onClick={() => onToggleKeyword(kw)}
              >
                {selectedKeywords.has(kw) && (
                  <span className="kw-check"><Check size={14} className='inline' /></span>
                )}
                {kw}
              </button>
            ))}
          </div>
          <p className="selection-count">
            {selectedKeywords.size} of {analysis.missing_keywords.length}{" "}
            missing keywords selected
          </p>
        </div>
      )}

      {analysis.missing_keywords.length === 0 && (
        <div className="keyword-section">
          <p className="success">
            <Sparkles size={18} className='inline mr-2' /> Your resume already contains all JD keywords!
          </p>
        </div>
      )}
    </div>
  );
}
