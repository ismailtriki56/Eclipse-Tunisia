export const ECLIPSE_DATE = "2027-08-02";

const FALLBACK_RANGE = [
  "2027-07-31",
  "2027-08-01",
  "2027-08-02",
  "2027-08-03",
  "2027-08-04",
];

export function getDatesInRange(startStr: string, endStr: string): string[] {
  const [sy, sm, sd] = startStr.split("-").map(Number);
  const [ey, em, ed] = endStr.split("-").map(Number);

  if ([sy, sm, sd, ey, em, ed].some((value) => Number.isNaN(value))) {
    return [...FALLBACK_RANGE];
  }

  const startUtc = Date.UTC(sy, sm - 1, sd);
  const endUtc = Date.UTC(ey, em - 1, ed);
  const diffDays = Math.round((endUtc - startUtc) / 86_400_000);

  if (diffDays < 0) {
    return [new Date(startUtc).toISOString().slice(0, 10)];
  }

  const safeDays = Math.max(1, Math.min(14, diffDays + 1));
  const dates: string[] = [];

  for (let index = 0; index < safeDays; index += 1) {
    dates.push(new Date(startUtc + index * 86_400_000).toISOString().slice(0, 10));
  }

  return dates;
}

export function addDays(dateStr: string, daysToAdd = 1): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + daysToAdd))
    .toISOString()
    .slice(0, 10);
}
