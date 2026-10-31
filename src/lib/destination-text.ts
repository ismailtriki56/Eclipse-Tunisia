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
