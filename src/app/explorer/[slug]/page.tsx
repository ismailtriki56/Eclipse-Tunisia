import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestination } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container } from "@/components/ui/card";
import { ExperienceCard } from "@/components/experience-card";
import { formatDuration, formatTimeInZone } from "@/lib/format";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Location not found" };
  return {
    title: destination.name,
    description: destination.summary,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const isTotal = destination.visibility === "total";
  const tz = destination.circumstances.timeZone;
  const contacts = [
    { label: "First contact", value: destination.circumstances.firstContact },
    { label: "Second contact", value: destination.circumstances.secondContact },
    { label: "Maximum eclipse", value: destination.circumstances.maximum },
    { label: "Third contact", value: destination.circumstances.thirdContact },
    { label: "Fourth contact", value: destination.circumstances.fourthContact },
  ];

  const nearby = experiences.filter(
    (e) => e.destinationSlug === destination.slug,
  );

  return (
    <>
      <div className="border-b border-line bg-navy text-ivory">
        <Container className="py-14 sm:py-20">
          <Link
            href="/explorer"
            className="text-sm text-ivory/60 hover:text-gold"
          >
            &larr; Back to Eclipse Explorer
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {destination.name}
            </h1>
            <Badge tone={isTotal ? "total" : "partial"}>
              {isTotal ? "Totality visible" : "Partial eclipse"}
            </Badge>
          </div>
          <p className="mt-3 text-sm uppercase tracking-wide text-ivory/60">
            {destination.region}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-ivory/75">
            {destination.summary}
          </p>
        </Container>
      </div>

      <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Eclipse circumstances
          </h2>
          <p className="mt-2 text-sm text-muted">
            Local times shown in {tz}. Missing times are shown as not
            applicable rather than estimated.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Eclipse contact times for {destination.name}
              </caption>
              <tbody>
                {contacts.map((c) => {
                  const value = formatTimeInZone(c.value, tz);
                  return (
                    <tr key={c.label} className="border-b border-line last:border-0">
                      <th
                        scope="row"
                        className="px-5 py-3.5 text-left font-medium text-muted"
                      >
                        {c.label}
                      </th>
                      <td className="px-5 py-3.5 text-right font-semibold text-ink">
                        {value ?? (
                          <span className="text-muted">Not applicable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-ivory">
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-left font-medium text-muted"
                  >
                    Duration of totality
                  </th>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">
                    {formatDuration(destination.circumstances.totalitySeconds) ?? (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-muted">
            Source:{" "}
            <a
              href={destination.sourceUrl}
              className="underline underline-offset-2 hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA eclipse data
            </a>{" "}
            &middot; Last verified {destination.verifiedOn}
          </p>

          <div className="mt-10 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
            {destination.notes}
          </div>

          {nearby.length > 0 ? (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Experiences near {destination.name}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {nearby.map((experience) => (
                  <ExperienceCard
                    key={experience.slug}
                    experience={experience}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Travel & access
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {destination.access}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Facilities
            </h2>
            {destination.facilities.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {destination.facilities.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Not verified for this location.
              </p>
            )}
            <p className="mt-4 text-xs text-muted">
              Accessibility: {destination.accessibility ?? "not verified"}
            </p>
          </Card>

          <div className="flex flex-col gap-3">
            <ButtonLink href="/plan">Plan a trip here</ButtonLink>
            <ButtonLink href="/safety" variant="secondary">
              Viewing safety guide
            </ButtonLink>
          </div>
        </aside>
      </Container>
    </>
  );
}
