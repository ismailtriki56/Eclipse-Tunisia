/**
 * Verification harness for the eclipse engine.
 *
 * Run with:  npm run verify:eclipse
 *
 * The engine in `src/lib/eclipse` reproduces the standard Besselian-element
 * method used to build NASA's official eclipse maps. This script checks the
 * results against the values NASA publishes for the 2 August 2027 eclipse so
 * that regressions in the calculation are caught immediately.
 *
 * Reference values:
 *   https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802
 *   https://eclipse.gsfc.nasa.gov/SEsearch/eclipse-path-data.js.php?Ecl=20270802&Spc=0.5
 */

import {
  catalogueFacts2027,
  elements2027,
} from "../src/lib/eclipse/elements";
import {
  localCircumstances,
  type LocalCircumstances,
} from "../src/lib/eclipse/circumstances";
import { latitudeAtLongitude } from "../src/data/eclipse-path-2027";

let failures = 0;
let checks = 0;

function check(
  label: string,
  actual: number,
  expected: number,
  tolerance: number,
  unit = "",
) {
  checks += 1;
  const difference = Math.abs(actual - expected);
  const ok = difference <= tolerance;
  if (!ok) failures += 1;
  console.log(
    `  [${ok ? "PASS" : "FAIL"}] ${label}: ${actual.toFixed(4)}${unit} (expected ${expected.toFixed(4)}${unit} ±${tolerance}, Δ${difference.toFixed(4)})`,
  );
}

function checkText(label: string, actual: string, expected: string) {
  checks += 1;
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(
    `  [${ok ? "PASS" : "FAIL"}] ${label}: ${actual} (expected ${expected})`,
  );
}

function formatUT(date: Date): string {
  return `${date.toISOString().replace("T", " ").slice(0, 19)} UT`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds - minutes * 60);
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function row(result: LocalCircumstances): string {
  const maximum = result.maximum;
  return (
    `${result.kind.padEnd(8)} ` +
    `max ${maximum ? formatUT(maximum.date).slice(11, 19) : "—"} UT ` +
    `mag ${result.magnitude.toFixed(3)} ` +
    `diam ${result.diameterRatio.toFixed(4)} ` +
    `obsc ${(result.obscuration * 100).toFixed(1)}% ` +
    `totality ${formatDuration(result.centralDurationSeconds).padStart(7)} ` +
    `sun ${maximum ? maximum.sunAltitude.toFixed(1) : "—"}°`
  );
}

console.log(
  "Eclipse engine verification — total solar eclipse of 2 August 2027",
);
console.log(
  `Source: NASA GSFC (Espenak) — ${catalogueFacts2027.ephemerides}, ΔT = ${catalogueFacts2027.deltaTSeconds}s`,
);
console.log("");

// ---------------------------------------------------------------------------
// 1. Greatest eclipse, validated against the NASA published catalogue entry.
// ---------------------------------------------------------------------------
console.log(
  "1. Greatest eclipse (NASA catalogue point 25.50236°N, 33.19617°E)",
);
const greatest = localCircumstances(elements2027, {
  latitude: catalogueFacts2027.greatestEclipseLatitude,
  longitude: catalogueFacts2027.greatestEclipseLongitude,
});
const greatestMax = greatest.maximum;
if (!greatestMax) {
  console.log("  [FAIL] no maximum eclipse computed at the greatest-eclipse point");
  failures += 1;
  checks += 1;
} else {
  const expectedUT = new Date("2027-08-02T10:06:34Z").getTime();
  const actualUT = greatestMax.date.getTime();
  checks += 1;
  const secondsApart = Math.abs(actualUT - expectedUT) / 1000;
  const ok = secondsApart <= 2;
  if (!ok) failures += 1;
  console.log(
    `  [${ok ? "PASS" : "FAIL"}] maximum eclipse time: ${formatUT(greatestMax.date)} (expected 2027-08-02 10:06:34 UT ±2s, Δ${secondsApart.toFixed(1)}s)`,
  );
  // NASA publishes the eclipse magnitude of a total eclipse as the ratio of
  // the Moon's apparent diameter to the Sun's apparent diameter.
  check(
    "diameter ratio (NASA eclipse magnitude)",
    greatest.diameterRatio,
    catalogueFacts2027.magnitude,
    0.0005,
  );
  check(
    "duration of totality",
    greatest.centralDurationSeconds ?? 0,
    catalogueFacts2027.centralDurationSeconds,
    2,
    "s",
  );
  check(
    "sun altitude at maximum",
    greatestMax.sunAltitude,
    catalogueFacts2027.sunAltitudeAtGreatest,
    0.3,
    "°",
  );
  check(
    "sun azimuth at maximum",
    greatestMax.sunAzimuth,
    catalogueFacts2027.sunAzimuthAtGreatest,
    0.5,
    "°",
  );
  checkText("event type", greatest.kind, "total");
  check("obscuration", greatest.obscuration, 1, 0.0001);
}
console.log("");

// ---------------------------------------------------------------------------
// 2. The computed band of totality must match the published NASA path limits.
//    This is the strongest available check: the engine derives the band from
//    the Besselian elements alone, while the published limits come from
//    NASA's own map generator.
// ---------------------------------------------------------------------------
console.log("2. Computed band of totality against the published NASA path limits");
const longitudes = [-30, -15, 0, 10, 20, 30, 33.2, 40, 60, 80, 90];
for (const longitude of longitudes) {
  const north = latitudeAtLongitude("northern-limit", longitude);
  const south = latitudeAtLongitude("southern-limit", longitude);
  if (north === null || south === null) {
    console.log(`  [SKIP] longitude ${longitude}°E is outside the published path`);
    continue;
  }
  const mid = (north + south) / 2;

  const onCentre = localCircumstances(elements2027, {
    latitude: mid,
    longitude,
  });
  const justInsideNorth = localCircumstances(elements2027, {
    latitude: north - 0.05,
    longitude,
  });
  const justInsideSouth = localCircumstances(elements2027, {
    latitude: south + 0.05,
    longitude,
  });
  const justOutsideNorth = localCircumstances(elements2027, {
    latitude: north + 0.15,
    longitude,
  });
  const justOutsideSouth = localCircumstances(elements2027, {
    latitude: south - 0.15,
    longitude,
  });

  checks += 1;
  const ok =
    onCentre.kind === "total" &&
    justInsideNorth.kind === "total" &&
    justInsideSouth.kind === "total" &&
    justOutsideNorth.kind !== "total" &&
    justOutsideSouth.kind !== "total";
  if (!ok) failures += 1;
  console.log(
    `  [${ok ? "PASS" : "FAIL"}] ${String(longitude).padStart(5)}°E  published ${south.toFixed(2)}–${north.toFixed(2)}N  ` +
      `centre ${onCentre.kind}  in-N ${justInsideNorth.kind}  in-S ${justInsideSouth.kind}  ` +
      `out-N ${justOutsideNorth.kind}  out-S ${justOutsideSouth.kind}`,
  );
}
console.log("");

// ---------------------------------------------------------------------------
// 3. Local circumstances across Tunisia. Expected values are derived from
//    the published NASA path limits, not from this engine.
// ---------------------------------------------------------------------------
console.log("3. Local circumstances at Tunisian locations");
const tunisianLocations: Array<{
  label: string;
  latitude: number;
  longitude: number;
  expected: "total" | "partial";
}> = [
  { label: "Tozeur (oasis)", latitude: 33.9197, longitude: 8.1084, expected: "total" },
  { label: "Gafsa", latitude: 34.425, longitude: 8.7842, expected: "total" },
  { label: "Gabès", latitude: 33.8815, longitude: 10.0982, expected: "total" },
  { label: "Kairouan", latitude: 35.6781, longitude: 10.0963, expected: "total" },
  { label: "El Jem", latitude: 35.2981, longitude: 10.7069, expected: "total" },
  { label: "Houmt Souk (Djerba)", latitude: 33.8781, longitude: 10.775, expected: "total" },
  { label: "Mahdia", latitude: 35.5044, longitude: 11.0622, expected: "total" },
  { label: "Sousse", latitude: 35.8256, longitude: 10.636, expected: "partial" },
  { label: "Monastir", latitude: 35.778, longitude: 10.826, expected: "partial" },
  { label: "Sidi Bou Said", latitude: 36.8828, longitude: 10.1898, expected: "partial" },
  { label: "Carthage", latitude: 36.8528, longitude: 10.3233, expected: "partial" },
  { label: "Tunis", latitude: 36.8065, longitude: 10.1815, expected: "partial" },
  { label: "Hammamet", latitude: 36.4, longitude: 10.6333, expected: "partial" },
  { label: "Bizerte", latitude: 37.2744, longitude: 9.8739, expected: "partial" },
  { label: "Tabarka", latitude: 36.95, longitude: 8.75, expected: "partial" },
];

for (const place of tunisianLocations) {
  const result = localCircumstances(elements2027, {
    latitude: place.latitude,
    longitude: place.longitude,
  });
  checks += 1;
  const ok = result.kind === place.expected;
  if (!ok) failures += 1;
  console.log(
    `  [${ok ? "PASS" : "FAIL"}] ${place.label.padEnd(22)} ${row(result)}`,
  );
}
console.log("");

// ---------------------------------------------------------------------------
// 4. Physical consistency of the returned contact times.
// ---------------------------------------------------------------------------
console.log("4. Consistency of contact times");
const allResults: LocalCircumstances[] = [greatest];
for (const place of tunisianLocations) {
  allResults.push(
    localCircumstances(elements2027, {
      latitude: place.latitude,
      longitude: place.longitude,
    }),
  );
}

let orderingProblems = 0;
let durationProblems = 0;
for (const result of allResults) {
  if (!result.maximum) continue;
  const c1 = result.firstContact?.date.getTime();
  const c4 = result.fourthContact?.date.getTime();
  const mid = result.maximum.date.getTime();
  if (c1 === undefined || c4 === undefined) {
    orderingProblems += 1;
    continue;
  }
  if (!(c1 <= mid && mid <= c4)) orderingProblems += 1;

  if (result.secondContact && result.thirdContact) {
    const c2 = result.secondContact.date.getTime();
    const c3 = result.thirdContact.date.getTime();
    if (!(c1 <= c2 && c2 <= mid && mid <= c3 && c3 <= c4)) {
      orderingProblems += 1;
    }
    const span = (c3 - c2) / 1000;
    if (Math.abs(span - (result.centralDurationSeconds ?? 0)) > 0.001) {
      durationProblems += 1;
    }
  }
}
checks += 2;
if (orderingProblems > 0) failures += 1;
if (durationProblems > 0) failures += 1;
console.log(
  `  [${orderingProblems === 0 ? "PASS" : "FAIL"}] contact times ordered C1 ≤ C2 ≤ Mid ≤ C3 ≤ C4 for all ${allResults.length} locations`,
);
console.log(
  `  [${durationProblems === 0 ? "PASS" : "FAIL"}] reported duration equals C3 − C2 for every central location`,
);
console.log("");

// ---------------------------------------------------------------------------
// 5. Totality must never be reported while the Sun is below the horizon,
//    and the eclipse must never be reported where it cannot be seen.
// ---------------------------------------------------------------------------
console.log("5. Horizon and visibility rules");
let visibilityProblems = 0;
for (const place of tunisianLocations) {
  const result = localCircumstances(elements2027, {
    latitude: place.latitude,
    longitude: place.longitude,
  });
  if (result.kind !== "none" && !result.sunVisible) visibilityProblems += 1;
  if (result.kind === "total" && !result.centralPhaseVisible) {
    visibilityProblems += 1;
  }
}
checks += 1;
if (visibilityProblems > 0) failures += 1;
console.log(
  `  [${visibilityProblems === 0 ? "PASS" : "FAIL"}] every reported eclipse is visible from the ground with the Sun above the horizon`,
);

// A location far from the path must report no eclipse at all.
const nowhere = localCircumstances(elements2027, {
  latitude: 0,
  longitude: 0,
});
checks += 1;
const nowhereOk = nowhere.kind === "none";
if (!nowhereOk) failures += 1;
console.log(
  `  [${nowhereOk ? "PASS" : "FAIL"}] a location far from the path reports no eclipse (${nowhere.kind})`,
);
console.log("");

console.log(
  failures === 0
    ? `All ${checks} checks passed.`
    : `${failures} of ${checks} checks FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
