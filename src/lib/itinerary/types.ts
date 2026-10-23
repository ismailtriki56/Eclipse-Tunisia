import type { Destination, DestinationTheme } from "../../data/destinations";

export type EclipsePreference = "totality" | "partial" | "flexible";

export type InterestId =
  | "coast"
  | "history"
  | "nature"
  | "culture"
  | "desert"
  | "family"
  | "food"
  | "troglodyte"
  | "photography"
  | "eclipseViewing";

export interface ItineraryPreferences {
  startDate: string;
  endDate: string;
  eclipsePreference: EclipsePreference;
  pace: string;
  budget: string;
  groupSize: number;
  interests: string[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "destination" | "experience" | "custom";
  referenceSlug?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  destinationSlug: string;
  isEclipseDay?: boolean;
  activities: Activity[];
}

export interface ItineraryPlan {
  tripTitle: string;
  summary: string;
  eclipseDayNotes: string;
  days: ItineraryDay[];
}

export interface RecommendationWarning {
  code: string;
  message: string;
}

export interface LineupEntry {
  date: string;
  destination: Destination;
  themes: DestinationTheme[];
  matchedInterests: InterestId[];
  isEclipseDay: boolean;
  isAlternative: boolean;
  isRepeat: boolean;
}

export interface RecommendationResult {
  dates: string[];
  eclipseIndex: number;
  requestedInterests: string[];
  normalizedInterests: InterestId[];
  themeInterests: DestinationTheme[];
  lineup: LineupEntry[];
  warnings: RecommendationWarning[];
  themeBalance: Record<string, number>;
  alternativeDays: number;
}

export interface GenerationOutcome {
  plan: ItineraryPlan;
  generationMethod: "gemini" | "local";
  isFallback: boolean;
  modelUsed: string | null;
  notice: string;
  warnings: string[];
}
