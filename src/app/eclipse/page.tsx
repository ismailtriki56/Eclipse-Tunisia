import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, Card, SectionHeading } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveMap } from "@/components/map/interactive-map";
import { eclipseFacts, allCircumstances } from "@/lib/eclipse/destinations";
import { site } from "@/lib/site";
import {
  Sun,
  Clock,
  Compass,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The 2027 Eclipse in Tunisia - Verified Local Times",
  description:
    "Verified location-specific totality times for Tunisia on 2 August 2027, computed from NASA Besselian elements.",
};

function formatDurationSec(seconds: number | null) {
  if (seconds == null) return "-";
  const totalSec = Math.round(seconds);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return String(s) + " s";
  return String(m) + " min " + String(s) + " s";
}

export default function EclipseInfoPage() {
  const all = allCircumstances().filter((c) => c.visibility === "total");

  return (
    <>
      <PageHeader
        eyebrow="Astronomical Overview"
        title="The 2027 Total Solar Eclipse in Tunisia"
        description="On Monday, 2 August 2027, the Moon's umbral shadow crosses southern Tunisia. This page focuses on Tunisia with verified local (Africa/Tunis) times."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Greatest eclipse (global)
              </span>
              <Clock className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              10:06:34 UT
            </p>
            <p className="mt-1 text-xs text-muted">
              11:06:34 Tunis time (UTC+1). Eclipse occurs in the morning in Tunisia.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Eclipse magnitude
              </span>
              <Sun className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.magnitude.toFixed(3)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Moon apparent diameter exceeds the Sun at greatest eclipse.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Maximum path width
              </span>
              <Compass className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.pathWidthKm} km
            </p>
            <p className="mt-1 text-xs text-muted">
              Corridor width at greatest eclipse.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Source
              </span>
              <ExternalLink className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">
              NASA GSFC
            </p>
            <a
              href={site.nasaEclipseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700"
            >
              View NASA data <ExternalLink className="h-3 w-3" />
            </a>
          </Card>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Verified local times"
              title="Totality in Tunisia (Africa/Tunis)"
              description="Times below are location-specific. Durations differ across destinations."
            />
            <ButtonLink href="/plan" variant="secondary" className="shrink-0">
              Build an Itinerary
            </ButtonLink>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-sand/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Start of partial</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Totality start</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Maximum</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Totality end</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">End of partial</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Totality duration</th>
                </tr>
              </thead>
              <tbody>
                {all.map((c, idx) => (
                  <tr key={c.destination.slug} className={idx % 2 === 0 ? "bg-white" : "bg-ivory/40"}>
                    <td className="px-4 py-3 font-medium text-ink">{c.destination.name}</td>
                    <td className="px-4 py-3 text-muted">{c.localTimes.firstContact || "-"}</td>
                    <td className="px-4 py-3 text-muted">{c.localTimes.secondContact || "-"}</td>
                    <td className="px-4 py-3 text-muted">{c.localTimes.maximum || "-"}</td>
                    <td className="px-4 py-3 text-muted">{c.localTimes.thirdContact || "-"}</td>
                    <td className="px-4 py-3 text-muted">{c.localTimes.fourthContact || "-"}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{formatDurationSec(c.centralDurationSeconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">All times are in Africa/Tunis (UTC+1).</p>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Interactive Path Explorer"
              title="Where the Umbra Crosses Tunisia"
              description="Explore verified locations with the path of totality."
            />
            <ButtonLink href="/plan" variant="secondary" className="shrink-0">
              Build an Itinerary
            </ButtonLink>
          </div>
          <div className="mt-8">
            <InteractiveMap initialSlug="djerba" />
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-card">
          <h3 className="font-display text-xl font-semibold text-ink">Sources</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><a href="https://www.timeanddate.com/eclipse/in/tunisia?iso=20270802" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1">Timeanddate.com - Eclipse in Tunisia <ExternalLink className="h-3 w-3" /></a></li>
            <li><a href="https://www.timeanddate.com/eclipse/in/tunisia/mahdia?iso=20270802" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1">Timeanddate.com - Mahdia <ExternalLink className="h-3 w-3" /></a></li>
            <li><a href="https://www.timeanddate.com/eclipse/in/tunisia/houmt-souk-djerba?iso=20270802" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1">Timeanddate.com - Houmt Souk (Djerba) <ExternalLink className="h-3 w-3" /></a></li>
            <li><a href="https://science.nasa.gov/eclipses/future-eclipses/" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1">NASA - Future eclipses <ExternalLink className="h-3 w-3" /></a></li>
            <li><a href={site.nasaEclipseUrl} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1">NASA GSFC - Eclipse data <ExternalLink className="h-3 w-3" /></a></li>
          </ul>
        </div>
      </Container>
    </>
  );
}
