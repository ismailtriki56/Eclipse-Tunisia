import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-shell";
import { Container, Card, SectionHeading } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveMap } from "@/components/map/interactive-map";
import { eclipseFacts } from "@/lib/eclipse/destinations";
import { site } from "@/lib/site";
import {
  Sun,
  Clock,
  ThermometerSun,
  Compass,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The 2027 Eclipse in Tunisia — Astronomical Science & Totality Path",
  description:
    "Comprehensive astronomical data, historical August weather patterns, contact timings and totality path science for the 2 August 2027 total solar eclipse across Tunisia.",
};

export default function EclipseInfoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Astronomical Overview"
        title="The Eclipse of the Century: 2 August 2027"
        description="On Monday, 2 August 2027, the umbral shadow of the Moon sweeps across southern Europe, North Africa, and the Middle East. Tunisia stands directly beneath maximum duration, offering more than 6 minutes of daytime darkness."
      />

      {/* Key Metric Banners */}
      <Container className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Max Totality
              </span>
              <Clock className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.centralDuration}
            </p>
            <p className="mt-1 text-xs text-muted">
              Longest total solar eclipse on land until the 22nd century.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Eclipse Magnitude
              </span>
              <Sun className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.magnitude.toFixed(3)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Moon diameter is 105.2% of Sun disc, ensuring deep corona visibility.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Path Width
              </span>
              <Compass className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.pathWidthKm} km
            </p>
            <p className="mt-1 text-xs text-muted">
              Umbral shadow corridor stretching across central & southern Tunisia.
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                August Clear Sky Rate
              </span>
              <ThermometerSun className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              &gt; 95%
            </p>
            <p className="mt-1 text-xs text-muted">
              Historical cloud probability under 5% across Saharan viewing points.
            </p>
          </Card>
        </div>

        {/* Interactive Map Section */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Interactive Path Explorer"
              title="Where the Umbra Crosses Tunisia"
              description="Explore real locations in Tunisia with verified coordinates. Toggle the path of totality to compare locations on the centre line against partial eclipse zones."
            />
            <ButtonLink href="/plan" variant="secondary" className="shrink-0">
              Build an Itinerary
            </ButtonLink>
          </div>
          <div className="mt-8">
            <InteractiveMap initialSlug="tozeur" />
          </div>
        </div>

        {/* Deep Dive Science Sections */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <Card className="p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-ink">
              Why 2027 is Called the &ldquo;Eclipse of the Century&rdquo;
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                Solar eclipses of Saros cycle 136 produce some of the longest totalities in
                human history (the same family that produced the legendary 1991 and 2009
                eclipses). During the August 2027 event, the Moon is exceptionally close
                to perigee (closest approach to Earth), while the Earth is near aphelion
                (furthest from the Sun).
              </p>
              <p>
                This celestial geometry maximizes the apparent angular diameter of the
                Moon relative to the Sun, producing a massive shadow cone that sweeps
                across North Africa at over 2,000 km/h. At its peak near Luxor, Egypt,
                totality will last 6 minutes and 23 seconds. Across Tunisia, viewing
                locations will experience between 2 and nearly 5 minutes of total midday
                darkness.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-sand/60 p-4 text-xs text-ink">
              <p className="font-semibold text-gold-600 uppercase tracking-wider">
                NASA Besselian Elements Standard
              </p>
              <p className="mt-1 text-muted">
                Every calculation on this platform is derived from the polynomial
                Besselian elements published by Fred Espenak and Jean Meeus in the{" "}
                <em>NASA Five Millennium Canon of Solar Eclipses</em>.
              </p>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-ink">
              August Weather & Atmospheric Conditions
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                Astronomers and eclipse meteorologists consider southern Tunisia one of
                the premier viewing grounds on the planet. August in the Sahara and the
                Chott el Jerid basin is characterized by stable subtropical high-pressure
                cells, virtually zero precipitation, and mean cloud cover below 4%.
              </p>
              <p>
                <strong>Observational Considerations:</strong>
              </p>
              <ul className="space-y-2 pl-4 list-disc text-muted">
                <li>
                  <strong>Sun Elevation:</strong> Over 65° to 70° altitude at maximum
                  eclipse, ensuring viewing near zenith with minimal atmospheric haze.
                </li>
                <li>
                  <strong>Midday Heat:</strong> August temperatures regularly exceed 40°C
                  (104°F). Adequate hydration, shade, and sun protection are critical.
                </li>
                <li>
                  <strong>Shadow Bands:</strong> The bright white salt crust of Chott el
                  Jerid provides an ideal canvas to observe high-contrast shadow bands
                  minutes before second contact (C2).
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs text-muted">Eye safety standards</span>
              <Link
                href="/safety"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-700"
              >
                Read viewing safety guidelines
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Totality vs Partial Comparison */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Viewing Location Strategy"
            title="Totality vs. 99% Partial: An Absolute Difference"
            description="A 99% partial eclipse is NOT 99% of the experience of a total eclipse. Understanding why being inside the path is mandatory."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-gold/60 bg-paper p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold-600 font-bold text-sm">
                  ✓
                </span>
                <h4 className="font-display text-xl font-semibold text-ink">
                  Inside the Path of Totality
                </h4>
              </div>
              <p className="mt-3 text-sm text-muted">
                Examples: <strong>Tozeur, Chott el Jerid, Gabès, Djerba, El Jem, Kairouan</strong>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80">
                <li className="flex gap-2">
                  <span className="text-gold font-bold">·</span>
                  <span>100% solar coverage; the solar corona becomes visible to the naked eye.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">·</span>
                  <span>Sky turns twilight dark, bright stars and planets (Venus, Jupiter) emerge.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">·</span>
                  <span>Temperature drops 4°C to 8°C; horizon glows with 360-degree sunset colors.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">·</span>
                  <span>Solar viewing glasses may be briefly removed <em>only</em> during totality.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10 text-danger font-bold text-sm">
                  !
                </span>
                <h4 className="font-display text-xl font-semibold text-ink">
                  Outside the Path (Deep Partial)
                </h4>
              </div>
              <p className="mt-3 text-sm text-muted">
                Examples: <strong>Tunis (97%), Carthage (96%), Sidi Bou Said (96%), Sousse (99%)</strong>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80">
                <li className="flex gap-2">
                  <span className="text-danger font-bold">·</span>
                  <span>Even at 99%, the remaining sliver of the photosphere is intensely bright.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-danger font-bold">·</span>
                  <span>The solar corona is completely invisible.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-danger font-bold">·</span>
                  <span>No sudden twilight drop; daylight dims slightly like an overcast day.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-danger font-bold">·</span>
                  <span>Certified solar filters MUST be worn at every second of viewing.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Authoritative References */}
        <div className="mt-16 rounded-2xl bg-navy p-8 text-ivory">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                Authoritative Astronomical Data
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold">
                Verified Scientific Sources
              </h3>
              <p className="mt-2 max-w-xl text-sm text-ivory/80">
                Access official technical data and interactive coordinates directly from
                the NASA Goddard Space Flight Center and astronomical bodies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={site.nasaEclipseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-ivory px-4 py-2.5 text-xs font-semibold text-navy hover:bg-sand transition-colors"
              >
                <span>NASA GSFC Catalogue</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={site.nasaMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-ivory hover:bg-white/20 transition-colors"
              >
                <span>NASA Interactive Map</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
