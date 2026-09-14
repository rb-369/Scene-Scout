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
  image?: string;
  cameraPackage?: string;
  
  // Real coordinates & Google Maps integration
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
  googleEarthUrl?: string;
  
  // Specific evidence quotes linked to sources
  evidenceQuotes: {
    claim: string;
    sourceTitle: string;
    sourceUrl: string;
  }[];
}

export interface StudioCandidate {
  id: string;
  name: string;
  city: string;
  country: string;
  stageType: string; // e.g. 'Virtual Production LED Volume', 'Mythological Battlefield Backlot', 'Underwater Stage'
  bestForGenres: string[]; // e.g. ['Futuristic Sci-Fi', 'Alien Planet', 'Mythological Warfare']
  description: string;
  whyStudioRecommended: string;
  dimensions: string; // e.g. '35,000 sq ft · 45ft clear height'
  capabilities: string[];
  notableProductions: string[];
  estimatedTariff: string;
  contactDetails: ContactDetails;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  googleEarthUrl?: string;
  image?: string;
  soundRating?: string;
  powerCapacity?: string;
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
  isStudioRecommended?: boolean;
  studioSuitabilityReason?: string;
  studioRecommendations?: StudioCandidate[];
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

