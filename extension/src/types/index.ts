export interface OptimizeResponse {
  updated_tex: string;
  updated_pdf: string; // base64 encoded
  ats_score: number;
  missing_keywords: string[];
  added_skills: string[];
}

export interface AnalyzeResponse {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  jd_keywords_detail: {
    required_skills: string[];
    preferred_skills: string[];
    technologies: string[];
    experience_level: string;
    key_responsibilities: string[];
  };
}

export type ProgressStep =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'extracting_keywords'
  | 'optimizing'
  | 'compiling'
  | 'done'
  | 'error';
