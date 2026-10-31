import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExplorerView } from "@/components/explorer/explorer-view";
import { allCircumstances, totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import { destinationText } from "@/lib/destination-text";

export const metadata: Metadata = {
  title: "Eclipse Explorer — Interactive Map & Totality Circumstances",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with verified circumstances computed from NASA Besselian elements and an interactive Leaflet map.",
};

export default async function ExplorerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const t = getDictionary(locale);
  const circumstances = allCircumstances();
  const bySlug = new Map(
    circumstances.map((item) => [item.destination.slug, item]),
  );
  const duration = (slug: string) =>
    formatDuration(bySlug.get(slug)?.centralDurationSeconds ?? null) ?? "—";
  const longest = totalityDestinations()[0];
  const longestDuration =
    formatDuration(longest?.centralDurationSeconds ?? null) ?? "—";
  const longestName = longest
    ? destinationText(t, longest.destination).name
    : t.map.centerLine;

  return (
    <>
      <PageHeader
        eyebrow={t.explorer.pageEyebrow}
        title={t.explorer.pageTitle}
        description={t.explorer.pageDescription
          .replace("{djerba}", duration("djerba"))
          .replace("{mahdia}", duration("mahdia"))
          .replace("{tozeur}", duration("tozeur"))
          .replace("{longest}", longestDuration)
          .replace("{longestName}", longestName)}
      />

      <ExplorerView circumstances={circumstances} />
    </>
  );
}
