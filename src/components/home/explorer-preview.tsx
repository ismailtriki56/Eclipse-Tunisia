import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { totalityDestinations } from "@/lib/eclipse/destinations";

export function ExplorerPreview() {
  const featured = totalityDestinations().slice(0, 3);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Eclipse Explorer"
            title="Find where totality is visible"
            description="Compare locations across Tunisia. See a clear distinction between places inside the path of totality and those that will only see a partial eclipse, computed from NASA Besselian elements."
          />
          <ButtonLink href="/explorer" variant="secondary" className="shrink-0">
            Open the explorer
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((circumstances) => (
            <DestinationCard
              key={circumstances.destination.slug}
              circumstances={circumstances}
            />
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">
          All timings and durations are computed from the NASA GSFC eclipse
          catalogue (Five Millennium Canon of Solar Eclipses).
        </p>
      </Container>
    </section>
  );
}
