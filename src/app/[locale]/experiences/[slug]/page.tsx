import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperience } from "@/data/experiences";
import { getDestination } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import { Card, Container } from "@/components/ui/card";
import { BookingRequestCard } from "@/components/experiences/booking-request-card";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import { destinationText } from "@/lib/destination-text";
import { categoryText, experienceText } from "@/lib/experience-text";
import { experiencesEnabled } from "@/lib/features";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const t = getDictionary(locale);
  const experience = getExperience(slug);
  if (!experience) return { title: t.notFound.title };
  const copy = experienceText(t, experience);
  return { title: copy.title, description: copy.summary };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  if (!experiencesEnabled) notFound();
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const t = getDictionary(locale);
  const experience = getExperience(slug);
  if (!experience) notFound();
  const copy = experienceText(t, experience);

  const destination = getDestination(experience.destinationSlug);
  const destinationName = destination
    ? destinationText(t, destination).name
    : t.nav.destinations;

  return (
    <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{categoryText(t, experience.category)}</Badge>
          {experience.isSample ? (
            <Badge tone="sample">{t.experienceText.sampleListing}</Badge>
          ) : null}
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {destinationName} &middot;{" "}
          {copy.providerName}
        </p>
        <p className="mt-6 leading-relaxed text-muted">{copy.summary}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t.experienceText.detail.includedTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {copy.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t.experienceText.detail.notIncludedTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {copy.excludes.map((item) => (
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
        <BookingRequestCard experience={experience} />
      </aside>
    </Container>
  );
}


