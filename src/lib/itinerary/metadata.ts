import type { Destination, DestinationTheme } from "../../data/destinations";
import type { InterestId } from "./types";

export const INTEREST_LABELS: Record<InterestId, string> = {
  coast: "Coastal",
  history: "History",
  nature: "Nature",
  culture: "Culture",
  desert: "Desert",
  family: "Family-friendly",
  food: "Food",
  troglodyte: "Berber cave architecture",
  photography: "Photography",
  eclipseViewing: "Eclipse viewing",
};

export const DESTINATION_THEME_LABELS: Record<DestinationTheme, string> = {
  coast: "Coastal",
  history: "Historical",
  culture: "Cultural",
  nature: "Nature",
  desert: "Desert",
  food: "Food",
  troglodyte: "Berber caves",
  photography: "Photography",
  family: "Family-friendly",
};

const INTEREST_ALIASES: Record<string, InterestId> = {
  coast: "coast",
  coastal: "coast",
  sea: "coast",
  seaside: "coast",
  beach: "coast",
  beaches: "coast",
  island: "coast",
  islands: "coast",
  mediterranean: "coast",
  history: "history",
  historical: "history",
  historic: "history",
  ruins: "history",
  roman: "history",
  archaeology: "history",
  antiquities: "history",
  antiquity: "history",
  nature: "nature",
  natural: "nature",
  landscape: "nature",
  landscapes: "nature",
  oasis: "nature",
  oases: "nature",
  culture: "culture",
  cultural: "culture",
  unesco: "culture",
  medina: "culture",
  medinas: "culture",
  religion: "culture",
  spiritual: "culture",
  desert: "desert",
  sahara: "desert",
  dunes: "desert",
  salt: "desert",
  "salt-flats": "desert",
  family: "family",
  "family-friendly": "family",
  kids: "family",
  children: "family",
  food: "food",
  cuisine: "food",
  gastronomy: "food",
  dates: "food",
  troglodyte: "troglodyte",
  troglodytes: "troglodyte",
  berber: "troglodyte",
  cave: "troglodyte",
  caves: "troglodyte",
  photography: "photography",
  photo: "photography",
  astrophotography: "photography",
  totality: "eclipseViewing",
  total: "eclipseViewing",
  eclipse: "eclipseViewing",
  solar: "eclipseViewing",
  astronomy: "eclipseViewing",
  "solar-optics": "eclipseViewing",
  filters: "eclipseViewing",
  "dark-sky": "eclipseViewing",
  stargazing: "eclipseViewing",
};

const DESTINATION_THEMES: DestinationTheme[] = [
  "coast",
  "history",
  "culture",
  "nature",
  "desert",
  "food",
  "troglodyte",
  "photography",
  "family",
];

export function isDestinationTheme(value: string): value is DestinationTheme {
  return (DESTINATION_THEMES as string[]).includes(value);
}

export function normalizeInterests(rawInterests: string[]): {
  normalized: InterestId[];
  unsupported: string[];
} {
  const normalized: InterestId[] = [];
  const unsupported: string[] = [];

  for (const raw of rawInterests) {
    if (typeof raw !== "string") continue;
    const key = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!key) continue;

    const mapped = INTEREST_ALIASES[key];
    if (!mapped) {
      unsupported.push(raw);
      continue;
    }
    if (!normalized.includes(mapped)) normalized.push(mapped);
  }

  return { normalized, unsupported };
}

export function isFamilyFriendly(destination: Destination): boolean {
  const facilities = destination.facilities.join(" ").toLowerCase();
  const hasBed = /hotel|guesthouse|riad/.test(facilities);
  const hasFood = /restaurant|café|cafe/.test(facilities);
  const hasMedical = /medical|pharmacy|hospital/.test(facilities);
  return hasBed && hasFood && hasMedical;
}

export function matchesTheme(
  destination: Destination,
  theme: DestinationTheme,
): boolean {
  if (theme === "family") return isFamilyFriendly(destination);
  return destination.themes.includes(theme);
}
