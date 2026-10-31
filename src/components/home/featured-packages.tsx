"use client";

import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { PackageCard } from "@/components/packages/package-card";
import { packages } from "@/data/packages";
import { useLanguage } from "@/context/language-context";

export function FeaturedPackages() {
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={t.home.packagesEyebrow}
            title={t.home.packagesTitle}
            description={t.home.packagesDesc}
          />
          <ButtonLink href="/packages" variant="secondary" className="shrink-0">
            {t.home.comparePackages}
          </ButtonLink>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
          {t.common.illustrativePriceNote}
        </p>
      </Container>
    </section>
  );
}
