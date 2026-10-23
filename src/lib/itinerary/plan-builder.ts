import { experiences } from "../../data/experiences";
import { circumstancesFor } from "../eclipse/destinations";
import { ECLIPSE_DATE } from "./dates";
import {
  DESTINATION_THEME_LABELS,
  INTEREST_LABELS,
} from "./metadata";
import { withDefaultPreferences } from "./recommend";
import type {
  Activity,
  ItineraryDay,
  ItineraryPlan,
  ItineraryPreferences,
  LineupEntry,
  RecommendationResult,
} from "./types";

interface BuildPlanOptions {
  lineup?: LineupEntry[];
  tripTitle?: string;
}

function compactTime(value: string | null): string | null {
  return value ? value.slice(0, 5) : null;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "not available";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function eclipseActivities(entry: LineupEntry): Activity[] {
  const circumstances = circumstancesFor(entry.destination);
  const activities: Activity[] = [];
  const push = (
    id: string,
    time: string | null,
    title: string,
    description: string,
  ) => {
    if (!time) return;
    activities.push({
      id,
      time,
      title,
      description,
      type: "destination",
      referenceSlug: entry.destination.slug,
    });
  };

  const firstContact = compactTime(circumstances.localTimes.firstContact);
  const secondContact = compactTime(circumstances.localTimes.secondContact);
  const maximum = compactTime(circumstances.localTimes.maximum);
  const thirdContact = compactTime(circumstances.localTimes.thirdContact);
  const fourthContact = compactTime(circumstances.localTimes.fourthContact);

  push(
    `${entry.date}-c1`,
    firstContact,
    `First contact (C1) at ${entry.destination.name}`,
    "The partial phase begins. Use ISO 12312-2 certified solar viewers for every second of the partial phase.",
  );

  if (circumstances.visibility === "total") {
    push(
      `${entry.date}-c2`,
      secondContact,
      `Totality begins (C2) at ${entry.destination.name}`,
      "The Moon fully covers the Sun. Certified filters may be removed only during totality.",
    );
    push(
      `${entry.date}-max`,
      maximum,
      `Maximum eclipse and totality at ${entry.destination.name}`,
      `Computed totality duration: ${formatDuration(circumstances.centralDurationSeconds)}. The Sun is fully obscured at this location.`,
    );
    push(
      `${entry.date}-c3`,
      thirdContact,
      `Totality ends (C3) at ${entry.destination.name}`,
      "The Sun reappears. Replace certified solar filters immediately.",
    );
  } else {
    push(
      `${entry.date}-max`,
      maximum,
      `Maximum eclipse at ${entry.destination.name}`,
      `Computed obscuration: ${(circumstances.obscuration * 100).toFixed(0)}%. This location does not experience totality.`,
    );
  }

  push(
    `${entry.date}-c4`,
    fourthContact,
    `Fourth contact (C4) at ${entry.destination.name}`,
    "The partial phase ends. Keep certified viewers on until the Sun is completely normal.",
  );

  if (activities.length === 0) {
    activities.push({
      id: `${entry.date}-eclipse`,
      time: "—",
      title: `Eclipse day at ${entry.destination.name}`,
      description:
        "Computed contact times are not available for this location. Check the destination page for verified circumstances.",
      type: "destination",
      referenceSlug: entry.destination.slug,
    });
  }

  return activities;
}

function budgetAllowsExperience(price: number, budget: string): boolean {
  if (budget === "economy") return price <= 120;
  if (budget === "luxury") return true;
  return price <= 300;
}

function visitActivities(
  entry: LineupEntry,
  preferences: ItineraryPreferences,
): Activity[] {
  const activities: Activity[] = [
    {
      id: `${entry.date}-visit`,
      time: "Morning",
      title: `Explore ${entry.destination.name}`,
      description: entry.destination.summary,
      type: "destination",
      referenceSlug: entry.destination.slug,
    },
  ];

  const matchingExperience = experiences.find(
    (experience) =>
      experience.destinationSlug === entry.destination.slug &&
      budgetAllowsExperience(experience.priceAmount, preferences.budget),
  );

  if (preferences.pace !== "relaxed" && matchingExperience) {
    activities.push({
      id: `${entry.date}-experience`,
      time: "Afternoon",
      title: `Optional sample experience: ${matchingExperience.title}`,
      description: `${matchingExperience.summary} Sample listing — not a live booking.`,
      type: "experience",
      referenceSlug: matchingExperience.slug,
    });
  } else if (preferences.pace !== "relaxed") {
    activities.push({
      id: `${entry.date}-context`,
      time: "Afternoon",
      title: `${entry.destination.name} in context`,
      description: entry.destination.notes,
      type: "destination",
      referenceSlug: entry.destination.slug,
    });
  }

  if (preferences.pace === "intensive") {
    activities.push({
      id: `${entry.date}-practical`,
      time: "Evening",
      title: `Practical notes for ${entry.destination.name}`,
      description: entry.destination.practicalities.join(" "),
      type: "destination",
      referenceSlug: entry.destination.slug,
    });
  }

  return activities;
}

function dayTitle(entry: LineupEntry, isEclipseDay: boolean): string {
  if (isEclipseDay) {
    const circumstances = circumstancesFor(entry.destination);
    return circumstances.visibility === "total"
      ? `Total eclipse day in ${entry.destination.name}`
      : `Eclipse day in ${entry.destination.name} (partial phase)`;
  }
  if (entry.isRepeat) return `${entry.destination.name} — extended stay`;
  if (entry.isAlternative) {
    return `Alternative stop: ${entry.destination.name}`;
  }
  const primaryTheme = entry.themes[0];
  const themeLabel = primaryTheme
    ? DESTINATION_THEME_LABELS[primaryTheme]
    : "Verified destination";
  return `${entry.destination.name} — ${themeLabel}`;
}

function groupLabel(groupSize: number): string {
  if (groupSize === 1) return "for a solo traveller";
  if (groupSize === 2) return "for a travelling pair";
  return `for a party of ${groupSize}`;
}

function budgetLabel(budget: string): string {
  if (budget === "economy") {
    return "Budget-conscious stops with rail or bus access where the dataset supports it.";
  }
  if (budget === "luxury") {
    return "Luxury-oriented stops with hotels, car hire or airport access where the dataset supports it.";
  }
  return "Mid-range stops with hotels and restaurants where the dataset supports it.";
}

function themeSummary(recommendation: RecommendationResult): string {
  if (recommendation.themeInterests.length === 0) {
    return "No highlight themes were selected, so the engine balanced eclipse timing, facilities and travel distance across the verified destinations.";
  }

  const balance = Object.entries(recommendation.themeBalance)
    .filter(([, count]) => count > 0)
    .map(
      ([theme, count]) =>
        `${DESTINATION_THEME_LABELS[theme as keyof typeof DESTINATION_THEME_LABELS] ?? theme} ${count} day${count === 1 ? "" : "s"}`,
    );

  const balanceText =
    balance.length > 0 ? `Theme balance: ${balance.join(" · ")}.` : "";
  return `${balanceText} Destinations were filtered and ranked before this plan was assembled.`;
}

function eclipseNotes(
  recommendation: RecommendationResult,
  lineup: LineupEntry[],
): string {
  const eclipseEntry = lineup.find(
    (entry) => entry.isEclipseDay && entry.date === ECLIPSE_DATE,
  );

  if (!eclipseEntry) {
    if (recommendation.eclipseIndex < 0) {
      return `Your selected dates (${recommendation.dates[0]} to ${recommendation.dates[recommendation.dates.length - 1]}) do not include 2 August 2027, so this itinerary has no eclipse day. Add 2 August to the date range if seeing the eclipse is the priority.`;
    }
    return "No eclipse day could be scheduled from the verified destination data.";
  }

  const circumstances = circumstancesFor(eclipseEntry.destination);
  if (circumstances.visibility === "total") {
    return `On 2 August 2027 the total eclipse is visible from ${eclipseEntry.destination.name}. Computed maximum is at ${circumstances.localTimes.maximum ?? "an unavailable time"} local time with ${formatDuration(circumstances.centralDurationSeconds)} of totality. Use ISO 12312-2 certified viewers during every partial phase.`;
  }

  return `On 2 August 2027 ${eclipseEntry.destination.name} sees a partial eclipse, with computed obscuration of ${(circumstances.obscuration * 100).toFixed(0)}% at ${circumstances.localTimes.maximum ?? "an unavailable time"} local time. Totality is not visible from this location. Use ISO 12312-2 certified viewers throughout.`;
}

function defaultTitle(
  preferences: ItineraryPreferences,
  recommendation: RecommendationResult,
): string {
  const labels = recommendation.normalizedInterests
    .map((interest) => INTEREST_LABELS[interest])
    .filter(Boolean);

  const topic =
    labels.length === 0
      ? "Tunisia"
      : labels.length === 1
        ? labels[0]
        : `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`;

  return `${topic} Eclipse Expedition (${recommendation.dates.length} Days)`;
}

export function buildItineraryPlan(
  rawPreferences: Partial<ItineraryPreferences>,
  recommendation: RecommendationResult,
  options: BuildPlanOptions = {},
): ItineraryPlan {
  const preferences = withDefaultPreferences(rawPreferences);
  const lineup = options.lineup ?? recommendation.lineup;
  const selectedLabels =
    recommendation.normalizedInterests.length > 0
      ? recommendation.normalizedInterests
          .map((interest) => INTEREST_LABELS[interest])
          .join(", ")
      : "no specific highlight themes";

  const summaryParts = [
    `A ${recommendation.dates.length}-day itinerary ${groupLabel(preferences.groupSize)} at a ${preferences.pace} pace.`,
    `You selected ${selectedLabels}.`,
    themeSummary(recommendation),
    budgetLabel(preferences.budget),
  ];

  if (recommendation.alternativeDays > 0) {
    summaryParts.push(
      `${recommendation.alternativeDays} day(s) are clearly labelled as alternatives because not enough verified destinations matched every selected theme.`,
    );
  }

  const days: ItineraryDay[] = lineup.map((entry, index) => {
    const isEclipseDay =
      entry.isEclipseDay && entry.date === ECLIPSE_DATE;
    return {
      dayNumber: index + 1,
      date: entry.date,
      title: dayTitle(entry, isEclipseDay),
      destinationSlug: entry.destination.slug,
      isEclipseDay,
      activities: isEclipseDay
        ? eclipseActivities(entry)
        : visitActivities(entry, preferences),
    };
  });

  const tripTitle =
    options.tripTitle && options.tripTitle.trim().length > 0
      ? options.tripTitle.trim().slice(0, 120)
      : defaultTitle(preferences, recommendation);

  return {
    tripTitle,
    summary: summaryParts.join(" "),
    eclipseDayNotes: eclipseNotes(recommendation, lineup),
    days,
  };
}
