"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getImage, imageCredit } from "@/data/images";
import { getDestination } from "@/data/destinations";
import type { TravelPackage } from "@/data/packages";
import { formatDuration, formatMoney } from "@/lib/format";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { availabilityFor } from "@/data/availability";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";
import { cn } from "@/lib/cn";

export function PackageCard({
  pkg,
  isLongest = false,
}: {
  pkg: TravelPackage;
  isLongest?: boolean;
}) {
  const asset = getImage(pkg.imageKey);
  const destination = getDestination(pkg.destinationSlug);
  const { t, locale } = useLanguage();
  const duration = destination
    ? formatDuration(circumstancesFor(destination).centralDurationSeconds, {
        minute: t.hero.minutes,
        second: t.hero.seconds,
      })
    : null;
  const text = (
    t.packageText as Record<string, { name: string; tagline: string; summary: string }>
  )[pkg.slug];
  const area = (
    t.packageDetail as Record<string, { area: string } | undefined>
  )[pkg.slug]?.area;
  const status = availabilityFor(pkg.slug);
  const soldOut = status === "sold_out";
  const href = localePath(locale, `/packages/${pkg.slug}`);

  return (
    <article
      className={cn(
        "group relative z-0 flex flex-col overflow-hidden rounded-[4px] bg-paper shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        isLongest ? "border-2 border-gold" : "border border-line",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={asset.url}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            soldOut && "grayscale-[35%] brightness-90",
          )}
        />
        {soldOut ? (
          <div aria-hidden className="absolute inset-0 bg-navy/35" />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/75 to-transparent"
        />

        {isLongest ? (
          <p className="absolute left-0 top-4 border-y border-r border-gold/50 bg-navy/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold">
            {t.packages.longestRibbon}
          </p>
        ) : null}

        {status !== "open" ? (
          <div className="absolute right-3 top-3">
            <Badge tone={soldOut ? "soldOut" : "limited"}>
              {soldOut ? t.availability.sold_out : t.availability.limited}
            </Badge>
          </div>
        ) : null}

        <p className="absolute bottom-2.5 end-3 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ivory/80">
          {t.common.photoCredit}: {imageCredit(asset)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
          <span className="font-semibold text-navy">
            {pkg.nights} {pkg.nights === 1 ? t.common.night : t.common.nights}
          </span>
          {area ? ` · ${area}` : ""}
        </p>
        <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {text?.tagline ?? pkg.kicker}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          <Link href={href} className="after:absolute after:inset-0">
            {text?.name ?? pkg.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
          {(text?.summary ?? pkg.summary).replace(
            "{duration}",
            duration ?? t.common.partial,
          )}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
          <div>
            <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {t.common.totalityAtBase}
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink">
              {duration ?? t.common.partial}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {t.common.from}
            </dt>
            <dd className="mt-1 font-display text-[1.4rem] font-semibold leading-none text-ink">
              {formatMoney(pkg.basePricePerPerson, pkg.currency)}
              <span className="ms-1 font-sans text-[0.6rem] font-medium uppercase tracking-wider text-muted">
                {t.common.perPerson}
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-end">
          <ButtonLink
            href={`${href}${soldOut ? "#quote" : ""}`}
            variant={soldOut ? "secondary" : "primary"}
            size="sm"
            className="relative z-10 shrink-0"
          >
            {soldOut ? t.availability.waitlist : t.common.viewOutline}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
