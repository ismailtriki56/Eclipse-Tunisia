"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isLocale,
  localeDirections,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirections[locale];
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    try {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // ignore
    }
    const segments = (pathname || "/").split("/");
    if (isLocale(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || `/${newLocale}`);
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
