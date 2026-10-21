"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { DestinationCircumstances } from "@/lib/eclipse/destinations";
import { Search, Map } from "lucide-react";
import { cn } from "@/lib/cn";

interface DestinationsViewProps {
  total: DestinationCircumstances[];
  partial: DestinationCircumstances[];
}

export function DestinationsView({ total, partial }: DestinationsViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allDestinations = useMemo(() => {
    return [...total, ...partial];
  }, [total, partial]);

  const filtered = useMemo(() => {
    return allDestinations.filter((item) => {
      if (selectedVisibility === "total" && item.visibility !== "total") return false;
      if (selectedVisibility === "partial" && item.visibility === "total") return false;
      if (selectedRegion !== "all" && item.destination.region !== selectedRegion) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.destination.name.toLowerCase().includes(q) ||
          item.destination.region.toLowerCase().includes(q) ||
          item.destination.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allDestinations, selectedVisibility, selectedRegion, searchQuery]);

  const regions = ["all", "South West", "South East", "Central", "Central East", "North East"];

  return (
    <Container className="py-12 sm:py-16">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search destination, oasis, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-line bg-ivory pl-10 pr-4 py-2 text-xs font-medium text-ink placeholder:text-muted focus:border-navy focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Totality vs Partial Toggle */}
          <div className="flex rounded-lg border border-line bg-ivory p-1">
            <button
              type="button"
              onClick={() => setSelectedVisibility("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                selectedVisibility === "all"
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedVisibility("total")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                selectedVisibility === "total"
                  ? "bg-gold text-navy shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              Totality ({total.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedVisibility("partial")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                selectedVisibility === "partial"
                  ? "bg-navy text-ivory shadow-xs"
                  : "text-muted hover:text-navy"
              )}
            >
              Partial ({partial.length})
            </button>
          </div>

          <Link
            href="/explorer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-sand/60 px-3.5 py-2 text-xs font-semibold text-navy hover:bg-sand transition-colors"
          >
            <Map className="h-3.5 w-3.5" />
            <span>Map View</span>
          </Link>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted mr-1">Region:</span>
        {regions.map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setSelectedRegion(reg)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors capitalize",
              selectedRegion === reg
                ? "bg-navy text-ivory"
                : "border border-line bg-paper text-muted hover:text-ink hover:bg-sand"
            )}
          >
            {reg === "all" ? "All Regions" : reg}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <DestinationCard key={item.destination.slug} circumstances={item} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-12 text-center text-muted">
          <p className="text-base font-semibold text-ink">No destinations match your filters</p>
          <p className="mt-1 text-xs">Try selecting a different region or clearing the search text.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedRegion("all");
              setSelectedVisibility("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-lg bg-sand px-3.5 py-1.5 text-xs font-semibold text-navy hover:bg-gold/30"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </Container>
  );
}
