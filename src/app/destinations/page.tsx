import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { totalityDestinations, partialDestinations } from "@/lib/eclipse/destinations";

export const metadata: Metadata = {
  title: "Destinations",
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
        description="Every timing and duration below is computed from NASA Besselian elements for the 2 August 2027 total solar eclipse. Sort by duration of totality, or see where only a partial eclipse will be visible."
      />

      <Container className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="Inside the path"
          title="Longest totality first"
          description="Ordered by the duration of totality computed for each location."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {total.map((item) => (
            <DestinationCard key={item.destination.slug} circumstances={item} />
          ))}
        </div>

        <SectionHeading
          className="mt-16"
          eyebrow="Outside the path"
          title="Partial eclipse destinations"
          description="Deep coverage in many places, but no totality. Eye protection is required for the entire partial phase."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partial.map((item) => (
            <DestinationCard key={item.destination.slug} circumstances={item} />
          ))}
        </div>
      </Container>
    </>
  );
}
