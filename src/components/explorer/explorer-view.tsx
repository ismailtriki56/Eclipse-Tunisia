"use client";

import { useState, useMemo } from "react";
import { Container, SectionHeading } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { InteractiveMap } from "@/components/map/interactive-map";
import { DestinationCircumstances } from "@/lib/eclipse/destinations";
import { Search, Map, Grid } from "lucide-react";
import { cn } from "@/lib/cn";

interface ExplorerViewProps {
  circumstances: DestinationCircumstances[];
}

export function ExplorerView({ circumstances }: ExplorerViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "total" | "partial">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");

  const filtered = useMemo(() => {
    return circumstances.filter((item) => {
      if (activeTab === "total" && item.visibility !== "total") return false;
      if (activeTab === "partial" && item.visibility === "total") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.destination.name.toLowerCase().includes(q);
        const matchesRegion = item.destination.region.toLowerCase().includes(q);
        const matchesSummary = item.destination.summary.toLowerCase().includes(q);
        return matchesName || matchesRegion || matchesSummary;
      }
      return true;
    });
  }, [circumstances, activeTab, searchQuery]);

  const totalCount = circumstances.filter((i) => i.visibility === "total").length;
  const partialCount = circumstances.filter((i) => i.visibility !== "total").length;

  return (
    <Container className="py-12 sm:py-16">
      {/* Search & Filter Toolbar */}
      <div className="relative z-10 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by city, oasis, or region (e.g. Tozeur, Djerba, South West)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-line bg-ivory pl-10 pr-4 py-2 text-xs font-medium text-ink placeholder:text-muted focus:border-navy focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-line bg-ivory p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "all"
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              All ({circumstances.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("total")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "total"
                  ? "bg-gold text-navy shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              Totality ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("partial")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "partial"
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              Partial ({partialCount})
            </button>
          </div>

          {/* Map vs Grid Toggle */}
          <div className="flex rounded-lg border border-line bg-ivory p-1">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "map"
                  ? "bg-navy text-ivory"
                  : "text-muted hover:text-navy"
              )}
              title="Interactive Map view"
            >
              <Map className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-navy text-ivory"
                  : "text-muted hover:text-navy"
              )}
              title="Card Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "map" ? (
        <div className="mt-8 space-y-12">
          <div>
            <InteractiveMap initialSlug="tozeur" />
          </div>

          <div>
            <SectionHeading
              eyebrow="Viewing Location Index"
              title="Verified Destination Circumstances"
              description="Browse the full directory of locations with contacts C1 to C4 and sun altitude."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <DestinationCard key={item.destination.slug} circumstances={item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <DestinationCard key={item.destination.slug} circumstances={item} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-paper p-12 text-center text-muted">
              <p className="text-base font-semibold text-ink">No destinations matched your criteria</p>
              <p className="mt-1 text-xs">Try clearing your search query or selecting a different filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="mt-4 rounded-lg bg-sand px-3.5 py-1.5 text-xs font-semibold text-navy hover:bg-gold/30"
              >
                Reset filters
              </button>
            </div>
          ) : null}
        </div>
      )}
    </Container>
  );
}
