import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExplorerView } from "@/components/explorer/explorer-view";
import { allCircumstances, totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";

export const metadata: Metadata = {
  title: "Eclipse Explorer — Interactive Map & Totality Circumstances",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with verified circumstances computed from NASA Besselian elements and an interactive Leaflet map.",
};

export default function ExplorerPage() {
  const circumstances = allCircumstances();
  const bySlug = new Map(
    circumstances.map((item) => [item.destination.slug, item]),
  );
  const duration = (slug: string) =>
    formatDuration(bySlug.get(slug)?.centralDurationSeconds ?? null) ?? "—";
  const longest = totalityDestinations()[0];
  const longestDuration =
    formatDuration(longest?.centralDurationSeconds ?? null) ?? "—";

  return (
    <>
      <PageHeader
        eyebrow="Eclipse Explorer"
        title="Where will totality be visible?"
        description={`Locations inside the umbral path see totality — ${duration("djerba")} at Djerba, ${duration("mahdia")} at Mahdia and ${duration("tozeur")} at Tozeur. The longest totality in our published list is ${longestDuration} at ${longest?.destination.name ?? "the centre line"}. Everywhere else sees a deep partial eclipse. All timings are computed from the NASA GSFC eclipse catalogue in Africa/Tunis time (UTC+1).`}
      />

      <ExplorerView circumstances={circumstances} />
    </>
  );
}
