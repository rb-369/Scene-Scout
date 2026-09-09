export type TrustStatus = 
  | 'VERIFIED BY SOURCES'
  | 'PUBLIC INFORMATION FOUND'
  | 'REQUIRES CONFIRMATION'
  | 'UNKNOWN';

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type QualityLevel = 'High' | 'Medium' | 'Low';

export interface LocationSource {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  relevance: string;
}

export interface ContactDetails {
  phone?: string;
  email?: string;
  officeDesk?: string;
  notes?: string;
}

export interface ProductionConsiderations {
  accessibility: string;
  parking: string;
  operatingEnvironment: string;
  ownershipStatus: string; // 'Public' | 'Private' | 'Port Trust' | 'Unspecified'
  potentialRestrictions: string[];
  contactInformation?: string;
  powerAvailability?: string;
  noiseProfile?: string;
}

export interface LocationCandidate {
  id: string;
  name: string;
  area: string;
  city: string;
  description: string;
  
  // Transparent 0-100 scores
  sceneMatchScore: number;
  accessibilityScore: number;
  productionRiskScore: number; // 0-100, higher means more risk
  evidenceQualityScore: number;
  overallScore: number;

  visualCharacteristics: string[];
  productionConsiderations: ProductionConsiderations;
  potentialRestrictions: string[];
  contactInformation: string;
  estimatedTariff?: string;
  contactDetails?: ContactDetails;
  sources: LocationSource[];
  recommendation: string;
  confidence: number; // 0-100
  trustStatus: TrustStatus;
  
  // Specific evidence quotes linked to sources
  evidenceQuotes: {
    claim: string;
    sourceTitle: string;
    sourceUrl: string;
  }[];
}

export interface ScoutCriteria {
  city: string;
  sceneType: string;
  budgetSensitivity: 'Low' | 'Moderate' | 'High';
  budgetRange?: string;
  maxDistanceKm: number;
  priorities: {
    sceneMatch: number; // weight percentage (e.g. 40)
    accessibility: number; // e.g. 20
    evidenceQuality: number; // e.g. 20
    productionRisk: number; // e.g. 20 (penalty)
  };
}

export interface AgentActivityStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp: string;
  toolUsed?: string;
}

export interface ResearchSession {
  id: string;
  userBrief: string;
  criteria: ScoutCriteria;
  candidates: LocationCandidate[];
  activity: AgentActivityStep[];
  sourcesConsultedCount: number;
  candidatesFoundCount: number;
  shortlistedCount: number;
  mode: 'live' | 'demo';
  summary: string;
  createdAt: string;
}

export interface FollowUpMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionTaken?: string;
  reRankedCandidates?: LocationCandidate[];
  sourcesUsed?: LocationSource[];
}

export interface CompareAnalysis {
  locationIds: string[];
  recommendationVerdict: string;
  comparisonPoints: {
    dimension: string;
    notes: Record<string, string>; // locationId -> evaluation note
  }[];
}
