"use client";

import { useLanguage } from "@/context/language-context";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const fullNames = {
    en: t.language.enFull,
    fr: t.language.frFull,
    ar: t.language.arFull,
  } as const;

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-line bg-white/70 px-1 py-1 text-xs shadow-sm"
      role="group"
      aria-label={t.language.label}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          aria-label={`${t.language.label}: ${fullNames[l]}`}
          className={cn(
            "rounded-sm px-2.5 py-1 font-medium transition-colors",
            locale === l ? "bg-navy text-ivory" : "text-muted hover:text-navy",
          )}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
