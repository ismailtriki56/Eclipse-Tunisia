import { en, type Dictionary } from "./locales/en";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";
import { defaultLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr,
  ar,
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
export { defaultLocale, locales, localeNames, localeLabels, localeDirections, isLocale, LOCALE_COOKIE } from "./config";
export type { Locale } from "./config";
