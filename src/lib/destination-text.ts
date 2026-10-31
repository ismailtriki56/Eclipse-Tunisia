import type { Destination } from "@/data/destinations";
import type { Dictionary } from "@/i18n";

export interface DestinationText {
  name: string;
  region: string;
  summary: string;
}

export function destinationText(
  t: Dictionary,
  destination: Destination,
): DestinationText {
  const localized = (
    t.destinationText as Record<string, DestinationText | undefined>
  )[destination.slug];

  return (
    localized ?? {
      name: destination.name,
      region: destination.region,
      summary: destination.summary,
    }
  );
}

export interface DestinationDetailText {
  access: string;
  facilities: string[];
  notes: string;
  practicalities: string[];
}

export function destinationDetail(
  t: Dictionary,
  destination: Destination,
): DestinationDetailText {
  const localized = (
    t.destinationDetail as Record<string, DestinationDetailText | undefined>
  )[destination.slug];

  return (
    localized ?? {
      access: destination.access,
      facilities: destination.facilities,
      notes: destination.notes,
      practicalities: destination.practicalities,
    }
  );
}

export function facilityText(t: Dictionary, facility: string): string {
  const localized = (t.facilityText as Record<string, string | undefined>)[
    facility
  ];
  return localized ?? facility;
}
