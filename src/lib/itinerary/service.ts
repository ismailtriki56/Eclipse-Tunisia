import { GoogleGenAI, Type } from "@google/genai";
import { circumstancesFor } from "../eclipse/destinations";
import { ECLIPSE_DATE } from "./dates";
import { DESTINATION_THEME_LABELS, INTEREST_LABELS } from "./metadata";
import { buildItineraryPlan } from "./plan-builder";
import {
  matchesEclipsePreference,
  recommendDestinations,
  withDefaultPreferences,
} from "./recommend";
import type {
  GenerationOutcome,
  ItineraryPreferences,
  LineupEntry,
  RecommendationResult,
} from "./types";

const MODEL = "gemini-3.8-flash";

interface GeminiDay {
  date: string;
  destinationSlug: string;
}

interface GeminiOrdering {
  tripTitle?: string;
  days: GeminiDay[];
}

interface GeminiResponse {
  text?: string;
}

interface GeminiClient {
  models: {
    generateContent(args: {
      model: string;
      contents: string;
      config: unknown;
    }): Promise<GeminiResponse>;
  };
}

export type GeminiClientFactory = (apiKey: string) => GeminiClient;

interface GenerateOptions {
  apiKey?: string | null;
  clientFactory?: GeminiClientFactory;
}

function createGeminiClient(apiKey: string): GeminiClient {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  }) as unknown as GeminiClient;
}

function hasUsableApiKey(apiKey: string | null | undefined): apiKey is string {
  return Boolean(
    apiKey && apiKey.trim().length >= 15 && !apiKey.includes("..."),
  );
}

function warningMessages(recommendation: RecommendationResult): string[] {
  return recommendation.warnings.map((warning) => warning.message);
}

function localOutcome(
  preferences: ItineraryPreferences,
  recommendation: RecommendationResult,
  reason: string,
  extraWarnings: string[] = [],
): GenerationOutcome {
  return {
    plan: buildItineraryPlan(preferences, recommendation),
    generationMethod: "local",
    isFallback: true,
    modelUsed: null,
    notice: `${reason} Your selected preferences were still applied to the verified destination shortlist.`,
    warnings: [...warningMessages(recommendation), ...extraWarnings],
  };
}

function shortlistPrompt(
  preferences: ItineraryPreferences,
  recommendation: RecommendationResult,
): string {
  const interests =
    recommendation.normalizedInterests.length > 0
      ? recommendation.normalizedInterests
          .map((interest) => INTEREST_LABELS[interest])
          .join(", ")
      : "none selected";

  const shortlist = recommendation.lineup
    .map((entry, index) => {
      const circumstances = circumstancesFor(entry.destination);
      const duration =
        circumstances.visibility === "total"
          ? `${Math.floor((circumstances.centralDurationSeconds ?? 0) / 60)}m ${Math.round((circumstances.centralDurationSeconds ?? 0) % 60)}s`
          : `${(circumstances.obscuration * 100).toFixed(0)}% partial`;
      return `${index + 1}. ${entry.destination.name} (slug "${entry.destination.slug}") — ${entry.destination.region} — themes: ${entry.destination.themes.map((theme) => DESTINATION_THEME_LABELS[theme]).join(", ")} — eclipse: ${circumstances.visibility} ${duration}`;
    })
    .join("\n");

  const eclipseEntry = recommendation.lineup.find(
    (entry) => entry.date === ECLIPSE_DATE,
  );

  return `You are ordering a Tunisia eclipse itinerary. All destinations have already been selected and ranked from verified data. Your only job is to place the allowed destinations onto the required dates in a coherent order.

USER PREFERENCES
- Dates: ${recommendation.dates.join(", ")}
- Trip length: ${recommendation.dates.length} days
- Themes: ${interests}
- Eclipse priority: ${preferences.eclipsePreference}
- Pace: ${preferences.pace}
- Budget: ${preferences.budget}
- Travellers: ${preferences.groupSize}

ALLOWED DESTINATIONS (use every listed destination exactly once; do not add any other place):
${shortlist}

RULES
- Return exactly ${recommendation.dates.length} day entries, one per date listed above.
- Every destinationSlug must be an allowed slug above.
- Do not invent destinations, coordinates, travel times, opening hours, prices, or eclipse circumstances.
- ${eclipseEntry ? `Place "${eclipseEntry.destination.slug}" on ${ECLIPSE_DATE}, because that is the pre-validated eclipse day.` : "The selected dates do not include 2 August 2027, so there is no eclipse day."}
- Return only JSON matching the schema.`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(withoutFence);
}

function validateOrdering(
  parsed: unknown,
  recommendation: RecommendationResult,
  preferences: ItineraryPreferences,
): { ok: true; ordering: GeminiOrdering } | { ok: false; reason: string } {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "The response was not a JSON object." };
  }

  const candidate = parsed as Partial<GeminiOrdering>;
  if (!Array.isArray(candidate.days)) {
    return { ok: false, reason: "The response did not contain a days array." };
  }

  if (candidate.days.length !== recommendation.dates.length) {
    return {
      ok: false,
      reason: `Expected ${recommendation.dates.length} days but received ${candidate.days.length}.`,
    };
  }

  const expectedDates = new Set(recommendation.dates);
  const seenDates = new Set<string>();
  const allowedCounts = new Map<string, number>();
  for (const entry of recommendation.lineup) {
    const slug = entry.destination.slug;
    allowedCounts.set(slug, (allowedCounts.get(slug) ?? 0) + 1);
  }

  const byDate = new Map<string, string>();
  for (const day of candidate.days) {
    if (
      !day ||
      typeof day.date !== "string" ||
      typeof day.destinationSlug !== "string"
    ) {
      return {
        ok: false,
        reason: "A day entry was missing a date or destination slug.",
      };
    }

    if (!expectedDates.has(day.date)) {
      return {
        ok: false,
        reason: `Unexpected date ${day.date} in the response.`,
      };
    }

    if (seenDates.has(day.date)) {
      return {
        ok: false,
        reason: `Duplicate date ${day.date} in the response.`,
      };
    }
    seenDates.add(day.date);

    const remaining = allowedCounts.get(day.destinationSlug) ?? 0;
    if (remaining <= 0) {
      return {
        ok: false,
        reason: `Destination ${day.destinationSlug} is not in the verified shortlist.`,
      };
    }
    allowedCounts.set(day.destinationSlug, remaining - 1);
    byDate.set(day.date, day.destinationSlug);
  }

  if (seenDates.size !== expectedDates.size) {
    return {
      ok: false,
      reason: "The response did not include every required date.",
    };
  }

  if (recommendation.eclipseIndex >= 0) {
    const eclipseSlug = byDate.get(ECLIPSE_DATE);
    const eclipseEntry = recommendation.lineup.find(
      (entry) => entry.destination.slug === eclipseSlug,
    );

    if (!eclipseEntry) {
      return {
        ok: false,
        reason: "The eclipse day did not use a shortlisted destination.",
      };
    }

    if (
      !matchesEclipsePreference(
        circumstancesFor(eclipseEntry.destination),
        preferences.eclipsePreference,
      )
    ) {
      return {
        ok: false,
        reason: "The eclipse day did not match the selected eclipse priority.",
      };
    }
  }

  return {
    ok: true,
    ordering: {
      tripTitle:
        typeof candidate.tripTitle === "string"
          ? candidate.tripTitle
          : undefined,
      days: byDateToDays(byDate, recommendation.dates),
    },
  };
}

function byDateToDays(
  byDate: Map<string, string>,
  dates: string[],
): GeminiDay[] {
  return dates.map((date) => ({
    date,
    destinationSlug: byDate.get(date) as string,
  }));
}

function lineupFromOrdering(
  recommendation: RecommendationResult,
  ordering: GeminiOrdering,
): LineupEntry[] {
  const remaining = [...recommendation.lineup];
  const byDate = new Map(
    ordering.days.map((day) => [day.date, day.destinationSlug]),
  );

  return recommendation.dates.map((date) => {
    const slug = byDate.get(date) as string;
    const index = remaining.findIndex(
      (entry) => entry.destination.slug === slug,
    );
    const source = remaining.splice(index, 1)[0];
    return {
      ...source,
      date,
      isEclipseDay: date === ECLIPSE_DATE,
    };
  });
}

async function requestOrdering(
  client: GeminiClient,
  preferences: ItineraryPreferences,
  recommendation: RecommendationResult,
): Promise<GeminiOrdering> {
  const response = await client.models.generateContent({
    model: MODEL,
    contents: shortlistPrompt(preferences, recommendation),
    config: {
      systemInstruction:
        "You are a Tunisia travel planner. You must only order the verified destination shortlist. Never invent destinations or facts. Return only valid JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tripTitle: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                destinationSlug: { type: Type.STRING },
              },
              required: ["date", "destinationSlug"],
            },
          },
        },
        required: ["tripTitle", "days"],
      },
    },
  });

  const text = response.text?.trim() ?? "";
  if (!text) throw new Error("Gemini returned an empty response.");

  const parsed = extractJson(text);
  return parsed as GeminiOrdering;
}

export async function generateItinerary(
  rawPreferences: Partial<ItineraryPreferences>,
  options: GenerateOptions = {},
): Promise<GenerationOutcome> {
  const preferences = withDefaultPreferences(rawPreferences);
  const recommendation = recommendDestinations(preferences);
  const apiKey =
    "apiKey" in options ? options.apiKey : process.env.GEMINI_API_KEY;

  if (!hasUsableApiKey(apiKey)) {
    return localOutcome(
      preferences,
      recommendation,
      "Gemini was not used because GEMINI_API_KEY is not configured (or is still a placeholder), so the local preference-matching engine built this itinerary instead.",
    );
  }

  try {
    const clientFactory = options.clientFactory ?? createGeminiClient;
    const client = clientFactory(apiKey);
    const parsed = await requestOrdering(client, preferences, recommendation);
    const validation = validateOrdering(parsed, recommendation, preferences);

    if (!validation.ok) {
      return localOutcome(
        preferences,
        recommendation,
        `Gemini returned an itinerary that did not match the verified destination shortlist (${validation.reason}), so the local preference-matching engine was used instead.`,
      );
    }

    const lineup = lineupFromOrdering(recommendation, validation.ordering);
    const plan = buildItineraryPlan(preferences, recommendation, {
      lineup,
      tripTitle: validation.ordering.tripTitle,
    });

    return {
      plan,
      generationMethod: "gemini",
      isFallback: false,
      modelUsed: MODEL,
      notice: `Itinerary organized by Gemini (${MODEL}) from a preference-ranked shortlist of verified destinations. Eclipse times and activity details were rebuilt from the local astronomical engine.`,
      warnings: warningMessages(recommendation),
    };
  } catch {
    return localOutcome(
      preferences,
      recommendation,
      "The Gemini request failed, so the local preference-matching engine was used instead.",
    );
  }
}
