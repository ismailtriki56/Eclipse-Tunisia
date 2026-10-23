import test from "node:test";
import assert from "node:assert/strict";
import { destinations } from "../src/data/destinations";
import { circumstancesFor } from "../src/lib/eclipse/destinations";
import { ECLIPSE_DATE } from "../src/lib/itinerary/dates";
import { buildItineraryPlan } from "../src/lib/itinerary/plan-builder";
import {
  matchesEclipsePreference,
  recommendDestinations,
} from "../src/lib/itinerary/recommend";
import { generateItinerary } from "../src/lib/itinerary/service";
import type {
  GenerationOutcome,
  ItineraryPreferences,
} from "../src/lib/itinerary/types";

function preferences(
  overrides: Partial<ItineraryPreferences> = {},
): ItineraryPreferences {
  return {
    startDate: "2027-07-31",
    endDate: "2027-08-04",
    eclipsePreference: "totality",
    pace: "moderate",
    budget: "moderate",
    groupSize: 2,
    interests: [],
    ...overrides,
  };
}

function assertPlanShape(outcome: GenerationOutcome) {
  assert.equal(outcome.plan.days.length, 5);
  const dates = outcome.plan.days.map((day) => day.date);
  assert.deepEqual(dates, [
    "2027-07-31",
    "2027-08-01",
    ECLIPSE_DATE,
    "2027-08-03",
    "2027-08-04",
  ]);
  const slugs = outcome.plan.days.map((day) => day.destinationSlug);
  assert.equal(new Set(slugs).size, slugs.length, "destinations must be unique");
  for (const day of outcome.plan.days) {
    assert.ok(
      destinations.some((destination) => destination.slug === day.destinationSlug),
      `unknown destination slug ${day.destinationSlug}`,
    );
    assert.ok(day.activities.length > 0, "each day needs at least one activity");
  }
}

function assertEclipseDay(
  outcome: GenerationOutcome,
  expected: "totality" | "partial" = "totality",
) {
  const eclipseDay = outcome.plan.days.find((day) => day.date === ECLIPSE_DATE);
  assert.ok(eclipseDay, "eclipse day should be present");
  assert.equal(eclipseDay.isEclipseDay, true);
  const destination = destinations.find(
    (item) => item.slug === eclipseDay.destinationSlug,
  );
  assert.ok(destination);
  const circumstances = circumstancesFor(destination);
  const visibility = expected === "totality" ? "total" : "partial";
  assert.equal(circumstances.visibility, visibility);
  assert.ok(matchesEclipsePreference(circumstances, expected));

  const maximum = circumstances.localTimes.maximum?.slice(0, 5);
  if (maximum) {
    assert.ok(
      eclipseDay.activities.some((activity) => activity.time === maximum),
      "eclipse activities should use the computed maximum time",
    );
  }
}

function destinationForLineup(
  recommendation: ReturnType<typeof recommendDestinations>,
  date: string,
) {
  const entry = recommendation.lineup.find((item) => item.date === date);
  assert.ok(entry, `lineup entry for ${date} should exist`);
  return entry.destination;
}

test("Coastal only: every stop is coastal and eclipse day is in totality", async () => {
  const result = recommendDestinations(preferences({ interests: ["Coastal"] }));
  assert.equal(result.lineup.length, 5);
  assert.equal(result.alternativeDays, 0);

  for (const entry of result.lineup) {
    assert.ok(
      entry.destination.themes.includes("coast"),
      `${entry.destination.name} should be coastal`,
    );
  }

  const outcome = await generateItinerary(
    preferences({ interests: ["Coastal"] }),
    { apiKey: null },
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
  for (const day of outcome.plan.days) {
    const destination = destinations.find((item) => item.slug === day.destinationSlug);
    assert.ok(destination?.themes.includes("coast"));
  }
});

test("History only: every stop is historical and no coastal filler is required", async () => {
  const result = recommendDestinations(preferences({ interests: ["History"] }));
  assert.equal(result.lineup.length, 5);
  assert.equal(result.alternativeDays, 0);
  for (const entry of result.lineup) {
    assert.ok(
      entry.destination.themes.includes("history"),
      `${entry.destination.name} should be historical`,
    );
  }

  const outcome = await generateItinerary(
    preferences({ interests: ["History"] }),
    { apiKey: null },
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Nature only: every stop is tagged as nature", async () => {
  const result = recommendDestinations(preferences({ interests: ["Nature"] }));
  assert.equal(result.lineup.length, 5);
  assert.equal(result.alternativeDays, 0);
  for (const entry of result.lineup) {
    assert.ok(
      entry.destination.themes.includes("nature"),
      `${entry.destination.name} should be a nature stop`,
    );
  }

  const outcome = await generateItinerary(
    preferences({ interests: ["Nature"] }),
    { apiKey: null },
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Coastal + History: both interests are represented", async () => {
  const result = recommendDestinations(
    preferences({ interests: ["Coastal", "History"] }),
  );
  assert.equal(result.lineup.length, 5);
  assert.equal(result.alternativeDays, 0);

  for (const entry of result.lineup) {
    assert.ok(
      entry.destination.themes.includes("coast") ||
        entry.destination.themes.includes("history"),
      `${entry.destination.name} should match at least one selected theme`,
    );
  }

  const coastDays = result.lineup.filter((entry) =>
    entry.destination.themes.includes("coast"),
  ).length;
  const historyDays = result.lineup.filter((entry) =>
    entry.destination.themes.includes("history"),
  ).length;
  assert.ok(coastDays >= 2, `expected at least 2 coastal days, got ${coastDays}`);
  assert.ok(
    historyDays >= 2,
    `expected at least 2 historical days, got ${historyDays}`,
  );

  const outcome = await generateItinerary(
    preferences({ interests: ["Coastal", "History"] }),
    { apiKey: null },
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Eclipse Viewing Priority: totality and partial choices change eclipse day", async () => {
  const totality = recommendDestinations(
    preferences({ interests: ["Culture"], eclipsePreference: "totality" }),
  );
  const totalityDestination = destinationForLineup(totality, ECLIPSE_DATE);
  assert.equal(circumstancesFor(totalityDestination).visibility, "total");

  const partial = recommendDestinations(
    preferences({ interests: ["Coastal"], eclipsePreference: "partial" }),
  );
  const partialDestination = destinationForLineup(partial, ECLIPSE_DATE);
  assert.equal(circumstancesFor(partialDestination).visibility, "partial");

  const partialOutcome = await generateItinerary(
    preferences({ interests: ["Coastal"], eclipsePreference: "partial" }),
    { apiKey: null },
  );
  assertPlanShape(partialOutcome);
  assertEclipseDay(partialOutcome, "partial");
});

test("No interests selected: a general verified plan is still produced", async () => {
  const result = recommendDestinations(preferences({ interests: [] }));
  assert.equal(result.lineup.length, 5);
  assert.equal(result.themeInterests.length, 0);
  assert.equal(result.alternativeDays, 0);

  const outcome = await generateItinerary(preferences({ interests: [] }), {
    apiKey: null,
  });
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
  assert.match(outcome.plan.summary, /No highlight themes were selected/i);
});

test("Insufficient matching destinations: limitation is explained, not hidden", async () => {
  const result = recommendDestinations(
    preferences({ interests: ["troglodyte"] }),
  );
  assert.equal(result.lineup.length, 5);
  assert.ok(result.alternativeDays > 0, "expected labelled alternative days");
  assert.ok(
    result.warnings.some((warning) => warning.code === "insufficient-matches"),
    "expected an insufficient-matches warning",
  );
  assert.ok(
    result.warnings.some((warning) => /Only \d+ verified destination/.test(warning.message)),
  );

  const outcome = await generateItinerary(
    preferences({ interests: ["troglodyte"] }),
    { apiKey: null },
  );
  assertPlanShape(outcome);
  assert.match(outcome.plan.summary, /clearly labelled as alternatives/i);
  assert.ok(
    outcome.plan.days.some((day) => /Alternative stop/i.test(day.title)),
    "alternative days should be labelled in the UI text",
  );
});

test("Retired eclipse highlight is explained instead of silently ignored", async () => {
  const input = preferences({ interests: ["totality"] });
  const result = recommendDestinations(input);
  assert.equal(result.themeInterests.length, 0);
  assert.ok(
    result.warnings.some(
      (warning) => warning.code === "eclipse-viewing-interest",
    ),
  );

  const outcome = await generateItinerary(input, { apiKey: null });
  assert.ok(
    outcome.warnings.some((warning) =>
      /Eclipse Viewing Priority setting/.test(warning),
    ),
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Missing Gemini key: local engine is used and disclosed", async () => {
  const outcome = await generateItinerary(
    preferences({ interests: ["Coastal"] }),
    { apiKey: null },
  );
  assert.equal(outcome.generationMethod, "local");
  assert.equal(outcome.isFallback, true);
  assert.equal(outcome.modelUsed, null);
  assert.match(outcome.notice, /GEMINI_API_KEY/);
  assert.match(outcome.notice, /local preference-matching engine/i);
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Gemini API error: local engine is used and disclosed", async () => {
  const outcome = await generateItinerary(
    preferences({ interests: ["History"] }),
    {
      apiKey: "test-key-long-enough-for-validation",
      clientFactory: () => ({
        models: {
          generateContent: async () => {
            throw new Error("simulated Gemini failure");
          },
        },
      }),
    },
  );

  assert.equal(outcome.generationMethod, "local");
  assert.equal(outcome.isFallback, true);
  assert.match(outcome.notice, /Gemini request failed/i);
  assert.match(outcome.notice, /local preference-matching engine/i);
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Gemini success: AI order is accepted and rebuilt with verified data", async () => {
  const input = preferences({ interests: ["Coastal"] });
  const recommendation = recommendDestinations(input);
  const reordered = [...recommendation.lineup];
  [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
  const days = recommendation.dates.map((date, index) => ({
    date,
    destinationSlug: reordered[index].destination.slug,
  }));

  const outcome = await generateItinerary(input, {
    apiKey: "test-key-long-enough-for-validation",
    clientFactory: () => ({
      models: {
        generateContent: async () => ({
          text: JSON.stringify({
            tripTitle: "Gemini Coastal Eclipse Run",
            days,
          }),
        }),
      },
    }),
  });

  assert.equal(outcome.generationMethod, "gemini");
  assert.equal(outcome.isFallback, false);
  assert.equal(outcome.modelUsed, "gemini-3.8-flash");
  assert.match(outcome.notice, /Gemini/i);
  assert.equal(outcome.plan.tripTitle, "Gemini Coastal Eclipse Run");
  assert.equal(
    outcome.plan.days[0].destinationSlug,
    reordered[0].destination.slug,
  );
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Gemini response using an unknown destination is rejected", async () => {
  const outcome = await generateItinerary(
    preferences({ interests: ["Coastal"] }),
    {
      apiKey: "test-key-long-enough-for-validation",
      clientFactory: () => ({
        models: {
          generateContent: async () => ({
            text: JSON.stringify({
              tripTitle: "Invented trip",
              days: [
                { date: "2027-07-31", destinationSlug: "atlantis" },
                { date: "2027-08-01", destinationSlug: "djerba" },
                { date: ECLIPSE_DATE, destinationSlug: "mahdia" },
                { date: "2027-08-03", destinationSlug: "gabes" },
                { date: "2027-08-04", destinationSlug: "sousse" },
              ],
            }),
          }),
        },
      }),
    },
  );

  assert.equal(outcome.generationMethod, "local");
  assert.match(outcome.notice, /did not match the verified destination shortlist/i);
  assertPlanShape(outcome);
  assertEclipseDay(outcome, "totality");
});

test("Build plan uses verified circumstances and no duplicate destinations", async () => {
  const input = preferences({ interests: ["Nature"] });
  const recommendation = recommendDestinations(input);
  const plan = buildItineraryPlan(input, recommendation);
  assert.equal(plan.days.length, 5);
  const slugs = plan.days.map((day) => day.destinationSlug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(plan.eclipseDayNotes.includes("2 August 2027"));
  assert.match(plan.summary, /Nature/i);
});
