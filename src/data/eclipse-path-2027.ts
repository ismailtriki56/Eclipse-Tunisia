/**
 * The path of totality for the total solar eclipse of 2 August 2027.
 *
 * Source: NASA GSFC — eclipse path data generated from the same Besselian
 * elements and VSOP87/ELP2000-82 ephemerides used for the official NASA
 * eclipse maps.
 *   https://eclipse.gsfc.nasa.gov/SEsearch/eclipse-path-data.js.php?Ecl=20270802&Spc=0.5
 *   https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802
 *
 * The three lines are the northern limit, the centre line and the southern
 * limit of the path of totality. Observers between the northern and
 * southern limits see a total eclipse; observers outside them see a partial
 * eclipse.
 *
 * The published data is sampled at half-degree intervals along the path.
 */

export interface PathLineProperties {
  id: "northern-limit" | "central-line" | "southern-limit";
  label: string;
  description: string;
}

export interface PathLine {
  type: "Feature";
  properties: PathLineProperties;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export interface PathFeatureCollection {
  type: "FeatureCollection";
  metadata: {
    source: string;
    sourceUrl: string;
    referencePage: string;
    greatestEclipse: { latitude: number; longitude: number };
    copyright: string;
  };
  features: PathLine[];
}

export const eclipsePath2027 = {
  type: "FeatureCollection",
  metadata: {
    source:
      "NASA GSFC / Fred Espenak, Five Millennium Canon of Solar Eclipses",
    sourceUrl:
      "https://eclipse.gsfc.nasa.gov/SEsearch/eclipse-path-data.js.php?Ecl=20270802&Spc=0.5",
    referencePage:
      "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    greatestEclipse: { latitude: 25.50236, longitude: 33.19617 },
    copyright:
      "Eclipse Predictions by Fred Espenak (NASA's GSFC). Permission is freely granted to reproduce this data when accompanied by an acknowledgment.",
  },
  features: [],
} as unknown as PathFeatureCollection;

import { pathData } from "./eclipse-path-2027.coordinates";

eclipsePath2027.features = pathData as PathLine[];

export function pathLine(
  id: PathLineProperties["id"],
): PathLine {
  const line = eclipsePath2027.features.find(
    (feature) => feature.properties.id === id,
  );
  if (!line) {
    throw new Error(`Missing path line: ${id}`);
  }
  return line;
}

/**
 * Interpolate the latitude of a published path line at a given longitude.
 */
export function latitudeAtLongitude(
  id: PathLineProperties["id"],
  longitude: number,
): number | null {
  const coordinates = pathLine(id).geometry.coordinates;
  for (let index = 0; index < coordinates.length - 1; index += 1) {
    const [lngA, latA] = coordinates[index];
    const [lngB, latB] = coordinates[index + 1];
    if (lngA <= longitude && longitude <= lngB) {
      if (lngB === lngA) return latA;
      const ratio = (longitude - lngA) / (lngB - lngA);
      return latA + ratio * (latB - latA);
    }
  }
  return null;
}
