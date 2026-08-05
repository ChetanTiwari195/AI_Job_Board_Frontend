export interface OptimizeResponse {
  updated_tex: string;
  updated_pdf: string; // base64 encoded
  ats_score: number;
  missing_keywords: string[];
  added_skills: string[];
}

export type ProgressStep =
  | 'idle'
  | 'uploading'
  | 'extracting_keywords'
  | 'optimizing'
  | 'compiling'
  | 'done'
  | 'error';
