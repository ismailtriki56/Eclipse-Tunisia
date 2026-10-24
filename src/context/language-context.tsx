"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultLocale, localeDirections, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "eclipse-tunisia-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && (stored === "en" || stored === "fr" || stored === "ar")) {
        setLocaleState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const dir = localeDirections[locale];
    const html = document.documentElement;
    html.lang = locale;
    html.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: getDictionary(locale),
    dir: localeDirections[locale],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
