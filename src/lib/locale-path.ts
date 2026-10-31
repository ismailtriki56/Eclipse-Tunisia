import type { Locale } from "@/i18n/config";

/** Prefix an internal path with the active locale. External and hash links pass through. */
export function localePath(locale: Locale, href: string): string {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }
  if (href === "/") return `/${locale}`;
  const clean = href.startsWith("/") ? href : `/${href}`;
  if (clean === `/${locale}` || clean.startsWith(`/${locale}/`)) return clean;
  return `/${locale}${clean}`;
}

/** Remove a leading locale segment from a pathname. */
export function stripLocale(pathname: string, locale: Locale): string {
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1);
  }
  return pathname;
}
