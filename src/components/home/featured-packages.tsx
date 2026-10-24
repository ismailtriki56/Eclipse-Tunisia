import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { PackageCard } from "@/components/packages/package-card";
import { packages } from "@/data/packages";

export function FeaturedPackages() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Eclipse packages"
            title="A starting point, not a fixed script."
            description="Build around Mahdia, Djerba or the Sahara. Each outline is clearly marked illustrative, with a transparent price basis and no claim of live availability."
          />
          <ButtonLink
            href="/packages"
            variant="secondary"
            className="shrink-0"
          >
            Compare all packages
          </ButtonLink>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
          Package prices are illustrative planning figures in US dollars, based
          on two travellers sharing. They are not quotations, do not include
          international flights, and are not bookable or payable on this site.
        </p>
      </Container>
    </section>
  );
}
