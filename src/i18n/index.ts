import { en } from "./locales/en";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";
import { defaultLocale, type Locale } from "./config";

const dictionaries = {
  en,
  fr,
  ar,
} as const;

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export { defaultLocale, locales, localeNames, localeDirections } from "./config";
export type { Locale } from "./config";
