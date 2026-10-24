import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, MapPin, X } from "lucide-react";
import { Container, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PackageCustomizer } from "@/components/packages/package-customizer";
import { getPackage, packages } from "@/data/packages";
import { getDestination } from "@/data/destinations";
import { getImage, imageCredit } from "@/data/images";
import { staysForDestination } from "@/data/stays";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { formatDuration, formatMoney } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Illustrative Eclipse Package`,
    description: pkg.summary,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const destination = getDestination(pkg.destinationSlug);
  if (!destination) notFound();

  const circumstances = circumstancesFor(destination);
  const asset = getImage(pkg.imageKey);
  const hotels = staysForDestination(pkg.destinationSlug);
  const duration = formatDuration(circumstances.centralDurationSeconds);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-ivory">
        <div className="absolute inset-0">
          <Image
            src={asset.url}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <Container className="relative py-14 sm:py-20">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-medium text-ivory/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All packages
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge tone="total">{pkg.nights} nights</Badge>
            <Badge tone="sample">Illustrative package</Badge>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {pkg.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
            {pkg.summary}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-ivory/50">
            Photo: {imageCredit(asset)} · Wikimedia Commons
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {pkg.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              The shape of the trip
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {pkg.area}. This outline is designed to be changed: add nights,
              choose a room, or move the whole idea into the planner. Nothing is
              held until a separate, human confirmation takes place.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Eclipse base
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {destination.name}
                </p>
              </div>
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Totality
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {duration ?? "Partial"}
                </p>
              </div>
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Illustrative base
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {formatMoney(pkg.basePricePerPerson, pkg.currency)}
                </p>
              </div>
            </div>
          </Card>

          <div className="rounded-2xl border border-gold-600/30 bg-gold/10 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Read this first
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              This is a demonstration itinerary. The price is illustrative, the
              hotels are not reserved, and no component is available to book or
              pay for here. Everything remains subject to separate confirmation,
              availability and current pricing.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {formatMoney(pkg.basePricePerPerson, pkg.currency)} per person is
              based on two sharing for {pkg.nights} nights and excludes
              international flights.
            </p>
          </div>
        </div>
      </Container>

      <Container className="pb-14 sm:pb-20">
        <PackageCustomizer pkg={pkg} />
      </Container>

      <Container className="grid gap-10 pb-14 lg:grid-cols-[1.1fr_0.9fr] sm:pb-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Day by day
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            A {pkg.nights}-night outline
          </h2>
          <ol className="mt-7 space-y-5">
            {pkg.itinerary.map((day) => (
              <li key={day.day} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-xs font-semibold text-gold">
                  {String(day.day).padStart(2, "0")}
                </span>
                <div className="border-b border-line pb-5">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {day.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {day.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              What is included
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {pkg.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Not included
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {pkg.excluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>

      <Container className="pb-14 sm:pb-20">
        <Card className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
            <div className="bg-navy p-6 text-ivory sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Eclipse circumstances
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {destination.name}, 2 August 2027
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                Computed from NASA GSFC Besselian elements in Africa/Tunis
                (UTC+1). Times are specific to this verified base, not a general
                country-wide claim.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: "First contact", value: circumstances.localTimes.firstContact },
                  { label: "Totality begins", value: circumstances.localTimes.secondContact },
                  { label: "Maximum", value: circumstances.localTimes.maximum },
                  { label: "Totality ends", value: circumstances.localTimes.thirdContact },
                  { label: "Last contact", value: circumstances.localTimes.fourthContact },
                  { label: "Sun altitude", value: `${circumstances.sunAltitude.toFixed(0)}°` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory/45">
                      {item.label}
                    </p>
                    <p className="mt-1 font-mono text-sm text-ivory">
                      {item.value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-clay">
                <MapPin className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Real hotels, separately
                </p>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                Check the stays yourself
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                These are real properties near this base. They are not included
                partners and no room is held. Use the official sites or current
                rate search before making any decision.
              </p>
              <ul className="mt-5 space-y-3">
                {hotels.map((hotel) => (
                  <li
                    key={hotel.slug}
                    className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{hotel.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{hotel.character}</p>
                    </div>
                    <a
                      href={hotel.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-semibold text-navy hover:underline"
                    >
                      Official site
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <ButtonLink href="/stays" variant="secondary" size="sm">
                  Compare all stays
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/plan">
            <CalendarDays className="h-4 w-4" />
            Build a day-by-day plan
          </ButtonLink>
          <ButtonLink href="/packages" variant="secondary">
            Compare another outline
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
