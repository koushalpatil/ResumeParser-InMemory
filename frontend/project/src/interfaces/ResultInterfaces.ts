export interface SkillMatch {
  skill: string;
  candidateLevel: "Expert" | "Advanced" | "Intermediate" | "Basic";
  required: "Advanced" | "Intermediate" | "Basic";
  status:
    | "Strong Match"
    | "Perfect Match"
    | "Exceeds Requirement"
    | "Meets Requirement";
}

export interface MissingSkill {
  skill: string;
  required: "Advanced" | "Intermediate" | "Basic";
  impact: "High" | "Medium" | "Low";
  workaround: string;
}

export interface PartialMatch {
  skill: string;
  jdRequirement: string;
  candidateEvidence: string;
}

export interface ResponsibilityAlignment {
  jdRequirement: string;
  resumeEvidence: string;
  matchStrength: "High" | "Medium" | "Low" | "Poor";
  improvement: string;
}

export interface JobDescriptionAlignment {
  roleType: string;
  experienceRequirement: string;
  candidateExperience: string;
  matchStatus:
    | "Exceeds requirement"
    | "Meets requirement"
    | "Below requirement";
  mustHaveSkills: {
    matched: SkillMatch[];
    missing: MissingSkill[];
  };
  preferredSkills: {
    matched: string[];
    missing: string[];
    partialMatch: PartialMatch[];
  };
  responsibilityAlignment: ResponsibilityAlignment[];
}

export interface ImprovementCategory {
  category:
    | "Missing Critical Skills"
    | "Quantification Gaps"
    | "Keyword Optimization"
    | "Experience Presentation";
  priority: "High" | "Medium" | "Low";
  items: string[];
}

export interface MissingSkillDetail {
  skill: string;
  jdImportance: "Required" | "Preferred" | "Nice to have";
  frequency: string;
  suggestion: string;
  alternativeWording: string;
  impact: "High" | "Medium" | "Low";
}

export interface KeywordMatchDetail {
  keyword: string;
  jdFrequency: number;
  resumeFrequency?: number;
  context?: "Strong match" | "Good match" | "Adequate match" | "Minimal match";
  criticality?: "High" | "Medium" | "Low";
  suggestion?: string;
}

export interface KeywordMatch {
  matchedKeywords: KeywordMatchDetail[];
  missingKeywords: KeywordMatchDetail[];
  keywordDensity: string;
  recommendedDensity: string;
  improvementNeeded: string;
}

export interface JobRequirement {
  required: string;
  candidate: string;
  status: string;
  note?: string;
  improvement?: string;
}

export interface SpecificJobRequirements {
  education: JobRequirement;
  experience: JobRequirement;
  technicalLeadership: JobRequirement;
  industryExperience: JobRequirement;
}

export interface Section {
  name: string;
  score: number;
  jdAlignment: number;
  feedback: string;
  jdSpecificIssues: string[];
  suggestions: string[];
}

export interface RecommendedChanges {
  immediate: string[];
  phase2: string[];
  phase3: string[];
}

export interface ATSOptimization {
  currentKeywordScore: string;
  targetKeywordScore: string;
  missingCriticalTerms: string[];
  overusedTerms: string[];
  recommendations: string;
}

export interface AnalysisData {
  overallScore: number;
  jobMatchScore?: number;
  summary: string;
  jobDescriptionAlignment?: JobDescriptionAlignment;
  strengths: string[];
  improvements: ImprovementCategory[];
  missingSkills: MissingSkillDetail[];
  keywordMatch?: KeywordMatch;
  specificJobRequirements?: SpecificJobRequirements;
  sections: Section[];
  recommendedChanges?: RecommendedChanges;
  atsOptimization?: ATSOptimization;
}

export interface LocationState {
  fileName: string;
  fileSize: number;
  analysisTime?: string;
  analysisFeedback: AnalysisData;
  success: boolean;
}
