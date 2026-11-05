"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImageOff,
  Scale,
  Search,
  Star,
  X,
} from "lucide-react";
import { stays, stayCities, type Stay } from "@/data/stays";
import { getImage, imageCredit } from "@/data/images";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { getDestination } from "@/data/destinations";
import { destinationText } from "@/lib/destination-text";

export function StaysDirectory() {
  const { t } = useLanguage();
  const [city, setCity] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<{
    name: string;
    index: number;
    photos: ReturnType<typeof getImage>[];
  } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") {
        setLightbox((current) =>
          current
            ? {
                ...current,
                index: (current.index + 1) % current.photos.length,
              }
            : current,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightbox((current) =>
          current
            ? {
                ...current,
                index:
                  (current.index - 1 + current.photos.length) %
                  current.photos.length,
              }
            : current,
        );
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const cityLabel = (name: string | null) => {
    if (name === null) return t.stays.all;
    const stay = stays.find((item) => item.city === name);
    const destination = stay ? getDestination(stay.destinationSlug) : null;
    return destination ? destinationText(t, destination).name : name;
  };

  const hotelNotes = t.hotelText as Record<string, { whyEclipse: string }>;
  const hotelDetails = t.hotelDetail as Record<
    string,
    {
      setting: string;
      character: string;
      summary: string;
      highlights: string[];
      bestFor: string[];
    }
  >;

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
    { label: t.stays.city, render: (stay: Stay) => cityLabel(stay.city) },
    {
      label: t.stays.setting,
      render: (stay: Stay) =>
        hotelDetails[stay.slug]?.setting ?? stay.setting,
    },
    {
      label: t.stays.character,
      render: (stay: Stay) =>
        hotelDetails[stay.slug]?.character ?? stay.character,
    },
    {
      label: t.stays.bestFor,
      render: (stay: Stay) =>
        (hotelDetails[stay.slug]?.bestFor ?? stay.bestFor).join(" · "),
    },
    {
      label: t.stays.highlights,
      render: (stay: Stay) =>
        (hotelDetails[stay.slug]?.highlights ?? stay.highlights).join(" · "),
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
              {cityLabel(option)}
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
          const detail = hotelDetails[stay.slug];
          return (
            <article
              key={stay.slug}
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-colors",
                isSelected ? "border-navy" : "border-line",
              )}
            >
              <div className="relative">
                <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1 bg-sand">
                  {[0, 1, 2].map((index) => {
                    const asset = photos[index];
                    const large = index === 0;
                    return asset ? (
                      <button
                        key={asset.key}
                        type="button"
                        onClick={() =>
                          setLightbox({ name: stay.name, index, photos })
                        }
                        aria-label={`${t.common.viewGallery}: ${stay.name}`}
                        className={cn(
                          "group relative overflow-hidden bg-sand",
                          large && "col-span-2 row-span-2",
                        )}
                      >
                        <Image
                          src={asset.url}
                          alt={asset.alt}
                          width={asset.width}
                          height={asset.height}
                          sizes={
                            large
                              ? "(min-width: 768px) 30vw, 60vw"
                              : "(min-width: 768px) 15vw, 30vw"
                          }
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </button>
                    ) : (
                      <div
                        key={`placeholder-${index}`}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 bg-sand p-2 text-center text-muted",
                          large && "col-span-2 row-span-2",
                        )}
                      >
                        <ImageOff className="h-5 w-5" aria-hidden />
                        <span className="text-[0.55rem] font-medium uppercase tracking-[0.12em]">
                          {t.stays.photoComingSoon}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {photos.length > 0 ? (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/70 to-transparent"
                    />
                    <p className="pointer-events-none absolute bottom-2 start-3 text-[0.58rem] font-medium uppercase tracking-[0.1em] text-ivory/80">
                      {t.common.photoCredit}: {imageCredit(photos[0])}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="outline">{cityLabel(stay.city)}</Badge>
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
                    <p className="mt-1 text-sm text-clay">
                      {detail?.character ?? stay.character}
                    </p>
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
                  {detail?.summary ?? stay.summary}
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
                    <dd className="mt-1 text-ink">
                      {detail?.setting ?? stay.setting}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.12em] text-muted">
                      {t.stays.bestFor}
                    </dt>
                    <dd className="mt-1 text-ink">
                      {(detail?.bestFor ?? stay.bestFor).join(" · ")}
                    </dd>
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

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.name}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-ivory">
              <p className="text-sm font-medium">{lightbox.name}</p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label={t.common.close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-white/30 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative overflow-hidden bg-black/30">
              <Image
                src={lightbox.photos[lightbox.index].url}
                alt={lightbox.photos[lightbox.index].alt}
                width={lightbox.photos[lightbox.index].width}
                height={lightbox.photos[lightbox.index].height}
                sizes="90vw"
                className="max-h-[75vh] w-full object-contain"
              />
              {lightbox.photos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox((current) =>
                        current
                          ? {
                              ...current,
                              index:
                                (current.index - 1 + current.photos.length) %
                                current.photos.length,
                            }
                          : current,
                      )
                    }
                    aria-label={t.common.previous}
                    className="absolute start-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] bg-navy/75 text-ivory transition-colors hover:bg-navy"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox((current) =>
                        current
                          ? {
                              ...current,
                              index: (current.index + 1) % current.photos.length,
                            }
                          : current,
                      )
                    }
                    aria-label={t.common.next}
                    className="absolute end-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] bg-navy/75 text-ivory transition-colors hover:bg-navy"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.12em] text-ivory/60">
              {t.common.photoCredit}: {imageCredit(lightbox.photos[lightbox.index])}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

