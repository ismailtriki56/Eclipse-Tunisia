"use client";

import { useMemo, useState } from "react";
import { Check, ExternalLink, Search, Scale } from "lucide-react";
import { stays, stayCities } from "@/data/stays";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

export function StaysDirectory() {
  const [city, setCity] = useState("All");
  const [compare, setCompare] = useState<string[]>([]);

  const visible = useMemo(
    () => (city === "All" ? stays : stays.filter((stay) => stay.city === city)),
    [city],
  );
  const selected = compare
    .map((slug) => stays.find((stay) => stay.slug === slug))
    .filter((stay): stay is (typeof stays)[number] => Boolean(stay));

  const toggleCompare = (slug: string) => {
    setCompare((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...stayCities()].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCity(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                city === option
                  ? "border-navy bg-navy text-ivory"
                  : "border-line bg-white text-muted hover:border-navy hover:text-navy",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {visible.length} propert{visible.length === 1 ? "y" : "ies"} · no rates stored ·{" "}
          {compare.length}/3 selected to compare
        </p>
      </div>

      {selected.length >= 2 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-gold-600" />
              <h2 className="font-display text-lg font-semibold text-ink">
                Compare {selected.length} stays
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCompare([])}
              className="text-xs font-semibold text-muted hover:text-navy"
            >
              Clear comparison
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-28 py-3 pr-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Compare
                  </th>
                  {selected.map((stay) => (
                    <th key={stay.slug} className="py-3 pr-4 font-display text-base font-semibold text-ink">
                      {stay.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-muted">
                {[
                  { label: "City", render: (stay: (typeof stays)[number]) => stay.city },
                  { label: "Setting", render: (stay: (typeof stays)[number]) => stay.setting },
                  { label: "Character", render: (stay: (typeof stays)[number]) => stay.character },
                  { label: "Best for", render: (stay: (typeof stays)[number]) => stay.bestFor.join(" · ") },
                  { label: "Highlights", render: (stay: (typeof stays)[number]) => stay.highlights.join(" · ") },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-line/70 align-top">
                    <th className="py-3 pr-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      {row.label}
                    </th>
                    {selected.map((stay) => (
                      <td key={stay.slug} className="py-3 pr-4 text-xs leading-relaxed">
                        {row.render(stay)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th className="py-4 pr-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Official site
                  </th>
                  {selected.map((stay) => (
                    <td key={stay.slug} className="py-4 pr-4">
                      <a
                        href={stay.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                      >
                        Visit site <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {visible.map((stay) => {
          const isSelected = compare.includes(stay.slug);
          return (
            <article
              key={stay.slug}
              className={cn(
                "flex flex-col rounded-2xl border bg-white p-5 shadow-card transition-colors sm:p-6",
                isSelected ? "border-navy" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="outline">{stay.city}</Badge>
                    <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted">
                      {stay.verifiedOn}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                    {stay.name}
                  </h2>
                  <p className="mt-1 text-sm text-clay">{stay.character}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCompare(stay.slug)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isSelected
                      ? "border-navy bg-navy text-gold"
                      : "border-line-strong text-muted hover:border-navy hover:text-navy",
                  )}
                  aria-label={
                    isSelected
                      ? `Remove ${stay.name} from comparison`
                      : `Add ${stay.name} to comparison`
                  }
                >
                  <Check className={cn("h-4 w-4", !isSelected && "opacity-30")} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {stay.summary}
              </p>

              <dl className="mt-4 grid gap-3 border-t border-line pt-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-semibold uppercase tracking-[0.12em] text-muted">
                    Setting
                  </dt>
                  <dd className="mt-1 text-ink">{stay.setting}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-[0.12em] text-muted">
                    Best for
                  </dt>
                  <dd className="mt-1 text-ink">{stay.bestFor.join(" · ")}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                <a
                  href={stay.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:underline"
                >
                  Official website <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={stay.bookingSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:underline"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search current rates
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
