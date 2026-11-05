import { en, type Dictionary } from "./locales/en";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";
import { de } from "./locales/de";
import { it } from "./locales/it";
import { es } from "./locales/es";
import { defaultLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr,
  ar,
  de,
  it,
  es,
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
export { defaultLocale, locales, localeNames, localeLabels, localeDirections, isLocale, LOCALE_COOKIE } from "./config";
export type { Locale } from "./config";
