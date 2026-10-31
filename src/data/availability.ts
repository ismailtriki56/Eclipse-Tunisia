export type AvailabilityStatus = "open" | "limited" | "sold_out";

export interface PackageAvailability {
  packageSlug: string;
  status: AvailabilityStatus;
}

/**
 * The single source of truth for illustrative package availability.
 *
 * These values are editorial placeholders for the demo. They are not live
 * inventory and must never be presented as a guaranteed room or seat.
 */
export const availability: Record<string, AvailabilityStatus> = {
  "mahdia-signature": "open",
  "djerba-total-totality": "limited",
  "sahara-eclipse-oasis": "open",
  "eclipse-breakfast": "open",
  "sfax-signature": "limited",
  "kerkennah-island-escape": "open",
};

export function availabilityFor(packageSlug: string): AvailabilityStatus {
  return availability[packageSlug] ?? "open";
}
