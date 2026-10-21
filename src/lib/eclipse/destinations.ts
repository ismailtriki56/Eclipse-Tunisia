/**
 * Eclipse circumstances for the published destination list.
 *
 * The numbers returned here are computed by the Besselian-element engine in
 * this folder, using the NASA published elements for the 2 August 2027
 * eclipse. `npm run verify:eclipse` proves that the engine reproduces
 * NASA's published catalogue values and path limits, so these figures can
 * be presented as authoritative.
 *
 * Source: https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802
 */

import { destinations, type Destination } from "@/data/destinations";
import {
  localCircumstances,
  type ContactTime,
  type EclipseKind,
  type LocalCircumstances,
} from "./circumstances";
import { elements2027 } from "./elements";

export type Visibility = "total" | "partial" | "none";

export interface DestinationCircumstances {
  destination: Destination;
  kind: EclipseKind;
  visibility: Visibility;
  /** Raw engine output. */
  raw: LocalCircumstances;
  /** Contact instants in UTC. */
  firstContact: Date | null;
  secondContact: Date | null;
  maximum: Date | null;
  thirdContact: Date | null;
  fourthContact: Date | null;
  /** Contact instants formatted in the destination's own time zone. */
  localTimes: {
    firstContact: string | null;
    secondContact: string | null;
    maximum: string | null;
    thirdContact: string | null;
    fourthContact: string | null;
  };
  /** Duration of totality or annularity, in seconds. */
  centralDurationSeconds: number | null;
  /** Fraction of the Sun's diameter covered. */
  magnitude: number;
  /** Fraction of the Sun's area covered. */
  obscuration: number;
  /** Ratio of the Moon's apparent diameter to the Sun's. */
  diameterRatio: number;
  /** Altitude of the Sun at maximum eclipse, in degrees. */
  sunAltitude: number;
  /** Azimuth of the Sun at maximum eclipse, in degrees. */
  sunAzimuth: number;
}

const timeFormatterCache = new Map<string, Intl.DateTimeFormat>();

function timeFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = timeFormatterCache.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });
  timeFormatterCache.set(timeZone, formatter);
  return formatter;
}

/** Local wall-clock time of a contact, e.g. "10:06:34". */
export function localTime(
  contact: ContactTime | Date | null,
  timeZone: string,
): string | null {
  if (!contact) return null;
  const date = contact instanceof Date ? contact : contact.date;
  try {
    return timeFormatter(timeZone).format(date);
  } catch {
    return null;
  }
}

function visibilityFor(kind: EclipseKind, raw: LocalCircumstances): Visibility {
  if (kind === "total" || kind === "annular") {
    return raw.centralPhaseVisible ? "total" : "partial";
  }
  if (kind === "partial") return "partial";
  return "none";
}

export function circumstancesFor(
  destination: Destination,
): DestinationCircumstances {
  const raw = localCircumstances(elements2027, {
    latitude: destination.latitude,
    longitude: destination.longitude,
  });

  const { timeZone } = destination;

  return {
    destination,
    kind: raw.kind,
    visibility: visibilityFor(raw.kind, raw),
    raw,
    firstContact: raw.firstContact?.date ?? null,
    secondContact: raw.secondContact?.date ?? null,
    maximum: raw.maximum?.date ?? null,
    thirdContact: raw.thirdContact?.date ?? null,
    fourthContact: raw.fourthContact?.date ?? null,
    localTimes: {
      firstContact: localTime(raw.firstContact, timeZone),
      secondContact: localTime(raw.secondContact, timeZone),
      maximum: localTime(raw.maximum, timeZone),
      thirdContact: localTime(raw.thirdContact, timeZone),
      fourthContact: localTime(raw.fourthContact, timeZone),
    },
    centralDurationSeconds: raw.centralDurationSeconds,
    magnitude: raw.magnitude,
    obscuration: raw.obscuration,
    diameterRatio: raw.diameterRatio,
    sunAltitude: raw.maximum?.sunAltitude ?? 0,
    sunAzimuth: raw.maximum?.sunAzimuth ?? 0,
  };
}

/** Circumstances for every destination, in the order the list declares. */
export function allCircumstances(): DestinationCircumstances[] {
  return destinations.map(circumstancesFor);
}

/** Destinations that see a total eclipse, longest totality first. */
export function totalityDestinations(): DestinationCircumstances[] {
  return allCircumstances()
    .filter((item) => item.visibility === "total")
    .sort(
      (a, b) =>
        (b.centralDurationSeconds ?? 0) - (a.centralDurationSeconds ?? 0),
    );
}

/** Destinations that see a partial eclipse, deepest coverage first. */
export function partialDestinations(): DestinationCircumstances[] {
  return allCircumstances()
    .filter((item) => item.visibility === "partial")
    .sort((a, b) => b.magnitude - a.magnitude);
}

/** The official, verified facts about the eclipse itself. */
export const eclipseFacts = {
  date: "2 August 2027",
  greatestEclipseUT: "10:06:34 UT",
  greatestEclipseLocal: "11:06:34 Tunis time (UTC+1)",
  magnitude: 1.079,
  gamma: 0.1421,
  pathWidthKm: 257.7,
  centralDuration: "6 min 23 s",
  saros: 136,
  source: "NASA GSFC (Fred Espenak), Five Millennium Canon of Solar Eclipses",
  sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802",
} as const;
