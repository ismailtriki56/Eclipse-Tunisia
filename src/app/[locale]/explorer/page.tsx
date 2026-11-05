import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExplorerView } from "@/components/explorer/explorer-view";
import { allCircumstances, totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import { destinationText } from "@/lib/destination-text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : defaultLocale);
  return {
    title: t.explorer.metadataTitle,
    description: t.explorer.metadataDescription,
  };
}

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
  const units = { minute: t.hero.minutes, second: t.hero.seconds };
  const duration = (slug: string) =>
    formatDuration(bySlug.get(slug)?.centralDurationSeconds ?? null, units) ??
    "—";
  const longest = totalityDestinations()[0];
  const longestDuration =
    formatDuration(longest?.centralDurationSeconds ?? null, units) ?? "—";
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
