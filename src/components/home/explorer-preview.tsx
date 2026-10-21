"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { InteractiveMap } from "@/components/map/interactive-map";
import { totalityDestinations, partialDestinations } from "@/lib/eclipse/destinations";
import { Map, Grid, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function ExplorerPreview() {
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const total = totalityDestinations().slice(0, 3);
  const partial = partialDestinations().slice(0, 3);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionHeading
              eyebrow="Eclipse Explorer"
              title="Interactive Path & Destination Explorer"
              description="Explore verified viewing locations across Tunisia. Compare places directly beneath the centre line against partial eclipse zones, computed from NASA Besselian elements."
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-line bg-paper p-1">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === "map"
                    ? "bg-navy text-ivory shadow-xs"
                    : "text-muted hover:text-navy"
                )}
              >
                <Map className="h-3.5 w-3.5" />
                <span>Interactive Map</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === "grid"
                    ? "bg-navy text-ivory shadow-xs"
                    : "text-muted hover:text-navy"
                )}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Destination Cards</span>
              </button>
            </div>

            <ButtonLink href="/explorer" variant="secondary">
              All Locations
            </ButtonLink>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="mt-10">
            <InteractiveMap initialSlug="tozeur" />
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Longest Totality Locations
                </h3>
                <Link
                  href="/destinations"
                  className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1"
                >
                  View all inside path &rarr;
                </Link>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {total.map((circumstances) => (
                  <DestinationCard
                    key={circumstances.destination.slug}
                    circumstances={circumstances}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Partial Eclipse Locations (Deep Coverage)
                </h3>
                <Link
                  href="/destinations"
                  className="text-xs font-semibold text-muted hover:text-navy flex items-center gap-1"
                >
                  View all partial locations &rarr;
                </Link>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {partial.map((circumstances) => (
                  <DestinationCard
                    key={circumstances.destination.slug}
                    circumstances={circumstances}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-paper px-5 py-4 text-xs text-muted">
          <span>
            Every timing and duration is mathematically computed from the NASA GSFC Five Millennium Canon of Solar Eclipses.
          </span>
          <Link
            href="/eclipse"
            className="font-semibold text-navy hover:underline flex items-center gap-1"
          >
            <span>Learn more about the 2027 eclipse science</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
