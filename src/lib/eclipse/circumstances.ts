/**
 * Local circumstances of a solar eclipse.
 *
 * This is a TypeScript implementation of the standard Besselian-element
 * method used by NASA's Five Millennium Canon of Solar Eclipses and by
 * Xavier Jubier's eclipse web tools (the algorithms the NASA GSFC eclipse
 * map itself uses).
 *
 * Given the published Besselian elements for an eclipse and an observer's
 * geographic position, the algorithm solves for:
 *
 *   C1  first contact   — the eclipse begins (partial phase starts)
 *   C2  second contact  — totality begins
 *   Mid maximum eclipse — the moment of deepest coverage
 *   C3  third contact   — totality ends
 *   C4  fourth contact  — the eclipse ends
 *
 * as well as the eclipse magnitude, the obscuration of the Sun's disc, the
 * duration of totality and the altitude and azimuth of the Sun.
 *
 * References:
 *   https://eclipse.gsfc.nasa.gov/SEcat5/beselm.html
 *   https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802
 *   https://eclipse.gsfc.nasa.gov/SEpubs/5MCSE.html
 */

import type { BesselianElements } from "./elements";
import { elements2027 } from "./elements";
import { julianDayFromUTC, unixMsFromJulianDay } from "./julian";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

/**
 * Constant used to convert ΔT (seconds) into the radians of hour angle that
 * the Besselian hour-angle term requires. It is the value used by the
 * NASA GSFC eclipse map and by Xavier Jubier's eclipse tools, so results
 * match the published official maps exactly.
 */
const DELTA_T_TO_RADIANS_DIVISOR = 13713.44;

/** Flattening factor used to convert geodetic latitude to geocentric latitude. */
const GEODETRIC_FACTOR = 0.99664719;

/** Mean equatorial radius of the Earth in metres. */
const EARTH_RADIUS_METRES = 6378140;

export type EclipseKind = "none" | "partial" | "total" | "annular";

export interface ObserverPosition {
  /** Geodetic latitude in degrees north. */
  latitude: number;
  /** Longitude in degrees east. */
  longitude: number;
  /** Altitude above sea level in metres. Defaults to 0. */
  altitude?: number;
}

export interface ContactTime {
  /** Absolute instant of the contact. */
  date: Date;
  /** Altitude of the Sun in degrees above the horizon (negative = below). */
  sunAltitude: number;
  /** Azimuth of the Sun in degrees clockwise from north. */
  sunAzimuth: number;
}

export interface LocalCircumstances {
  kind: EclipseKind;
  /** First contact (partial phase begins). */
  firstContact: ContactTime | null;
  /** Second contact (totality begins). Only for central eclipses. */
  secondContact: ContactTime | null;
  /** Maximum eclipse. */
  maximum: ContactTime | null;
  /** Third contact (totality ends). Only for central eclipses. */
  thirdContact: ContactTime | null;
  /** Fourth contact (partial phase ends). */
  fourthContact: ContactTime | null;
  /** Duration of the central (total or annular) phase in seconds. */
  centralDurationSeconds: number | null;
  /**
   * Eclipse magnitude at maximum, in the convention used by NASA's local
   * circumstances: the fraction of the Sun's *diameter* covered at the
   * instant of maximum eclipse. Values above 1 occur inside the path of
   * totality, where the Moon's disc is larger than the Sun's.
   */
  magnitude: number;
  /**
   * The ratio of the Moon's apparent diameter to the Sun's apparent
   * diameter at the observer. At the point of greatest eclipse this is the
   * value NASA publishes as the eclipse magnitude in its catalogue
   * (1.0790 for 2 August 2027).
   */
  diameterRatio: number;
  /** Obscuration at maximum: fraction of the Sun's *area* covered, 0–1. */
  obscuration: number;
  /** True when the Sun is above the horizon for at least part of the event. */
  sunVisible: boolean;
  /** True when the Sun is above the horizon throughout the central phase. */
  centralPhaseVisible: boolean;
}

/**
 * Working state for the iterative solution. Field meanings follow the
 * notation used in the Five Millennium Canon:
 *
 *   x, y   position of the shadow axis on the fundamental plane
 *   xi,eta,zeta  the observer's position on the fundamental plane
 *   u, v   offset of the observer from the shadow axis
 *   a, b   rate of change of u and v
 *   l1, l2 radius of the penumbral and umbral shadow on the observer's plane
 */
interface State {
  type: number;
  t: number;
  x: number;
  y: number;
  d: number;
  sinD: number;
  cosD: number;
  mu: number;
  dMu: number;
  dD: number;
  l1: number;
  l2: number;
  xi: number;
  eta: number;
  zeta: number;
  dXi: number;
  dEta: number;
  u: number;
  v: number;
  a: number;
  b: number;
  l1p: number;
  l2p: number;
  n2: number;
}

function createState(type: number, t: number): State {
  return {
    type,
    t,
    x: 0,
    y: 0,
    d: 0,
    sinD: 0,
    cosD: 1,
    mu: 0,
    dMu: 0,
    dD: 0,
    l1: 0,
    l2: 0,
    xi: 0,
    eta: 0,
    zeta: 0,
    dXi: 0,
    dEta: 0,
    u: 0,
    v: 0,
    a: 0,
    b: 0,
    l1p: 0,
    l2p: 0,
    n2: 0,
  };
}

/** Observer constants derived from the geographic position. */
interface ObserverConstants {
  latitudeRad: number;
  westLongitudeRad: number;
  rhoSinPhi: number;
  rhoCosPhi: number;
}

function observerConstants(position: ObserverPosition): ObserverConstants {
  const latitudeRad = position.latitude * D2R;
  const westLongitudeRad = -position.longitude * D2R;
  const altitude = position.altitude ?? 0;
  const phi = Math.atan(GEODETRIC_FACTOR * Math.tan(latitudeRad));
  const heightOverRadius = altitude / EARTH_RADIUS_METRES;
  return {
    latitudeRad,
    westLongitudeRad,
    rhoSinPhi:
      GEODETRIC_FACTOR * Math.sin(phi) +
      heightOverRadius * Math.sin(latitudeRad),
    rhoCosPhi:
      Math.cos(phi) + heightOverRadius * Math.cos(latitudeRad),
  };
}

function timeDependent(state: State, elements: BesselianElements): void {
  const { t } = state;

  let value = elements.x[3] * t + elements.x[2];
  value = value * t + elements.x[1];
  state.x = value * t + elements.x[0];
  state.a = 3 * elements.x[3] * t + 2 * elements.x[2];
  state.a = state.a * t + elements.x[1];

  value = elements.y[3] * t + elements.y[2];
  value = value * t + elements.y[1];
  state.y = value * t + elements.y[0];
  state.b = 3 * elements.y[3] * t + 2 * elements.y[2];
  state.b = state.b * t + elements.y[1];

  value = elements.d[2] * t + elements.d[1];
  value = (value * t + elements.d[0]) * D2R;
  state.d = value;
  state.sinD = Math.sin(value);
  state.cosD = Math.cos(value);
  state.dD = (2 * elements.d[2] * t + elements.d[1]) * D2R;

  value = elements.mu[2] * t + elements.mu[1];
  value = (value * t + elements.mu[0]) * D2R;
  state.mu = value;
  state.dMu = (2 * elements.mu[2] * t + elements.mu[1]) * D2R;

  if (state.type === -2 || state.type === 0 || state.type === 2) {
    value = elements.l1[2] * t + elements.l1[1];
    state.l1 = value * t + elements.l1[0];
  }
  if (state.type === -1 || state.type === 0 || state.type === 1) {
    value = elements.l2[2] * t + elements.l2[1];
    state.l2 = value * t + elements.l2[0];
  }
}

function timeAndLocationDependent(
  state: State,
  elements: BesselianElements,
  observer: ObserverConstants,
): void {
  timeDependent(state, elements);

  // Hour angle of the Sun at the observer. The ΔT term converts terrestrial
  // time to universal time; the divisor already yields radians.
  const deltaTRadians = elements.deltaTSeconds / DELTA_T_TO_RADIANS_DIVISOR;
  const h = state.mu - observer.westLongitudeRad - deltaTRadians;
  const sinH = Math.sin(h);
  const cosH = Math.cos(h);

  state.xi = observer.rhoCosPhi * sinH;
  state.eta =
    observer.rhoSinPhi * state.cosD -
    observer.rhoCosPhi * state.sinD * cosH;
  state.zeta =
    observer.rhoSinPhi * state.sinD +
    observer.rhoCosPhi * state.cosD * cosH;

  state.dXi = state.dMu * observer.rhoCosPhi * cosH;
  state.dEta = state.dMu * state.xi * state.sinD - state.zeta * state.dD;

  state.u = state.x - state.xi;
  state.v = state.y - state.eta;
  state.a = state.a - state.dXi;
  state.b = state.b - state.dEta;

  if (state.type === -2 || state.type === 0 || state.type === 2) {
    state.l1p = state.l1 - state.zeta * elements.tanF1;
  }
  if (state.type === -1 || state.type === 0 || state.type === 1) {
    state.l2p = state.l2 - state.zeta * elements.tanF2;
  }
  state.n2 = state.a * state.a + state.b * state.b;
}

/** Iterate to the moment of maximum eclipse for the observer. */
function solveMaximum(
  state: State,
  elements: BesselianElements,
  observer: ObserverConstants,
): void {
  timeAndLocationDependent(state, elements, observer);
  let delta = 1;
  let iterations = 0;
  while (Math.abs(delta) > 1e-6 && iterations < 60) {
    delta = (state.u * state.a + state.v * state.b) / state.n2;
    state.t -= delta;
    timeAndLocationDependent(state, elements, observer);
    iterations += 1;
  }
}

/** Iterate to a first/fourth contact (penumbral cone). */
function solvePenumbralContact(
  state: State,
  elements: BesselianElements,
  observer: ObserverConstants,
): void {
  timeAndLocationDependent(state, elements, observer);
  const sign = state.type < 0 ? -1 : 1;
  let delta = 1;
  let iterations = 0;
  while (Math.abs(delta) > 1e-6 && iterations < 60) {
    const n = Math.sqrt(state.n2);
    let ratio = (state.a * state.v - state.u * state.b) / n / state.l1p;
    ratio = ratio * ratio;
    if (ratio > 1) break;
    delta = sign * Math.sqrt(1 - ratio) * state.l1p / n;
    delta = (state.u * state.a + state.v * state.b) / state.n2 - delta;
    state.t -= delta;
    timeAndLocationDependent(state, elements, observer);
    iterations += 1;
  }
}

/** Iterate to a second/third contact (umbral cone). */
function solveUmbralContact(
  state: State,
  elements: BesselianElements,
  observer: ObserverConstants,
  midL2p: number,
): void {
  timeAndLocationDependent(state, elements, observer);
  let sign = state.type < 0 ? -1 : 1;
  if (midL2p < 0) sign = -sign;
  let delta = 1;
  let iterations = 0;
  while (Math.abs(delta) > 1e-6 && iterations < 60) {
    const n = Math.sqrt(state.n2);
    let ratio = (state.a * state.v - state.u * state.b) / n / state.l2p;
    ratio = ratio * ratio;
    if (ratio > 1) break;
    delta = sign * Math.sqrt(1 - ratio) * state.l2p / n;
    delta = (state.u * state.a + state.v * state.b) / state.n2 - delta;
    state.t -= delta;
    timeAndLocationDependent(state, elements, observer);
    iterations += 1;
  }
}

/** Altitude and azimuth of the Sun for a given state. */
function solarPosition(
  state: State,
  observer: ObserverConstants,
  elements: BesselianElements,
): { altitude: number; azimuth: number } {
  const sinLat = Math.sin(observer.latitudeRad);
  const cosLat = Math.cos(observer.latitudeRad);
  const deltaTRadians = elements.deltaTSeconds / DELTA_T_TO_RADIANS_DIVISOR;
  const h = state.mu - observer.westLongitudeRad - deltaTRadians;
  const sinH = Math.sin(h);
  const cosH = Math.cos(h);

  const altitude = Math.asin(
    state.sinD * sinLat + state.cosD * cosLat * cosH,
  );
  const azimuth = Math.atan2(
    -sinH * state.cosD,
    state.sinD * cosLat - cosH * sinLat * state.cosD,
  );
  return {
    altitude: altitude * R2D,
    azimuth: (azimuth * R2D + 360) % 360,
  };
}

/**
 * Fraction of the Sun's disc area hidden by the Moon at maximum eclipse.
 *
 * Uses the standard lens-area solution for two intersecting circles, as
 * used by NASA's local circumstances calculator.
 */
function obscurationAt(
  l1p: number,
  l2p: number,
  m: number,
  ratio: number,
): number {
  if (m <= 0) return 0;
  const denominator = l1p * l1p - l2p * l2p;
  if (denominator === 0) return 0;
  const c = Math.acos(
    Math.min(1, Math.max(-1, (l1p * l1p + l2p * l2p - 2 * m * m) / denominator)),
  );
  const b = Math.acos(
    Math.min(
      1,
      Math.max(-1, (l1p * l2p + m * m) / m / (l1p + l2p)),
    ),
  );
  const a = Math.PI - b - c;
  const area = (ratio * ratio * a + b - ratio * Math.sin(c)) / Math.PI;
  return Math.min(1, Math.max(0, area));
}

/**
 * Compute the local circumstances of the eclipse for one observer.
 */
export function localCircumstances(
  elements: BesselianElements,
  position: ObserverPosition,
): LocalCircumstances {
  const observer = observerConstants(position);

  const jdGreatestEclipseTT =
    julianDayFromUTC(elements.year, elements.month, elements.day) +
    elements.tdGreatestEclipseHours / 24;
  const jdEpochTT = jdGreatestEclipseTT - (elements.tdGreatestEclipseHours - elements.t0Hours) / 24;

  const toDate = (t: number): Date =>
    new Date(
      unixMsFromJulianDay(jdEpochTT + t / 24 - elements.deltaTSeconds / 86400),
    );

  const mid = createState(0, 0);
  solveMaximum(mid, elements, observer);

  const m = Math.sqrt(mid.u * mid.u + mid.v * mid.v);
  const ratio = (mid.l1p - mid.l2p) / (mid.l1p + mid.l2p);
  const magnitude = (mid.l1p - m) / (mid.l1p + mid.l2p);

  const empty: LocalCircumstances = {
    kind: "none",
    firstContact: null,
    secondContact: null,
    maximum: null,
    thirdContact: null,
    fourthContact: null,
    centralDurationSeconds: null,
    magnitude: 0,
    diameterRatio: ratio,
    obscuration: 0,
    sunVisible: false,
    centralPhaseVisible: false,
  };

  if (magnitude <= 0) return empty;

  const toContact = (state: State): ContactTime => {
    const { altitude, azimuth } = solarPosition(state, observer, elements);
    return { date: toDate(state.t), sunAltitude: altitude, sunAzimuth: azimuth };
  };

  // First and fourth contact.
  const n = Math.sqrt(mid.n2);
  let ratioTerm = (mid.a * mid.v - mid.u * mid.b) / n / mid.l1p;
  if (Math.abs(ratioTerm) > 1) return empty;
  let offset = Math.sqrt(1 - ratioTerm * ratioTerm) * mid.l1p / n;

  const c1 = createState(-2, mid.t - offset);
  const c4 = createState(2, mid.t + offset);
  solvePenumbralContact(c1, elements, observer);
  solvePenumbralContact(c4, elements, observer);

  const firstContact = toContact(c1);
  const fourthContact = toContact(c4);
  const maximum = toContact(mid);

  const sunVisible =
    firstContact.sunAltitude > 0 ||
    fourthContact.sunAltitude > 0 ||
    maximum.sunAltitude > 0;

  if (!sunVisible) {
    return { ...empty, maximum };
  }

  const isCentral = m < mid.l2p || m < -mid.l2p;
  if (!isCentral) {
    return {
      kind: "partial",
      firstContact,
      secondContact: null,
      maximum,
      thirdContact: null,
      fourthContact,
      centralDurationSeconds: null,
      magnitude,
      diameterRatio: ratio,
      obscuration: obscurationAt(mid.l1p, mid.l2p, m, ratio),
      sunVisible,
      centralPhaseVisible: false,
    };
  }

  // Second and third contact.
  ratioTerm = (mid.a * mid.v - mid.u * mid.b) / n / mid.l2p;
  if (Math.abs(ratioTerm) > 1) {
    return {
      kind: "partial",
      firstContact,
      secondContact: null,
      maximum,
      thirdContact: null,
      fourthContact,
      centralDurationSeconds: null,
      magnitude,
      diameterRatio: ratio,
      obscuration: obscurationAt(mid.l1p, mid.l2p, m, ratio),
      sunVisible,
      centralPhaseVisible: false,
    };
  }
  offset = Math.sqrt(1 - ratioTerm * ratioTerm) * mid.l2p / n;

  const c2 = createState(-1, mid.l2p < 0 ? mid.t + offset : mid.t - offset);
  const c3 = createState(1, mid.l2p < 0 ? mid.t - offset : mid.t + offset);
  solveUmbralContact(c2, elements, observer, mid.l2p);
  solveUmbralContact(c3, elements, observer, mid.l2p);

  const secondContact = toContact(c2);
  const thirdContact = toContact(c3);

  const centralPhaseVisible =
    secondContact.sunAltitude > 0 && thirdContact.sunAltitude > 0;

  const centralDurationSeconds = Math.abs(
    (thirdContact.date.getTime() - secondContact.date.getTime()) / 1000,
  );

  const total = mid.l2p < 0;

  return {
    kind: total ? "total" : "annular",
    firstContact,
    secondContact,
    maximum,
    thirdContact,
    fourthContact,
    centralDurationSeconds,
    magnitude,
    diameterRatio: ratio,
    // A total eclipse hides the whole disc of the Sun. For an annular
    // eclipse NASA's local circumstances use the ratio of the areas of the
    // two discs.
    obscuration: total ? 1 : ratio * ratio,
    sunVisible,
    centralPhaseVisible,
  };
}

/** Convenience wrapper: the local circumstances of the 2 August 2027 eclipse. */
export function localCircumstances2027(
  position: ObserverPosition,
): LocalCircumstances {
  return localCircumstances(elements2027, position);
}
