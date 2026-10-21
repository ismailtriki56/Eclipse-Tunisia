import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-shell";
import { Container, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { destinations, getDestination } from "@/data/destinations";
import { getImage, imageCredit } from "@/data/images";
import { circumstancesFor } from "@/lib/eclipse/destinations";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return {};
  return {
    title: `${destination.name} — Total solar eclipse 2027`,
    description: destination.summary,
  };
}

function formatTotality(seconds: number | null): string | null {
  if (seconds === null) return null;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes} min ${rest} s`;
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();
  const circumstances = circumstancesFor(destination);
  const asset = getImage(destination.imageKey);
  const totality = formatTotality(circumstances.centralDurationSeconds);
  const isTotal = circumstances.visibility === "total";

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title={destination.name}
        description={destination.summary}
      />

      <Container className="pb-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <figure className="relative overflow-hidden rounded-2xl bg-sand shadow-card">
            <Image
              src={asset.url}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-navy/70 to-transparent px-5 pb-4 pt-10 text-[0.7rem] text-ivory/80">
              <a
                href={asset.page}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {imageCredit(asset)}
              </a>
              <span>· Wikimedia Commons</span>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-6">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {destination.region}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
                    Eclipse circumstances
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Computed from NASA Besselian elements · Africa/Tunis (UTC+1)
                  </p>
                </div>
                {isTotal ? (
                  <Badge tone="total">Totality {totality}</Badge>
                ) : (
                  <Badge tone="partial">
                    Partial · {(circumstances.obscuration * 100).toFixed(0)}%
                    covered
                  </Badge>
                )}
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "C1 (first contact)", value: circumstances.localTimes.firstContact },
                  { label: "C2 (start of totality)", value: circumstances.localTimes.secondContact },
                  { label: "Maximum eclipse", value: circumstances.localTimes.maximum },
                  { label: "C3 (end of totality)", value: circumstances.localTimes.thirdContact },
                  { label: "C4 (last contact)", value: circumstances.localTimes.fourthContact },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
                  >
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="font-mono text-sm text-ink">
                      {item.value ?? "—"}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-navy px-4 py-4 text-ivory">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                    Magnitude
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    {circumstances.magnitude.toFixed(3)}
                  </p>
                </div>
                <div className="rounded-xl border border-line px-4 py-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Diameter ratio
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">
                    {circumstances.diameterRatio.toFixed(4)}
                  </p>
                </div>
                <div className="rounded-xl border border-line px-4 py-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Obscuration
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">
                    {(circumstances.obscuration * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                Notes on this location
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                {(Array.isArray(destination.notes)
                  ? destination.notes
                  : [destination.notes]
                ).map((note: string) => (
                  <li key={note} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    />
                    {note}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Access
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {destination.access}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Facilities
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted">
                    {destination.facilities.map((facility) => (
                      <li key={facility}>· {facility}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Practicalities
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {destination.practicalities}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/explorer">View in Explorer</ButtonLink>
                <ButtonLink href="/plan" variant="secondary">
                  Add to itinerary
                </ButtonLink>
                <Link
                  href="/destinations"
                  className="text-sm font-medium text-muted transition-colors hover:text-navy"
                >
                  ← All destinations
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
