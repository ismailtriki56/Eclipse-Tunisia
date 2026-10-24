import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const columns = [
  {
    title: "The eclipse",
    links: [
      { href: "/eclipse", label: "How the eclipse works" },
      { href: "/eclipse#timeline", label: "The morning timeline" },
      { href: "/explorer", label: "Eclipse Explorer" },
      { href: "/destinations", label: "Destinations" },
    ],
  },
  {
    title: "Plan",
    links: [
      { href: "/packages", label: "Eclipse packages" },
      { href: "/stays", label: "Stays" },
      { href: "/flights", label: "Flights" },
      { href: "/plan", label: "Build your itinerary" },
      { href: "/experiences", label: "Experiences" },
      { href: "/safety", label: "Viewing safety" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About Eclipse Tunisia" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-ivory">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
              {site.tagline} Every figure on this site is computed from the
              NASA GSFC eclipse catalogue, and every photograph is licensed
              for reuse with attribution.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ivory/45">
              Packages, prices and campaigns are illustrative demonstrations,
              not live offers. Hotel and flight links lead to independent
              third-party sites.
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
                      href={link.href}
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
            &copy; {site.copyrightYear} {site.name}. Eclipse viewing
            information should always be confirmed against official sources.
          </p>
          <p>
            Astronomical data reference:{" "}
            <a
              href={site.nasaEclipseUrl}
              className="underline underline-offset-2 hover:text-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA GSFC Eclipse Catalogue
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
