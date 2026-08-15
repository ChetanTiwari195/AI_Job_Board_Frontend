import { Check } from 'lucide-react';
import { ProgressStep } from '../types';

interface ProgressBarProps {
  step: ProgressStep;
}

const STEPS: { key: ProgressStep; label: string }[] = [
  { key: 'uploading', label: 'Reading Resume...' },
  { key: 'analyzing', label: 'Analyzing Keywords...' },
  { key: 'extracting_keywords', label: 'Extracting Keywords...' },
  { key: 'optimizing', label: 'Optimizing Resume...' },
  { key: 'compiling', label: 'Generating PDF...' },
  { key: 'done', label: 'Done!' },
];

export function ProgressBar({ step }: ProgressBarProps) {
  if (step === 'idle') return null;

  // For the analyze-only flow, show only analyzing + done
  const isAnalyzeFlow = step === 'analyzing';
  const visibleSteps = isAnalyzeFlow
    ? STEPS.filter((s) => s.key === 'analyzing' || s.key === 'done')
    : STEPS.filter((s) => s.key !== 'analyzing');

  const currentIndex = visibleSteps.findIndex((s) => s.key === step);

  return (
    <div className="progress-bar">
      {visibleSteps.map((s, i) => {
        let status: 'pending' | 'active' | 'complete' = 'pending';
        if (i < currentIndex) status = 'complete';
        else if (i === currentIndex) status = step === 'done' ? 'complete' : 'active';

        return (
          <div key={s.key} className={`progress-step ${status}`}>
            <div className="step-indicator">
              {status === 'complete' ? (
                <span className="checkmark"><Check size={14} className='inline' /></span>
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
