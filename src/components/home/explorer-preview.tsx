import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { destinations } from "@/data/destinations";

export function ExplorerPreview() {
  const featured = destinations.slice(0, 3);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Eclipse Explorer"
            title="Find where totality is visible"
            description="Compare locations across Tunisia. See a clear distinction between places inside the path of totality and those that will only see a partial eclipse."
          />
          <ButtonLink href="/explorer" variant="secondary" className="shrink-0">
            Open the explorer
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">
          Location data shown here is developed programming data pending
          verification against official NASA eclipse sources.
        </p>
      </Container>
    </section>
  );
}
