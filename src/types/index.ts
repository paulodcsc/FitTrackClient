export interface ATSFormatCheck {
  isATSFormat: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface CVAdaptationResult {
  adaptedCV: string;
  latexCode: string;
  changes: string[];
  highlightedSkills: string[];
}

export interface APIProvider {
  name: 'openai' | 'claude';
  apiKey: string;
  model?: string;
}

export interface CVAnalysis {
  atsCheck: ATSFormatCheck;
  adaptation?: CVAdaptationResult;
}

