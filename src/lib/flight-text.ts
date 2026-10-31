import type { Airport } from "@/data/flights";
import type { Dictionary } from "@/i18n";

export interface AirportCopy {
  name: string;
  city: string;
  role: string;
  bestFor: string;
  note: string;
}

export function airportText(t: Dictionary, airport: Airport): AirportCopy {
  const localized =
    t.flightText.airports[
      airport.iata as keyof Dictionary["flightText"]["airports"]
    ];
  return localized ?? airport;
}

export function originText(
  t: Dictionary,
  iata: string,
  fallback: string,
): string {
  const origins = t.flightText.origins as Record<string, string>;
  return origins[iata] ?? fallback;
}
