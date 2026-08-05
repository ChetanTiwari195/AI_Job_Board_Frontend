interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescription({ value, onChange }: JobDescriptionProps) {
  return (
    <div className="section">
      <label className="section-label">Job Description</label>
      <textarea
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
    </div>
  );
}
