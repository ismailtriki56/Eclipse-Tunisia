import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/explorer", label: "Eclipse Explorer" },
      { href: "/experiences", label: "Experiences" },
      { href: "/plan", label: "Plan My Trip" },
      { href: "/safety", label: "Viewing Safety" },
    ],
  },
  {
    title: "For providers",
    links: [
      { href: "/providers", label: "List your experience" },
      { href: "/providers#how", label: "How it works" },
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
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              {site.tagline} A planning companion for the total solar eclipse
              of {site.eventDate} in Tunisia.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
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

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {site.copyrightYear} {site.name}. Eclipse viewing
            information should be confirmed against official sources.
          </p>
          <p>
            Astronomical data reference:{" "}
            <a
              href={site.nasaEclipseUrl}
              className="underline underline-offset-2 hover:text-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA Eclipse Resources
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
