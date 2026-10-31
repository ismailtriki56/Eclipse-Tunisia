import type { Experience, ExperienceCategory } from "@/data/experiences";
import type { Dictionary } from "@/i18n";

export interface ExperienceCopy {
  title: string;
  providerName: string;
  summary: string;
  includes: string[];
  excludes: string[];
}

export function experienceText(
  t: Dictionary,
  experience: Experience,
): ExperienceCopy {
  const localized =
    t.experienceText.items[
      experience.slug as keyof Dictionary["experienceText"]["items"]
    ];
  return localized ?? experience;
}

export function categoryText(
  t: Dictionary,
  category: ExperienceCategory,
): string {
  return t.experienceText.categories[category] ?? category;
}

export function priceBasisText(t: Dictionary, experience: Experience): string {
  return experience.priceBasis === "per person"
    ? t.experienceText.priceBasis.perPerson
    : t.experienceText.priceBasis.perGroup;
}
