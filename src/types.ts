export type CredibilityBand = "Low" | "Medium" | "High";
export type EventCategory = "Naval" | "Strike" | "Sanctions" | "Political" | "Infrastructure";
export type ImpactLevel = "Minor" | "Moderate" | "Major" | "Critical";

export interface MarketIndicator {
  price: number;
  change: number;
  change1h: number;
  change4h: number;
  isAboveNormal: boolean;
  history: number[];
}

export interface MarketData {
  oil: MarketIndicator;
  vix: MarketIndicator;
  gold: MarketIndicator;
  defense: MarketIndicator;
}

export interface HistoricalStats {
  oil1hAvg: number;
  oil4hAvg: number;
  vixAvg: number;
  etfOutperformance: number;
  sampleSize: number;
}

export interface Trigger {
  id: string;
  timestamp: string;
  label: string;
  type: "market" | "intel";
}

export interface GeoEvent {
  id: string;
  timestamp: string;
  headline: string;
  source: string;
  region: string;
  category: EventCategory;
  credibility: CredibilityBand;
  impactLevel: ImpactLevel;
  oil1hReaction: number;
  oil4hReaction: number;
  vixReaction: number;
  llmSummary: string;
  historicalStats: HistoricalStats;
  oilProbability4h: number;
  currentOilMove: number;
  status: "Unconfirmed" | "Developing" | "Confirmed";
  credibilityScore: number;
  isLocked?: boolean;
  isSignal: boolean;
  isIranInvolved: boolean;
  isMarketSensitive: boolean;
}

export interface TimelineNode {
  time: string;
  label: string;
  type: "event" | "market";
  value?: string;
}

export interface VolatilityIndex {
  value: number;
  label: "LOW" | "MODERATE" | "HIGH";
}

export type UserRole = "free" | "pro";

export interface User {
  email: string;
  role: UserRole;
}
