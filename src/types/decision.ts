export interface Option {
  id: string;
  name: string;
  summary: string;
  color?: string;
}

export interface FactorScore {
  score: number; // 1 to 10
  rationale: string;
}

export interface CriteriaFactor {
  id: string;
  name: string;
  category: 'Financial' | 'Growth' | 'Wellbeing' | 'Risk & Feasibility' | 'Long-term Strategic' | 'Personal Alignment';
  description: string;
  scores: Record<string, FactorScore>; // key is optionId
}

export interface ProConItem {
  id: string;
  text: string;
  category?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface OptionProsCons {
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface ComparisonDimension {
  id: string;
  dimension: string;
  category: string;
  details: Record<string, { summary: string; rating: number }>; // optionId -> { summary, rating 1-10 }
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TiebreakerVerdict {
  winnerOptionId: string | 'tie';
  winnerConfidence: 'high' | 'moderate' | 'marginal_call';
  headline: string;
  verdictSummary: string;
  keyDifferentiators: string[];
  ruleOfThumbDecisionPointers: Array<{
    optionId: string;
    triggerCondition: string;
  }>;
  devilsAdvocateQuestions: string[];
  suggestedActionSteps: string[];
}

export interface DecisionRecord {
  id: string;
  title: string;
  context: string;
  createdAt: number;
  updatedAt: number;
  options: Option[];
  factors: CriteriaFactor[];
  prosCons: Record<string, OptionProsCons>; // optionId -> OptionProsCons
  comparisonDimensions: ComparisonDimension[];
  swot: Record<string, SWOTData>; // optionId -> SWOTData
  verdict: TiebreakerVerdict;
  customNotes?: string;
}

export interface AnalysisRequest {
  title: string;
  context?: string;
  options?: string[];
  priorities?: string;
}
