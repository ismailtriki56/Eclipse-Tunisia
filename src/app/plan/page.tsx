import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Plan My Trip",
  description:
    "Plan a trip to see the total solar eclipse in Tunisia. The AI itinerary planner is in development.",
};

export default function PlanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan My Trip"
        title="Plan your eclipse trip"
        description="Enter your dates, budget and interests and receive a suggested itinerary grounded in real destinations and listings."
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-6 rounded-2xl border border-dashed border-line bg-white p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              In development
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
              The AI itinerary planner is not yet available
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This feature will collect only the information needed to build a
              useful plan, retrieve real destinations and listings, and explain
              why each option is recommended. Costs will be calculated in
              application code from verified prices, never estimated by the
              model alone.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Until it ships, you can explore verified viewing locations in the
              Eclipse Explorer.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-muted">
            {[
              "Arrival and departure dates",
              "Arrival city or accommodation area",
              "Budget and currency",
              "Group size",
              "Interests and desired pace",
              "Accessibility needs, if voluntarily provided",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
