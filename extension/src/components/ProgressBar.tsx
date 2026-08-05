import { ProgressStep } from '../types';

interface ProgressBarProps {
  step: ProgressStep;
}

const STEPS: { key: ProgressStep; label: string }[] = [
  { key: 'uploading', label: 'Reading Resume...' },
  { key: 'extracting_keywords', label: 'Extracting Keywords...' },
  { key: 'optimizing', label: 'Optimizing Resume...' },
  { key: 'compiling', label: 'Generating PDF...' },
  { key: 'done', label: 'Done!' },
];

export function ProgressBar({ step }: ProgressBarProps) {
  if (step === 'idle') return null;

  const currentIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="progress-bar">
      {STEPS.map((s, i) => {
        let status: 'pending' | 'active' | 'complete' = 'pending';
        if (i < currentIndex) status = 'complete';
        else if (i === currentIndex) status = step === 'done' ? 'complete' : 'active';

        return (
          <div key={s.key} className={`progress-step ${status}`}>
            <div className="step-indicator">
              {status === 'complete' ? (
                <span className="checkmark">✓</span>
              ) : status === 'active' ? (
                <span className="spinner" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
