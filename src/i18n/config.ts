export const locales = ["en", "fr", "ar", "de", "it", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
  de: "ltr",
  it: "ltr",
  es: "ltr",
};

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
  de: "DE",
  it: "IT",
  es: "ES",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
