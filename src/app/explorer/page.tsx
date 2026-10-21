import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Eclipse Explorer",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with a clear distinction between totality and partial eclipse areas.",
};

export default function ExplorerPage() {
  const total = destinations.filter((d) => d.visibility === "total");
  const partial = destinations.filter((d) => d.visibility === "partial");

  return (
    <>
      <PageHeader
        eyebrow="Eclipse Explorer"
        title="Where will totality be visible?"
        description="Only locations inside the path of totality will experience a total eclipse. Everywhere else, including much of Tunisia, will see a partial eclipse. Compare locations below."
      />

      <Container className="py-16 sm:py-20">
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
          The locations and timings below are development data. They must be
          verified against official NASA eclipse sources before being presented
          as authoritative. Interactive map view is planned for the next stage.
        </div>

        <SectionHeading
          className="mt-12"
          eyebrow="Inside the path"
          title="Totality locations"
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {total.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>

        <SectionHeading
          className="mt-16"
          eyebrow="Outside the path"
          title="Partial eclipse locations"
          description="These locations will not experience totality, even though the Sun will be substantially covered."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partial.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </Container>
    </>
  );
}
