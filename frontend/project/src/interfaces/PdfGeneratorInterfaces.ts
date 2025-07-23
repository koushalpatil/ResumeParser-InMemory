export interface AnalysisData {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingSkills: string[];
  sections: {
    name: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
}

export interface FileData {
  fileName: string;
  fileSize: number;
  analysisTime?: string;
}
