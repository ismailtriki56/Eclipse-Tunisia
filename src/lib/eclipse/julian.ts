/**
 * Julian Day helpers.
 *
 * The eclipse engine works in Julian Days because the Besselian element
 * polynomials published by NASA are defined against a Julian epoch. These
 * helpers convert between Julian Days and JavaScript `Date` objects so the
 * rest of the application can stay in familiar calendar terms.
 *
 * All conversions here are proleptic Gregorian, which is what the eclipse
 * catalogue uses for dates from 1582 onwards.
 */

const J1970 = 2440587.5;
const J2000 = 2451545.0;
const DAY_MS = 86_400_000;

/** Julian Day (UTC) for a calendar date at 00:00. */
export function julianDayFromUTC(
  year: number,
  month: number,
  day: number,
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5
  );
}

/** Milliseconds since the Unix epoch for a given Julian Day. */
export function unixMsFromJulianDay(jd: number): number {
  return (jd - J1970) * DAY_MS;
}

/** Julian Day (UTC) for a given instant. */
export function julianDayFromDate(date: Date): number {
  return date.getTime() / DAY_MS + J1970;
}

/** Julian centuries since J2000.0 — used for secular terms when needed. */
export function julianCenturies(jd: number): number {
  return (jd - J2000) / 36525;
}

/** A calendar date expressed in UTC. */
export interface UtcDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/** Break a Julian Day into UTC calendar parts. */
export function utcPartsFromJulianDay(jd: number): UtcDateParts {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const dayWithFraction = b - d - Math.floor(30.6001 * e) + f;
  const day = Math.floor(dayWithFraction);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  let remainder = (dayWithFraction - day) * 24;
  const hour = Math.floor(remainder);
  remainder = (remainder - hour) * 60;
  const minute = Math.floor(remainder);
  const second = Math.floor((remainder - minute) * 60);

  return { year, month, day, hour, minute, second };
}
