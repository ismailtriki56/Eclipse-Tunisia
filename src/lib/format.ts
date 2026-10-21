/**
 * Formatting helpers.
 *
 * Money is stored as an integer/decimal amount plus an explicit ISO-4217
 * currency code. Never assume a single global currency (see spec §5.12).
 */

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: string, locale: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  const cached = currencyFormatterCache.get(key);
  if (cached) return cached;
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  currencyFormatterCache.set(key, formatter);
  return formatter;
}

export function formatMoney(
  amount: number,
  currency: string,
  locale = "en-GB",
): string {
  try {
    return currencyFormatter(currency, locale).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/**
 * Format an eclipse contact time for a specific IANA time zone.
 * Returns null when the input is null so callers can show an explicit
 * "not applicable" state rather than a fabricated time.
 */
export function formatTimeInZone(
  iso: string | null,
  timeZone: string,
  locale = "en-GB",
): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(date);
  } catch {
    return null;
  }
}

export function formatDuration(seconds: number | null): string | null {
  if (seconds === null) return null;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) return `${remaining}s`;
  if (remaining === 0) return `${minutes} min`;
  return `${minutes} min ${remaining}s`;
}

export function formatHours(hours: number): string {
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}
