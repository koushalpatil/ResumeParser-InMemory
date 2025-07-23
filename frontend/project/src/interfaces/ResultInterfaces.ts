export interface Section {
  name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface AnalysisData {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingSkills: string[];
  sections: Section[];
}

export interface LocationState {
  fileName: string;
  fileSize: number;
  analysisTime: string;
  extractedText: string;
  analysisFeedback: AnalysisData;
  success: boolean;
}
