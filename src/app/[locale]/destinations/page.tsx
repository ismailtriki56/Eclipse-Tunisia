import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { DestinationsView } from "@/components/destinations/destinations-view";
import { totalityDestinations, partialDestinations } from "@/lib/eclipse/destinations";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : defaultLocale);
  return {
    title: t.destinations.metadataTitle,
    description: t.destinations.metadataDescription,
  };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const t = getDictionary(locale);
  const total = totalityDestinations();
  const partial = partialDestinations();

  return (
    <>
      <PageHeader
        eyebrow={t.destinations.pageEyebrow}
        title={t.destinations.pageTitle}
        description={t.destinations.pageDescription}
      />

      <DestinationsView total={total} partial={partial} />
    </>
  );
}
