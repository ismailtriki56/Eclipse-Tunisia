import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, Card, SectionHeading } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveMap } from "@/components/map/interactive-map";
import { eclipseFacts, allCircumstances } from "@/lib/eclipse/destinations";
import { site } from "@/lib/site";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import type { Dictionary } from "@/i18n";
import { destinationText } from "@/lib/destination-text";
import { formatDuration } from "@/lib/format";
import { Sun, Clock, Compass, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

function dictionaryFor(locale: string) {
  return getDictionary(isLocale(locale) ? locale : defaultLocale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionaryFor(locale);
  return {
    title: t.eclipsePage.metadataTitle,
    description: t.eclipsePage.metadataDescription,
  };
}

function formatDurationSec(seconds: number | null, t: Dictionary) {
  return (
    formatDuration(seconds, {
      minute: t.hero.minutes,
      second: t.hero.seconds,
    }) ?? "-"
  );
}

export default async function EclipseInfoPage({ params }: Props) {
  const { locale: localeParam } = await params;
  const t = dictionaryFor(localeParam);
  const all = allCircumstances().filter((c) => c.visibility === "total");

  return (
    <>
      <PageHeader
        eyebrow={t.eclipsePage.eyebrow}
        title={t.eclipsePage.title}
        description={t.eclipsePage.description}
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.eclipsePage.greatestLabel}
              </span>
              <Clock className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.greatestEclipseUT}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t.eclipsePage.greatestNote.replace(
                "{time}",
                eclipseFacts.greatestEclipseLocal,
              )}
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.eclipsePage.magnitudeLabel}
              </span>
              <Sun className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.magnitude.toFixed(3)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t.eclipsePage.magnitudeNote}
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-gold">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.eclipsePage.widthLabel}
              </span>
              <Compass className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {eclipseFacts.pathWidthKm} km
            </p>
            <p className="mt-1 text-xs text-muted">{t.eclipsePage.widthNote}</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-navy">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.eclipsePage.sourceLabel}
              </span>
              <ExternalLink className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">NASA GSFC</p>
            <a
              href={site.nasaEclipseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700"
            >
              {t.eclipsePage.viewNasa} <ExternalLink className="h-3 w-3" />
            </a>
          </Card>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={t.eclipsePage.timesEyebrow}
              title={t.eclipsePage.timesTitle}
              description={t.eclipsePage.timesDescription}
            />
            <ButtonLink href="/plan" variant="secondary" className="shrink-0">
              {t.eclipsePage.buildItinerary}
            </ButtonLink>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-sand/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.location}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.firstContact}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.secondContact}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.maximum}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.thirdContact}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.fourthContact}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {t.eclipsePage.columns.duration}
                  </th>
                </tr>
              </thead>
              <tbody>
                {all.map((c, idx) => (
                  <tr
                    key={c.destination.slug}
                    className={idx % 2 === 0 ? "bg-white" : "bg-ivory/40"}
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {destinationText(t, c.destination).name}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.localTimes.firstContact || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.localTimes.secondContact || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.localTimes.maximum || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.localTimes.thirdContact || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.localTimes.fourthContact || "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {formatDurationSec(c.centralDurationSeconds, t)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">{t.eclipsePage.allTimes}</p>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={t.eclipsePage.explorerEyebrow}
              title={t.eclipsePage.explorerTitle}
              description={t.eclipsePage.explorerDescription}
            />
            <ButtonLink href="/plan" variant="secondary" className="shrink-0">
              {t.eclipsePage.buildItinerary}
            </ButtonLink>
          </div>
          <div className="mt-8">
            <InteractiveMap initialSlug="djerba" />
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-card">
          <h3 className="font-display text-xl font-semibold text-ink">
            {t.eclipsePage.sourcesTitle}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href="https://www.timeanddate.com/eclipse/in/tunisia?iso=20270802"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
              >
                {t.eclipsePage.sources.timeanddateTunisia}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.timeanddate.com/eclipse/in/tunisia/mahdia?iso=20270802"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
              >
                {t.eclipsePage.sources.timeanddateMahdia}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.timeanddate.com/eclipse/in/tunisia/houmt-souk-djerba?iso=20270802"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
              >
                {t.eclipsePage.sources.timeanddateDjerba}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://science.nasa.gov/eclipses/future-eclipses/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
              >
                {t.eclipsePage.sources.nasaFuture}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href={site.nasaEclipseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
              >
                {t.eclipsePage.sources.nasaData}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
