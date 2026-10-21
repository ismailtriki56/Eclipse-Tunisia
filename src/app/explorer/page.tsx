import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { allCircumstances } from "@/lib/eclipse/destinations";

export const metadata: Metadata = {
  title: "Eclipse Explorer",
  description:
    "Compare Tunisian viewing locations for the total solar eclipse of 2 August 2027, with verified circumstances computed from NASA Besselian elements.",
};

export default function ExplorerPage() {
  const circumstances = allCircumstances();
  const total = circumstances.filter((item) => item.visibility === "total");
  const partial = circumstances.filter((item) => item.visibility === "partial");

  return (
    <>
      <PageHeader
        eyebrow="Eclipse Explorer"
        title="Where will totality be visible?"
        description="Only locations inside the path of totality will experience a total eclipse. Everywhere else will see a partial eclipse. All timings below are computed from the NASA GSFC eclipse catalogue and formatted in Africa/Tunis (UTC+1)."
      />

      <Container className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="Inside the path"
          title="Totality locations"
          description="Ordered by duration of totality, longest first."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {total.map((item) => (
            <DestinationCard key={item.destination.slug} circumstances={item} />
          ))}
        </div>

        <SectionHeading
          className="mt-16"
          eyebrow="Outside the path"
          title="Partial eclipse locations"
          description="These locations will not experience totality. The Sun will be substantially covered, but eye protection is required for the entire partial phase."
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
