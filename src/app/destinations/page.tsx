import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { DestinationsView } from "@/components/destinations/destinations-view";
import { totalityDestinations, partialDestinations } from "@/lib/eclipse/destinations";

export const metadata: Metadata = {
  title: "Destinations — Where to Watch the 2027 Eclipse in Tunisia",
  description:
    "Compare the best places to watch the total solar eclipse of 2 August 2027 in Tunisia, with verified circumstances computed from NASA data.",
};

export default function DestinationsPage() {
  const total = totalityDestinations();
  const partial = partialDestinations();

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where to watch in Tunisia"
        description="Every timing and duration below is computed from NASA Besselian elements for the 2 August 2027 total solar eclipse. Filter by totality duration, geographic region, or search specific oases."
      />

      <DestinationsView total={total} partial={partial} />
    </>
  );
}
