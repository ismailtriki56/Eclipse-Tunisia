import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExplorerView } from "@/components/explorer/explorer-view";
import { allCircumstances } from "@/lib/eclipse/destinations";

export const metadata: Metadata = {
  title: "Eclipse Explorer — Interactive Map & Totality Circumstances",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with verified circumstances computed from NASA Besselian elements and interactive MapLibre GL exploration.",
};

export default function ExplorerPage() {
  const circumstances = allCircumstances();

  return (
    <>
      <PageHeader
        eyebrow="Eclipse Explorer"
        title="Where will totality be visible?"
        description="Locations inside the umbral path experience up to 6+ minutes of totality. Everywhere else sees a partial eclipse. All timings below are computed from the NASA GSFC eclipse catalogue in Africa/Tunis time (UTC+1)."
      />

      <ExplorerView circumstances={circumstances} />
    </>
  );
}
