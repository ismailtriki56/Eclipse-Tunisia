import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { FlightSearch } from "@/components/flights/flight-search";
import { airports } from "@/data/flights";
import { Plane } from "lucide-react";
import { getDictionary, isLocale } from "@/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  return { title: t.flights.title, description: t.flights.description };
}

export default async function FlightsPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");

  return (
    <>
      <PageHeader
        eyebrow={t.flights.headerEyebrow}
        title={t.flights.headerTitle}
        description={t.flights.headerDesc}
      />

      <Container className="py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-line bg-white px-5 py-4 text-sm text-muted shadow-card">
          <span className="flex items-center gap-2 font-medium text-ink">
            <Plane className="h-4 w-4 text-gold-600" />
            {airports.length} {t.flights.gateways}
          </span>
          <span>{t.flights.externalSearchNote}</span>
        </div>

        <FlightSearch />

        <div className="mt-10 rounded-2xl border border-gold-600/30 bg-gold/10 p-5 text-sm leading-relaxed text-ink sm:p-6">
          <strong>{t.home.flightsTitle}</strong> {t.home.flightsDesc}
        </div>
      </Container>
    </>
  );
}
