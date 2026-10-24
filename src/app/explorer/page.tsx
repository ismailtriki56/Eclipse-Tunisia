import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExplorerView } from "@/components/explorer/explorer-view";
import { allCircumstances } from "@/lib/eclipse/destinations";

export const metadata: Metadata = {
  title: "Eclipse Explorer — Interactive Map & Totality Circumstances",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with verified circumstances computed from NASA Besselian elements and an interactive Leaflet map.",
};

export default function ExplorerPage() {
  const circumstances = allCircumstances();

  return (
    <>
      <PageHeader
        eyebrow="Eclipse Explorer"
        title="Where will totality be visible?"
        description="Locations inside the umbral path see totality — 4 minutes 37 seconds at Djerba, 2 minutes 48 seconds at Mahdia, 1 minute 39 seconds at Tozeur. The longest point in Tunisia, near Gafsa, reaches about 5 minutes 08 seconds. Everywhere else sees a deep partial eclipse. All timings are computed from the NASA GSFC eclipse catalogue in Africa/Tunis time (UTC+1)."
      />

      <ExplorerView circumstances={circumstances} />
    </>
  );
}
