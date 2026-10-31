"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  ExternalLink,
  ImageOff,
  Scale,
  Search,
  Star,
} from "lucide-react";
import { stays, stayCities, type Stay } from "@/data/stays";
import { getImage, imageCredit } from "@/data/images";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

export function StaysDirectory() {
  const { t } = useLanguage();
  const [city, setCity] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const hotelNotes = t.hotelText as Record<string, { whyEclipse: string }>;

  const visible = useMemo(
    () => (city === null ? stays : stays.filter((stay) => stay.city === city)),
    [city],
  );
  const selected = compare
    .map((slug) => stays.find((stay) => stay.slug === slug))
    .filter((stay): stay is Stay => Boolean(stay));

  const toggleCompare = (slug: string) => {
    setCompare((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  };

  const ratingLabel = (stay: Stay) =>
    stay.stars === null
      ? t.stays.guesthouse
      : t.stays.stars.replace("{count}", String(stay.stars));

  const compareRows = [
    { label: t.stays.city, render: (stay: Stay) => stay.city },
    { label: t.stays.setting, render: (stay: Stay) => stay.setting },
    { label: t.stays.character, render: (stay: Stay) => stay.character },
    { label: t.stays.bestFor, render: (stay: Stay) => stay.bestFor.join(" · ") },
    {
      label: t.stays.highlights,
      render: (stay: Stay) => stay.highlights.join(" · "),
    },
    { label: t.stays.starRating, render: (stay: Stay) => ratingLabel(stay) },
    {
      label: t.stays.amenities,
      render: (stay: Stay) =>
        stay.amenities.map((item) => t.stayAmenities[item]).join(" · "),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[null, ...stayCities()].map((option) => (
            <button
              key={option ?? "all"}
              type="button"
              onClick={() => setCity(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                city === option
                  ? "border-navy bg-navy text-ivory"
                  : "border-line bg-white text-muted hover:border-navy hover:text-navy",
              )}
            >
              {option ?? t.stays.all}
            </button>
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {t.stays.results.replace("{count}", String(visible.length))} ·{" "}
          {t.stays.noRates} ·{" "}
          {t.stays.compareStatus.replace("{selected}", String(compare.length))}
        </p>
      </div>

      {selected.length >= 2 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-gold-600" />
              <h2 className="font-display text-lg font-semibold text-ink">
                {t.stays.compareTitle.replace(
                  "{count}",
                  String(selected.length),
                )}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCompare([])}
              className="text-xs font-semibold text-muted hover:text-navy"
            >
              {t.stays.clearComparison}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-start text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-28 py-3 pe-4 text-start text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.stays.compareColumn}
                  </th>
                  {selected.map((stay) => (
                    <th
                      key={stay.slug}
                      className="py-3 pe-4 text-start font-display text-base font-semibold text-ink"
                    >
                      {stay.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-muted">
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-line/70 align-top">
                    <th className="py-3 pe-4 text-start text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      {row.label}
                    </th>
                    {selected.map((stay) => (
                      <td
                        key={stay.slug}
                        className="py-3 pe-4 text-xs leading-relaxed"
                      >
                        {row.render(stay)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th className="py-4 pe-4 text-start text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.stays.officialSite}
                  </th>
                  {selected.map((stay) => (
                    <td key={stay.slug} className="py-4 pe-4">
                      <a
                        href={stay.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                      >
                        {t.stays.visitSite}{" "}
                        <ExternalLink className="h-3 w-3" />
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
          const photos = stay.photoKeys.map(getImage);
          const note = hotelNotes[stay.slug];
          return (
            <article
              key={stay.slug}
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-colors",
                isSelected ? "border-navy" : "border-line",
              )}
            >
              <div className="relative">
                {photos.length > 0 ? (
                  <div
                    className={cn(
                      "grid gap-1",
                      photos.length > 1 ? "grid-cols-2" : "grid-cols-1",
                    )}
                  >
                    {photos.map((asset) => (
                      <div
                        key={asset.key}
                        className="relative aspect-[4/3] overflow-hidden bg-sand"
                      >
                        <Image
                          src={asset.url}
                          alt={asset.alt}
                          width={asset.width}
                          height={asset.height}
                          sizes="(min-width: 768px) 25vw, 90vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex aspect-[16/7] flex-col items-center justify-center gap-2 bg-sand text-muted">
                    <ImageOff className="h-6 w-6" aria-hidden />
                    <span className="text-xs font-medium uppercase tracking-[0.14em]">
                      {t.stays.photoComingSoon}
                    </span>
                  </div>
                )}
                {photos.length > 0 ? (
                  <p className="absolute bottom-2 start-2 rounded-full bg-navy/75 px-2.5 py-1 text-[0.6rem] font-medium text-ivory">
                    {t.common.photoCredit}: {imageCredit(photos[0])}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="outline">{stay.city}</Badge>
                      <Badge tone="total">
                        <Star className="me-1 h-3 w-3" aria-hidden />
                        {ratingLabel(stay)}
                      </Badge>
                      <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted">
                        {t.stays.verified}
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
                    aria-label={(isSelected
                      ? t.stays.removeFromCompare
                      : t.stays.addToCompare
                    ).replace("{name}", stay.name)}
                  >
                    <Check className={cn("h-4 w-4", !isSelected && "opacity-30")} />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {stay.summary}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-muted">
                  <span className="font-semibold uppercase tracking-[0.12em] text-ink">
                    {t.stays.amenities}
                  </span>
                  {" · "}
                  {stay.amenities.map((item) => t.stayAmenities[item]).join(" · ")}
                </p>

                {note ? (
                  <div className="mt-4 rounded-xl bg-ivory p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
                      {t.stays.whyEclipse}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">
                      {note.whyEclipse}
                    </p>
                  </div>
                ) : null}

                <dl className="mt-4 grid gap-3 border-t border-line pt-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.12em] text-muted">
                      {t.stays.setting}
                    </dt>
                    <dd className="mt-1 text-ink">{stay.setting}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.12em] text-muted">
                      {t.stays.bestFor}
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
                    {t.stays.officialSite}{" "}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={stay.bookingSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:underline"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {t.stays.searchRates}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
