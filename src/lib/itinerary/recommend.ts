import {
  destinations,
  type Destination,
  type DestinationTheme,
} from "../../data/destinations";
import {
  circumstancesFor,
  type DestinationCircumstances,
} from "../eclipse/destinations";
import { ECLIPSE_DATE, getDatesInRange } from "./dates";
import {
  INTEREST_LABELS,
  isDestinationTheme,
  isFamilyFriendly,
  matchesTheme,
  normalizeInterests,
} from "./metadata";
import type {
  EclipsePreference,
  InterestId,
  ItineraryPreferences,
  LineupEntry,
  RecommendationResult,
  RecommendationWarning,
} from "./types";

const TUNIS = { latitude: 36.8065, longitude: 10.1815 };

interface Candidate {
  destination: Destination;
  circumstances: DestinationCircumstances;
  matchedThemes: DestinationTheme[];
  eclipseEligible: boolean;
  familyFriendly: boolean;
}

function isEclipsePreference(value: string): value is EclipsePreference {
  return value === "totality" || value === "partial" || value === "flexible";
}

export function withDefaultPreferences(
  input: Partial<ItineraryPreferences>,
): ItineraryPreferences {
  return {
    startDate: input.startDate || "2027-07-31",
    endDate: input.endDate || "2027-08-04",
    eclipsePreference: isEclipsePreference(input.eclipsePreference ?? "")
      ? (input.eclipsePreference as EclipsePreference)
      : "totality",
    pace: input.pace || "moderate",
    budget: input.budget || "moderate",
    groupSize: Number(input.groupSize) > 0 ? Number(input.groupSize) : 2,
    interests: Array.isArray(input.interests) ? input.interests : [],
  };
}

function distanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const radius = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(b.latitude - a.latitude);
  const deltaLongitude = toRadians(b.longitude - a.longitude);
  const latitudeA = toRadians(a.latitude);
  const latitudeB = toRadians(b.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * radius * Math.asin(Math.sqrt(haversine));
}

export function matchesEclipsePreference(
  circumstances: DestinationCircumstances,
  preference: EclipsePreference,
): boolean {
  if (preference === "totality") return circumstances.visibility === "total";
  if (preference === "partial") return circumstances.visibility === "partial";
  return circumstances.visibility !== "none";
}

function eclipseQuality(circumstances: DestinationCircumstances): number {
  if (circumstances.visibility === "total") {
    return 100 + (circumstances.centralDurationSeconds ?? 0) / 8;
  }
  if (circumstances.visibility === "partial") {
    return 45 + circumstances.obscuration * 25;
  }
  return 0;
}

function budgetScore(destination: Destination, budget: string): number {
  const facilities = destination.facilities.join(" ").toLowerCase();
  const hasHotels = /hotel|riad/.test(facilities);
  const hasGuesthouses = /guesthouse/.test(facilities);
  const hasRestaurants = /restaurant|café|cafe/.test(facilities);
  const hasTransit = /rail|bus/.test(facilities);
  const hasCarHire = /car hire|taxis/.test(facilities);
  const hasAirport = /airport/.test(facilities);

  if (budget === "economy") {
    return (
      (hasGuesthouses ? 2 : 0) +
      (hasTransit ? 3 : 0) +
      (hasRestaurants ? 1 : 0) -
      (hasAirport ? 1 : 0)
    );
  }

  if (budget === "luxury") {
    return (
      (hasHotels ? 2 : 0) +
      (hasCarHire ? 2 : 0) +
      (hasAirport ? 2 : 0) +
      (hasRestaurants ? 1 : 0)
    );
  }

  return (
    (hasHotels ? 2 : 0) +
    (hasRestaurants ? 2 : 0) +
    (hasTransit ? 1 : 0)
  );
}

function scoreCandidate(
  candidate: Candidate,
  selected: Candidate[],
  newlyCoveredThemes: number,
  coveredThemes: Set<DestinationTheme>,
  themeInterestCount: number,
  preferences: ItineraryPreferences,
): number {
  const themeCount = candidate.matchedThemes.length;
  const coverage =
    themeInterestCount > 0 ? themeCount / themeInterestCount : 0;

  const newCoverage = candidate.matchedThemes.filter(
    (theme) => !coveredThemes.has(theme) && themeCount > 0,
  ).length;

  const proximity = selected.length
    ? selected.reduce(
        (total, item) =>
          total +
          distanceKm(item.destination, candidate.destination),
        0,
      ) / selected.length
    : distanceKm(TUNIS, candidate.destination);

  const distancePenalty = selected.length
    ? Math.min(75, proximity / 10)
    : Math.min(25, proximity / 45);

  const familyBonus =
    preferences.groupSize > 2 && candidate.familyFriendly ? 10 : 0;

  return (
    coverage * 100 +
    Math.max(newlyCoveredThemes, newCoverage) * 45 +
    eclipseQuality(candidate.circumstances) / 8 +
    budgetScore(candidate.destination, preferences.budget) * 2 +
    familyBonus -
    distancePenalty
  );
}

function pickBestCandidate(
  candidates: Candidate[],
  selected: Candidate[],
  themeInterests: DestinationTheme[],
  preferences: ItineraryPreferences,
): Candidate | null {
  if (candidates.length === 0) return null;

  const coveredThemes = new Set<DestinationTheme>();
  for (const item of selected) {
    for (const theme of item.matchedThemes) coveredThemes.add(theme);
  }

  let best: Candidate | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const candidate of candidates) {
    const newThemes = themeInterests.filter(
      (theme) =>
        matchesTheme(candidate.destination, theme) && !coveredThemes.has(theme),
    ).length;
    const score = scoreCandidate(
      candidate,
      selected,
      newThemes,
      coveredThemes,
      themeInterests.length,
      preferences,
    );
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

function nearestNeighbourOrder(candidates: Candidate[]): Candidate[] {
  if (candidates.length === 0) return [];

  const remaining = [...candidates];
  let current = [...remaining].sort(
    (a, b) =>
      distanceKm(TUNIS, a.destination) - distanceKm(TUNIS, b.destination),
  )[0];
  const ordered: Candidate[] = [current];
  remaining.splice(remaining.indexOf(current), 1);

  while (remaining.length > 0) {
    let nearest = remaining[0];
    let nearestDistance = distanceKm(
      current.destination,
      nearest.destination,
    );

    for (const candidate of remaining.slice(1)) {
      const distance = distanceKm(current.destination, candidate.destination);
      if (distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    }

    ordered.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
    current = nearest;
  }

  return ordered;
}

function rotateToEclipse(
  ordered: Candidate[],
  eclipseSlug: string,
  eclipseIndex: number,
): Candidate[] {
  const eclipsePosition = ordered.findIndex(
    (item) => item.destination.slug === eclipseSlug,
  );
  if (eclipsePosition === -1) return ordered;

  const shift = (eclipsePosition - eclipseIndex + ordered.length) % ordered.length;
  const rotated = [...ordered.slice(shift), ...ordered.slice(0, shift)];
  const reversed = [...ordered].reverse();
  const reversedPosition = reversed.findIndex(
    (item) => item.destination.slug === eclipseSlug,
  );
  const reversedShift =
    (reversedPosition - eclipseIndex + reversed.length) % reversed.length;
  const rotatedReversed = [
    ...reversed.slice(reversedShift),
    ...reversed.slice(0, reversedShift),
  ];

  const rotatedStartDistance = distanceKm(
    TUNIS,
    rotated[0].destination,
  );
  const reversedStartDistance = distanceKm(
    TUNIS,
    rotatedReversed[0].destination,
  );

  return reversedStartDistance < rotatedStartDistance ? rotatedReversed : rotated;
}

function toLineupEntry(
  candidate: Candidate,
  date: string,
  themeInterests: DestinationTheme[],
  isEclipseDay: boolean,
  isAlternative: boolean,
  isRepeat: boolean,
): LineupEntry {
  return {
    date,
    destination: candidate.destination,
    themes: candidate.destination.themes,
    matchedInterests: themeInterests.filter((theme) =>
      matchesTheme(candidate.destination, theme),
    ) as InterestId[],
    isEclipseDay,
    isAlternative,
    isRepeat,
  };
}

function themeLabelList(themeInterests: DestinationTheme[]): string {
  const labels = themeInterests
    .map((theme) => INTEREST_LABELS[theme as InterestId])
    .filter(Boolean);
  return labels.length > 0 ? labels.join(", ") : "no specific theme";
}

export function recommendDestinations(
  rawPreferences: Partial<ItineraryPreferences>,
): RecommendationResult {
  const preferences = withDefaultPreferences(rawPreferences);
  const dates = getDatesInRange(preferences.startDate, preferences.endDate);
  const eclipseIndex = dates.indexOf(ECLIPSE_DATE);
  const { normalized, unsupported } = normalizeInterests(preferences.interests);
  const themeInterests = Array.from(
    new Set(
      normalized.filter((interest): interest is DestinationTheme =>
        isDestinationTheme(interest),
      ),
    ),
  );

  const warnings: RecommendationWarning[] = [];
  if (unsupported.length > 0) {
    warnings.push({
      code: "unsupported-interest",
      message: `These themes are not supported by the verified destination dataset and were ignored: ${unsupported.join(", ")}.`,
    });
  }

  if (normalized.includes("eclipseViewing")) {
    warnings.push({
      code: "eclipse-viewing-interest",
      message:
        "Eclipse viewing is handled by the Eclipse Viewing Priority setting rather than by destination-theme filtering.",
    });
  }

  const candidates: Candidate[] = destinations.map((destination) => {
    const circumstances = circumstancesFor(destination);
    return {
      destination,
      circumstances,
      matchedThemes: themeInterests.filter((theme) =>
        matchesTheme(destination, theme),
      ),
      eclipseEligible: matchesEclipsePreference(
        circumstances,
        preferences.eclipsePreference,
      ),
      familyFriendly: isFamilyFriendly(destination),
    };
  });

  const matchingCandidates = candidates.filter(
    (candidate) =>
      themeInterests.length === 0 || candidate.matchedThemes.length > 0,
  );

  const selected: Candidate[] = [];
  let eclipseCandidate: Candidate | null = null;

  if (eclipseIndex >= 0) {
    const eclipseCandidates = candidates.filter(
      (candidate) => candidate.eclipseEligible,
    );
    const themedEclipseCandidates = eclipseCandidates.filter(
      (candidate) =>
        themeInterests.length === 0 || candidate.matchedThemes.length > 0,
    );
    const eclipsePool =
      themedEclipseCandidates.length > 0
        ? themedEclipseCandidates
        : eclipseCandidates;

    if (
      themedEclipseCandidates.length === 0 &&
      themeInterests.length > 0 &&
      eclipseCandidates.length > 0
    ) {
      warnings.push({
        code: "eclipse-theme-conflict",
        message: `No verified destination on 2 August 2027 matches both the ${preferences.eclipsePreference} eclipse priority and the selected themes. The closest eclipse-valid destination will be used for eclipse day.`,
      });
    }

    eclipseCandidate = pickBestCandidate(
      eclipsePool,
      [],
      themeInterests,
      preferences,
    );

    if (!eclipseCandidate) {
      warnings.push({
        code: "no-eclipse-candidate",
        message: `No verified destination matching the ${preferences.eclipsePreference} eclipse priority was found.`,
      });
    } else {
      selected.push(eclipseCandidate);
    }
  } else {
    warnings.push({
      code: "no-eclipse-day",
      message: `Your selected dates (${preferences.startDate} to ${preferences.endDate}) do not include 2 August 2027, so no eclipse day can be scheduled.`,
    });
  }

  const remainingMatching = matchingCandidates.filter(
    (candidate) =>
      !selected.some(
        (item) => item.destination.slug === candidate.destination.slug,
      ),
  );

  let matchingPool = [...remainingMatching];
  while (selected.length < dates.length && matchingPool.length > 0) {
    const next = pickBestCandidate(
      matchingPool,
      selected,
      themeInterests,
      preferences,
    );
    if (!next) break;
    selected.push(next);
    matchingPool = matchingPool.filter(
      (candidate) => candidate.destination.slug !== next.destination.slug,
    );
  }

  const matchingCount = selected.filter(
    (candidate) =>
      themeInterests.length === 0 || candidate.matchedThemes.length > 0,
  ).length;

  const alternativeCandidates = candidates
    .filter(
      (candidate) =>
        !selected.some(
          (item) => item.destination.slug === candidate.destination.slug,
        ),
    )
    .sort((a, b) => {
      const scoreA = scoreCandidate(
        a,
        selected,
        0,
        new Set(),
        themeInterests.length,
        preferences,
      );
      const scoreB = scoreCandidate(
        b,
        selected,
        0,
        new Set(),
        themeInterests.length,
        preferences,
      );
      return scoreB - scoreA;
    });

  while (selected.length < dates.length && alternativeCandidates.length > 0) {
    const next = alternativeCandidates.shift();
    if (!next) break;
    selected.push(next);
  }

  if (
    themeInterests.length > 0 &&
    selected.length > matchingCount &&
    dates.length > matchingCount
  ) {
    warnings.push({
      code: "insufficient-matches",
      message: `Only ${matchingCount} verified destination(s) match ${themeLabelList(themeInterests)}. ${dates.length - matchingCount} day(s) use clearly labelled alternatives from the verified dataset. Consider adding a related theme or shortening the trip.`,
    });
  }

  const uniqueSelected = selected.filter(
    (candidate, index, list) =>
      list.findIndex(
        (item) => item.destination.slug === candidate.destination.slug,
      ) === index,
  );

  let ordered = nearestNeighbourOrder(uniqueSelected);
  if (eclipseCandidate && eclipseIndex >= 0) {
    ordered = rotateToEclipse(
      ordered,
      eclipseCandidate.destination.slug,
      eclipseIndex,
    );
  }

  if (ordered.length < dates.length) {
    warnings.push({
      code: "repeat-destination",
      message: `The verified dataset has fewer unique destinations than the ${dates.length}-day trip. Extra days stay at a nearby base rather than inventing new places.`,
    });
    while (ordered.length < dates.length) {
      const previous = ordered[ordered.length - 1];
      const repeat =
        [...uniqueSelected].sort(
          (a, b) =>
            distanceKm(previous.destination, a.destination) -
            distanceKm(previous.destination, b.destination),
        )[0] ?? previous;
      ordered.push(repeat);
    }
  }

  const lineup: LineupEntry[] = ordered.slice(0, dates.length).map((candidate, index) => {
    const date = dates[index];
    const isEclipseDay =
      date === ECLIPSE_DATE &&
      eclipseCandidate !== null &&
      candidate.destination.slug === eclipseCandidate.destination.slug;
    return toLineupEntry(
      candidate,
      date,
      themeInterests,
      isEclipseDay,
      themeInterests.length > 0 && candidate.matchedThemes.length === 0,
      index >= uniqueSelected.length,
    );
  });

  const themeBalance: Record<string, number> = {};
  for (const entry of lineup) {
    for (const theme of entry.matchedInterests) {
      themeBalance[theme] = (themeBalance[theme] ?? 0) + 1;
    }
  }

  return {
    dates,
    eclipseIndex,
    requestedInterests: preferences.interests,
    normalizedInterests: normalized,
    themeInterests,
    lineup,
    warnings,
    themeBalance,
    alternativeDays: lineup.filter((entry) => entry.isAlternative).length,
  };
}
