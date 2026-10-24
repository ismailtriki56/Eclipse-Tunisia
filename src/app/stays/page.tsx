import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { StaysDirectory } from "@/components/stays/stays-directory";
import { stays } from "@/data/stays";

export const metadata: Metadata = {
  title: "Stays — Verified Tunisian Hotels for the 2027 Eclipse",
  description:
    "A verified directory of real hotels in Mahdia, Djerba, Tozeur and Sousse, with official-site links and external rate searches. No invented prices or availability.",
};

export default function StaysPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stays"
        title="Real hotels. No invented rates."
        description="A focused directory of properties in the places that matter for eclipse week. We link to official hotel sites and external rate searches; we do not display prices, availability or guest reviews of our own."
      />

      <Container className="py-12 sm:py-16">
        <div className="mb-8 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
              What is verified
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              Property names, locations and official web addresses.
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
              What is not shown
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              Live prices, availability, ratings or guaranteed facilities.
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Before you book
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              Confirm the room, cancellation terms and eclipse-week policy
              directly with the property.
            </p>
          </div>
        </div>

        <StaysDirectory />

        <p className="mt-8 text-xs leading-relaxed text-muted">
          {stays.length} properties are listed. External rate searches open a
          third-party booking site with fixed sample dates around the eclipse;
          always change the dates, occupancy and room type to match your trip.
          Listing a property is not an endorsement or a partnership.
        </p>
      </Container>
    </>
  );
}
