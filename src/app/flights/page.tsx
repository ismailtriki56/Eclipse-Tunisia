import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { FlightSearch } from "@/components/flights/flight-search";
import { airports } from "@/data/flights";
import { Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Flights — Tunisian Airports for the 2027 Eclipse",
  description:
    "Compare Tunisian arrival airports for the 2 August 2027 eclipse and open a live external flight search. No invented schedules, fares or availability.",
};

export default function FlightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Flights"
        title="Pick the gateway by the base, not the fare headline."
        description="Tunisia has several arrival airports, and the right one depends on whether you are heading to Mahdia, Djerba, Sousse or the Sahara. Compare the gateways, then search live routes externally."
      />

      <Container className="py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-line bg-white px-5 py-4 text-sm text-muted shadow-card">
          <span className="flex items-center gap-2 font-medium text-ink">
            <Plane className="h-4 w-4 text-gold-600" />
            {airports.length} Tunisian gateways
          </span>
          <span>No schedules stored</span>
          <span>No fares invented</span>
          <span>External search only</span>
        </div>

        <FlightSearch />

        <div className="mt-10 rounded-2xl border border-gold-600/30 bg-gold/10 p-5 text-sm leading-relaxed text-ink sm:p-6">
          <strong>Plan the transfer, not just the flight.</strong> Eclipse week
          is expected to concentrate demand on the coast and in the south.
          Check the road transfer time from your arrival airport, arrange it in
          advance, and keep a buffer before eclipse morning. This site does not
          sell flights or transfers.
        </div>
      </Container>
    </>
  );
}
