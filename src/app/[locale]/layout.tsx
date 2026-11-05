import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Cairo } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/lib/site";
import { LanguageProvider } from "@/context/language-context";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  localeDirections,
  locales,
  type Locale,
} from "@/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);
  const languages = Object.fromEntries(
    locales.map((item) => [item, `/${item}`]),
  ) as Record<string, string>;

  return {
    metadataBase: new URL("https://eclipse-tunisia.vercel.app"),
    title: {
      default: t.meta.title,
      template: `%s - ${site.name}`,
    },
    description: t.meta.description,
    keywords: [
      "total solar eclipse 2027",
      "Tunisia eclipse",
      "path of totality Tunisia",
      "eclipse Djerba",
      "eclipse Sfax",
      "eclipse Kerkennah",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: "website",
      locale:
        locale === "fr"
          ? "fr_FR"
          : locale === "ar"
            ? "ar_TN"
            : locale === "de"
              ? "de_DE"
              : locale === "it"
                ? "it_IT"
                : locale === "es"
                  ? "es_ES"
                  : "en_GB",
      url: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);
  const dir = localeDirections[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${cormorant.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            {t.common.skipToContent}
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
