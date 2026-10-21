import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperience } from "@/data/experiences";
import { getDestination } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container } from "@/components/ui/card";
import { formatHours, formatMoney } from "@/lib/format";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return { title: "Experience not found" };
  return { title: experience.title, description: experience.summary };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) notFound();

  const destination = getDestination(experience.destinationSlug);

  return (
    <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{experience.category.replace("-", " ")}</Badge>
          {experience.isSample ? <Badge tone="sample">Sample listing</Badge> : null}
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {experience.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {destination ? destination.name : "Tunisia"} &middot;{" "}
          {experience.providerName}
        </p>
        <p className="mt-6 leading-relaxed text-muted">{experience.summary}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              What&rsquo;s included
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {experience.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Not included
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {experience.excludes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <aside className="space-y-6">
        <Card className="p-6">
          <p className="font-display text-3xl font-semibold text-ink">
            {formatMoney(experience.priceAmount, experience.priceCurrency)}
          </p>
          <p className="mt-1 text-sm text-muted">{experience.priceBasis}</p>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Duration</dt>
              <dd className="font-medium text-ink">
                {formatHours(experience.durationHours)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Max group size</dt>
              <dd className="font-medium text-ink">{experience.groupSizeMax}</dd>
            </div>
          </dl>
          <ButtonLink href="/experiences" className="mt-6 w-full">
            Request booking
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-muted">
            A booking request is not a confirmed reservation.
          </p>
        </Card>
      </aside>
    </Container>
  );
}
