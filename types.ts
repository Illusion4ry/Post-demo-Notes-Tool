export interface AnalysisResult {
  yearRoundEmployees: string;
  seasonalEmployees: string;
  numberOfClients: string;
  estimatedRevenue: string;
  firmIndustry: string;
  currentSoftware: string;
  decisionMaker: string;
  buyingTimeline: string;
  nextSteps: string;
  whatResonated: string;
  objections: string;
  painPoints: string;
  notes: string;
  likelihoodToClose: string;
  howTheyFoundUs: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  recommendedDate: string;
  reasoning: string;
}

export interface EmailSequenceResult {
  emails: EmailDraft[];
}

export interface EmailSettings {
  tone: 'casual' | 'formal';
  brevity: 'brief' | 'standard'; // "Brief" is ultra-short text style
  directness: 'polite' | 'direct';
  emojis: 'none' | 'minimal';
  focus: 'value' | 'relationship';
  urgency: 'patient' | 'urgent';
}

export interface RowDefinition {
  label: string;
  key: keyof AnalysisResult;
}

export const TABLE_ROWS: RowDefinition[] = [
  { label: "Number of year-round employees", key: "yearRoundEmployees" },
  { label: "Number of seasonal employees", key: "seasonalEmployees" },
  { label: "Number of clients", key: "numberOfClients" },
  { label: "Estimated revenue per year", key: "estimatedRevenue" },
  { label: "Firm Industry", key: "firmIndustry" },
  { label: "Current Software used and purpose", key: "currentSoftware" },
  { label: "Decision Maker", key: "decisionMaker" },
  { label: "Buying Timeline", key: "buyingTimeline" },
  { label: "Next Steps", key: "nextSteps" },
  { label: "What resonated with the firm", key: "whatResonated" },
  { label: "Objections", key: "objections" },
  { label: "Pain points", key: "painPoints" },
  { label: "Notes", key: "notes" },
  { label: "Likelyhood to close", key: "likelihoodToClose" },
  { label: "How they found TaxDome", key: "howTheyFoundUs" },
];