import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, SectionHeading } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/packages/package-card";
import { packages } from "@/data/packages";
import { getDestination } from "@/data/destinations";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { formatDuration, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Eclipse Packages — Illustrative Tunisia Trip Outlines",
  description:
    "Compare illustrative four- and five-night eclipse trip outlines for Mahdia, Djerba and the Sahara, with transparent price bases and no invented availability.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eclipse packages"
        title="Three ways to meet the shadow."
        description="Start with a coast, an island or the Sahara. These outlines show how a trip could fit together; they are illustrative, not live inventory, and cannot be booked or paid for on this site."
      />

      <Container className="py-14 sm:py-20">
        <div className="rounded-2xl border border-danger/20 bg-danger/5 px-5 py-4 text-sm leading-relaxed text-danger">
          <strong>Illustrative packages.</strong> Prices are planning figures
          in US dollars based on two travellers sharing. They exclude
          international flights, are not quotations, and do not imply hotel
          availability, partnership or a confirmed booking.
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Side by side"
            title="Compare the outlines"
            description="The eclipse duration below is computed for each package base from the NASA Besselian elements. Price is the illustrative four-night base, before options."
          />

          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ivory">
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Package
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Base
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Nights
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Totality at base
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    From
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Best for
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => {
                  const destination = getDestination(pkg.destinationSlug);
                  const circumstances = destination
                    ? circumstancesFor(destination)
                    : null;
                  return (
                    <tr key={pkg.slug} className="border-b border-line/70 last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-display text-base font-semibold text-ink">
                          {pkg.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">{pkg.area}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {destination?.name ?? pkg.eclipseBase}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-ink">
                        {pkg.nights}
                      </td>
                      <td className="px-5 py-4">
                        {circumstances?.visibility === "total" ? (
                          <Badge tone="total">
                            {formatDuration(circumstances.centralDurationSeconds)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted">Partial</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-display text-lg font-semibold text-ink">
                        {formatMoney(pkg.basePricePerPerson, pkg.currency)}
                      </td>
                      <td className="px-5 py-4 text-xs leading-relaxed text-muted">
                        {pkg.bestFor.join(" · ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "What the price is",
              body: "An illustrative planning figure for the outline shown. It is not a live quote and does not include flights or insurance.",
            },
            {
              title: "What the price is not",
              body: "A reservation, a hold, or a guarantee of a room, guide, vehicle or eclipse viewing site.",
            },
            {
              title: "How to use it",
              body: "Adjust the outline, then take it to the planner. Real hotels and flight searches remain external and independently verified.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-display text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
