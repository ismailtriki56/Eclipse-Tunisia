"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Logo } from "./logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { localePath } from "@/lib/locale-path";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  const home = pathname === localePath(locale, "/");
  const transparent = home && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabels: Record<string, string> = {
    "/eclipse": t.nav.eclipse,
    "/explorer": t.nav.explorer,
    "/destinations": t.nav.destinations,
    "/packages": t.nav.packages,
    "/stays": t.nav.stays,
    "/flights": t.nav.flights,
    "/plan": t.nav.plan,
  };

  return (
    <header
      className={cn(
        "z-50 transition-colors duration-300",
        home ? "fixed inset-x-0 top-0" : "sticky top-0",
        transparent
          ? "border-b border-white/15 bg-transparent"
          : "border-b border-line/80 bg-ivory/95 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo tone={transparent ? "light" : "dark"} />

        <nav aria-label={t.header.primaryNav} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const href = item.href as string;
              const localized = localePath(locale, href);
              const active =
                pathname === localized ||
                pathname.startsWith(localized + "/");
              return (
                <li key={href}>
                  <Link
                    href={localized}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-[2px] px-3 py-2 text-sm font-medium transition-colors",
                      transparent
                        ? active
                          ? "text-ivory"
                          : "text-ivory/75 hover:text-ivory"
                        : active
                          ? "text-navy"
                          : "text-muted hover:text-navy",
                    )}
                  >
                    {navLabels[href] || item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-px h-px bg-gold"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher tone={transparent ? "light" : "dark"} />
          <ButtonLink href="/plan" size="sm" variant={transparent ? "inverse" : "primary"}>
            {t.header.planTrip}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher tone={transparent ? "light" : "dark"} />
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-[2px] border transition-colors",
              transparent
                ? "border-white/30 text-ivory hover:border-gold"
                : "border-line text-navy hover:border-navy",
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{t.header.menu}</span>
            <div className="space-y-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-transform",
                  open && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-opacity",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-transform",
                  open && "-translate-y-2 -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-ivory xl:hidden">
          <nav aria-label={t.header.mobileNav} className="px-5 py-4">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => {
                const href = item.href as string;
                return (
                  <li key={href}>
                    <Link
                      href={localePath(locale, href)}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-black/5"
                    >
                      {navLabels[href] || item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 px-1">
              <ButtonLink
                href="/plan"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t.header.planTrip}
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
