import { Container, SectionHeading } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { DestinationCard } from "@/components/destination-card";
import { totalityDestinations } from "@/lib/eclipse/destinations";

export function DestinationsPreview() {
  const best = totalityDestinations().slice(0, 3);

  return (
    <section className="bg-ivory py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Where to stand"
            title="The longest totality in Tunisia"
            description="These are the places with the most time in the umbra, ordered by the duration of totality computed from the NASA elements. Times are local Tunis time (UTC+1)."
          />
          <ButtonLink href="/destinations" variant="secondary">
            All destinations
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {best.map((circumstances) => (
            <DestinationCard
              key={circumstances.destination.slug}
              circumstances={circumstances}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
