"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";
import { experiencesEnabled } from "@/lib/features";

export function SiteFooter() {
  const { t, locale } = useLanguage();

  const columns = [
    {
      title: t.footer.theEclipse,
      links: [
        { href: "/eclipse", label: t.footer.howEclipseWorks },
        { href: "/eclipse#timeline", label: t.footer.morningTimeline },
        { href: "/explorer", label: t.footer.explorer },
        { href: "/destinations", label: t.footer.destinations },
      ],
    },
    {
      title: t.footer.plan,
      links: [
        { href: "/packages", label: t.footer.packages },
        { href: "/stays", label: t.footer.stays },
        { href: "/flights", label: t.footer.flights },
        { href: "/plan", label: t.footer.itinerary },
        ...(experiencesEnabled
          ? [{ href: "/experiences", label: t.footer.experiences }]
          : []),
        { href: "/safety", label: t.footer.safety },
      ],
    },
    {
      title: t.footer.about,
      links: [
        { href: "/about", label: t.footer.aboutUs },
        { href: "/contact", label: t.footer.contact },
        { href: "/privacy", label: t.footer.privacy },
        { href: "/terms", label: t.footer.terms },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-gold/30 bg-navy text-ivory">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
              {t.footer.tagline}
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ivory/45">
              {t.footer.illustrative}
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(locale, link.href)}
                      className="text-sm text-ivory/70 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.copyrightYear} {t.footer.copyright}
          </p>
          <p>
            {t.footer.dataSource}:{" "}
            <a
              href={site.nasaEclipseUrl}
              className="underline underline-offset-2 hover:text-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.nasa}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
