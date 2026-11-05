"use client";

import { useLanguage } from "@/context/language-context";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, setLocale, t } = useLanguage();
  const fullNames = {
    en: t.language.enFull,
    fr: t.language.frFull,
    ar: t.language.arFull,
    de: t.language.deFull,
    it: t.language.itFull,
    es: t.language.esFull,
  } as const;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-[2px] border px-1 py-1 text-xs shadow-sm",
        tone === "light"
          ? "border-white/25 bg-white/10 text-ivory backdrop-blur-sm"
          : "border-line bg-white/70",
      )}
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
            "rounded-[2px] px-2.5 py-1 font-medium transition-colors",
            locale === l
              ? tone === "light"
                ? "bg-ivory text-navy"
                : "bg-navy text-ivory"
              : tone === "light"
                ? "text-ivory/80 hover:text-ivory"
                : "text-muted hover:text-navy",
          )}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
