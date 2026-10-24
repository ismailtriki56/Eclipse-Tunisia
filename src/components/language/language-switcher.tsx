"use client";

import { useLanguage } from "@/context/language-context";
import { localeNames, locales } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-white/70 px-1 py-1 text-xs shadow-sm">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium transition-colors",
            locale === l
              ? "bg-navy text-ivory"
              : "text-muted hover:text-navy",
          )}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}
