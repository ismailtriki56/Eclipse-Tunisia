import type { TravelPackage } from "@/data/packages";

export interface PackageQuoteInput {
  nights: number;
  travellers: number;
  roomId: string;
  addOnIds: string[];
}

export interface PackagePlannerInput extends PackageQuoteInput {
  startDate?: string;
  familyFriendly?: boolean;
}

export interface PackageQuoteLine {
  label: string;
  detail: string;
  amount: number;
}

export interface PackageQuote {
  perPerson: number;
  total: number;
  singleSupplement: number;
  lines: PackageQuoteLine[];
}

export function quotePackage(
  pkg: TravelPackage,
  input: PackageQuoteInput,
): PackageQuote {
  const nights = Math.max(1, Math.round(input.nights));
  const travellers = Math.max(1, Math.round(input.travellers));
  const room = pkg.roomOptions.find((option) => option.id === input.roomId);
  const addOns = pkg.addOns.filter((addOn) => input.addOnIds.includes(addOn.id));
  const nightsDelta = (nights - pkg.nights) * pkg.nightlyAdjustment;
  const roomDelta = room?.priceDelta ?? 0;
  const addOnTotal = addOns.reduce(
    (total, addOn) => total + addOn.pricePerPerson,
    0,
  );
  const perPerson =
    pkg.basePricePerPerson + nightsDelta + roomDelta + addOnTotal;
  const singleSupplement = travellers === 1 ? pkg.singleSupplement : 0;
  const total = perPerson * travellers + singleSupplement;

  const lines: PackageQuoteLine[] = [
    {
      label: `${pkg.nights}-night base package`,
      detail: "Per person, double or twin share",
      amount: pkg.basePricePerPerson,
    },
  ];

  if (nightsDelta !== 0) {
    lines.push({
      label: nightsDelta > 0 ? "Additional nights" : "Fewer nights",
      detail: `${Math.abs(nights - pkg.nights)} night${Math.abs(nights - pkg.nights) === 1 ? "" : "s"} at the illustrative nightly rate`,
      amount: nightsDelta,
    });
  }

  if (roomDelta !== 0) {
    lines.push({
      label: room?.label ?? "Room upgrade",
      detail: "Per person, subject to availability",
      amount: roomDelta,
    });
  }

  for (const addOn of addOns) {
    lines.push({
      label: addOn.label,
      detail: "Per person",
      amount: addOn.pricePerPerson,
    });
  }

  if (singleSupplement > 0) {
    lines.push({
      label: "Single supplement",
      detail: "One supplement per solo traveller",
      amount: singleSupplement,
    });
  }

  return {
    perPerson,
    total,
    singleSupplement,
    lines,
  };
}

export function packagePlannerHref(
  pkg: TravelPackage,
  input: PackagePlannerInput,
): string {
  const startDate = input.startDate ?? "2027-07-30";
  const end = new Date(`${startDate}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() + Math.max(1, Math.round(input.nights)));
  const params = new URLSearchParams({
    addDest: pkg.destinationSlug,
    startDate,
    endDate: end.toISOString().slice(0, 10),
    groupSize: String(input.travellers),
    eclipsePreference: "totality",
    pace: input.familyFriendly ? "relaxed" : "moderate",
    budget: pkg.basePricePerPerson >= 1500 ? "luxury" : "moderate",
  });
  if (input.familyFriendly) params.set("family", "1");
  return `/plan?${params.toString()}`;
}
