import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { ItineraryPlanner } from "@/components/plan/itinerary-planner";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Plan Your Eclipse Trip — Interactive Itinerary & AI Architect",
  description:
    "Design and customize your day-by-day expedition for the total solar eclipse of 2 August 2027 in Tunisia. Save locally, reorder stops, and consult the server-side Gemini AI expedition architect.",
};

export default function PlanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Itinerary Builder"
        title="Plan your eclipse expedition in Tunisia"
        description="Craft a multi-day itinerary connecting Roman ruins, oasis landscapes, and verified totality viewing grounds. Reorder stops, track your eclipse day position, and save your plan directly in your browser."
      />

      <Container className="py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-navy" />
            </div>
          }
        >
          <ItineraryPlanner />
        </Suspense>
      </Container>
    </>
  );
}
