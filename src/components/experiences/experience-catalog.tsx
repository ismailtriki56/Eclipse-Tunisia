"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/card";
import { ExperienceCard } from "@/components/experience-card";
import { experiences } from "@/data/experiences";
import { Search, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function ExperienceCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return experiences.filter((exp) => {
      if (activeCategory !== "all" && exp.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          exp.title.toLowerCase().includes(q) ||
          exp.summary.toLowerCase().includes(q) ||
          exp.providerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Experiences" },
    { id: "eclipse-viewing", label: "Eclipse Viewing" },
    { id: "culture", label: "Culture & Walks" },
    { id: "transport", label: "Desert Transfers" },
    { id: "food", label: "Food & Culinary" },
  ];

  return (
    <Container className="py-12 sm:py-16">
      {/* Sample Listing Notice */}
      <div className="rounded-xl border border-gold-600/30 bg-gold/10 p-4 text-xs text-ink flex items-start gap-3">
        <Info className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> All listings below are curated{" "}
          <strong>sample prototypes</strong> created to demonstrate the booking and planning
          architecture for local Tunisian operators, 4x4 drivers, and oasis guides. Real
          partner inventory will be onboarded as agreements finalize.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search experiences, desert tours, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-line bg-ivory pl-10 pr-4 py-2 text-xs font-medium text-ink placeholder:text-muted focus:border-navy focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === cat.id
                  ? "bg-navy text-ivory shadow-xs"
                  : "border border-line bg-ivory text-muted hover:text-navy hover:bg-sand"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((experience) => (
          <ExperienceCard key={experience.slug} experience={experience} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-12 text-center text-muted">
          <p className="text-base font-semibold text-ink">No experiences match your search</p>
          <p className="mt-1 text-xs">Try searching with a different term or select &ldquo;All Experiences&rdquo;.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-lg bg-sand px-3 py-1.5 text-xs font-semibold text-navy hover:bg-gold/30"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </Container>
  );
}
