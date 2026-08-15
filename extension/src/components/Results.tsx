import { AlertTriangle, FileText } from 'lucide-react';
import { OptimizeResponse } from "../types";

interface ResultsProps {
  result: OptimizeResponse;
}

export function Results({ result }: ResultsProps) {
  const downloadTex = () => {
    const blob = new Blob([result.updated_tex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_resume.tex";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const binary = atob(result.updated_pdf);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const scoreColor =
    result.ats_score >= 80
      ? "#22c55e"
      : result.ats_score >= 60
        ? "#eab308"
        : "#ef4444";

  return (
    <div className="results">
      <div className="ats-score">
        <h3>ATS Score</h3>
        <div className="score" style={{ color: scoreColor }}>
          {result.ats_score}
        </div>
      </div>

      {result.missing_keywords.length > 0 && (
        <div className="keyword-section">
          <h3>Missing Keywords</h3>
          <p className="muted">
            These JD keywords couldn't be naturally incorporated:
          </p>
          <div className="keyword-list">
            {result.missing_keywords.map((kw) => (
              <span key={kw} className="keyword missing">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.added_skills.length > 0 && (
        <div className="keyword-section">
          <h3><AlertTriangle size={18} className='inline mr-2' /> Skills Added</h3>
          <p className="muted">Verify you're comfortable claiming these:</p>
          <div className="keyword-list">
            {result.added_skills.map((skill) => (
              <span key={skill} className="keyword added">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="downloads">
        <h3>Downloads</h3>
        <div className="download-buttons">
          <button className="btn-download" onClick={downloadTex}>
            <FileText size={16} className='inline mr-1' /> Download .tex
          </button>
          <button className="btn-download" onClick={downloadPdf}>
            <FileText size={16} className='inline mr-1' /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
