import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { DestinationsView } from "@/components/destinations/destinations-view";
import { totalityDestinations, partialDestinations } from "@/lib/eclipse/destinations";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";

export const metadata: Metadata = {
  title: "Destinations — Where to Watch the 2027 Eclipse in Tunisia",
  description:
    "Compare the best places to watch the total solar eclipse of 2 August 2027 in Tunisia, with verified circumstances computed from NASA data.",
};

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
