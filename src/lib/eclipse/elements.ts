/**
 * Besselian elements for the total solar eclipse of 2 August 2027.
 *
 * Source: NASA GSFC — Eclipse Predictions by Fred Espenak
 *   https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802
 *   https://eclipse.gsfc.nasa.gov/SEcat5/beselm.html
 *
 * These are the published Five Millennium Canon of Solar Eclipses elements.
 * They are used with the VSOP87/ELP2000-82 ephemerides and a value of
 * ΔT = 76 s, exactly as NASA states on the eclipse data page.
 *
 * The elements describe the geometry of the Moon's shadow relative to the
 * Earth's fundamental plane. From them the local circumstances of the
 * eclipse (contact times, duration of totality, magnitude, obscuration and
 * the Sun's altitude) can be derived for any observer on the globe.
 *
 * Nothing in this file is hand-tuned or estimated: every number is taken
 * from the published catalogue.
 */

export interface BesselianElements {
  /** Calendar date of the eclipse in UTC. */
  year: number;
  month: number;
  day: number;
  /**
   * Time of greatest eclipse, in Terrestrial Dynamical Time, as decimal hours.
   * NASA lists this as 10:07:50 TD.
   */
  tdGreatestEclipseHours: number;
  /** ΔT (TT − UT) in seconds, as used by the published predictions. */
  deltaTSeconds: number;
  /**
   * Reference epoch `t0` for the polynomial elements, in decimal hours of
   * Terrestrial Dynamical Time. The published tables use a convenient round
   * hour close to the moment of greatest eclipse.
   */
  t0Hours: number;
  /** x polynomial coefficients (Earth radii). */
  x: [number, number, number, number];
  /** y polynomial coefficients (Earth radii). */
  y: [number, number, number, number];
  /** Declination of the Sun polynomial coefficients (degrees). */
  d: [number, number, number];
  /** Hour angle of the Sun polynomial coefficients (degrees). */
  mu: [number, number, number];
  /** Radius of the Moon's penumbra on the fundamental plane (Earth radii). */
  l1: [number, number, number];
  /** Radius of the Moon's umbra on the fundamental plane (Earth radii). */
  l2: [number, number, number];
  /** tan f1 — the cone factor of the penumbral shadow. */
  tanF1: number;
  /** tan f2 — the cone factor of the umbral shadow. */
  tanF2: number;
}

export const elements2027: BesselianElements = {
  year: 2027,
  month: 8,
  day: 2,
  tdGreatestEclipseHours: 10 + 7 / 60 + 50 / 3600,
  deltaTSeconds: 76,
  t0Hours: 10,
  x: [-0.019772, 0.54471231, -0.0000446, -0.00000922],
  y: [0.160061, -0.2111582, -0.0001217, 0.00000376],
  d: [17.76247025, -0.010181, -0.000004],
  mu: [328.42254639, 15.00209999, 0],
  l1: [0.53059602, 0.0000138, -0.0000128],
  l2: [-0.015464, 0.0000137, -0.0000128],
  tanF1: 0.0046064,
  tanF2: 0.0045834,
};

/**
 * Catalogue facts for the same eclipse, taken from the NASA GSFC eclipse
 * data page (https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802).
 */
export const catalogueFacts2027 = {
  type: "Total solar eclipse" as const,
  /** "Greatest Eclipse (=10:6:34 UT)". */
  greatestEclipseUT: "10:06:34 UT",
  greatestEclipseLatitude: 25.50236,
  greatestEclipseLongitude: 33.19617,
  gamma: 0.1421,
  magnitude: 1.079,
  pathWidthKm: 257.7,
  centralDurationSeconds: 382.6,
  sunAltitudeAtGreatest: 81.7,
  sunAzimuthAtGreatest: 202,
  saros: 136,
  lunationNumber: 341,
  deltaTSeconds: 76,
  ephemerides: "VSOP87/ELP2000-82",
} as const;
