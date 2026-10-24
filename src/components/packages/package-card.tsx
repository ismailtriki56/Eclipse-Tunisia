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
import { useLanguage } from "@/context/language-context";

export function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const asset = getImage(pkg.imageKey);
  const destination = getDestination(pkg.destinationSlug);
  const duration = destination
    ? formatDuration(
        circumstancesFor(destination).centralDurationSeconds,
      )
    : null;
  const { t } = useLanguage();

  return (
    <article className="group relative z-0 flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <Image
          src={asset.url}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone="total">{pkg.nights} {t.common?.nights || "nights"}</Badge>
          <Badge tone="sample">{t.common?.illustrative || "Illustrative"}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {pkg.kicker}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink">
          <Link
            href={`/packages/${pkg.slug}`}
            className="after:absolute after:inset-0"
          >
            {pkg.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {pkg.summary}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              {t.common?.totalityAtBase || "Totality at base"}
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-ink">
              {duration ?? "Partial"}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              {t.common?.from || "From"}
            </dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink">
              {formatMoney(pkg.basePricePerPerson, pkg.currency)}
              <span className="ml-1 text-[0.65rem] font-sans font-medium uppercase tracking-wider text-muted">
                {t.common?.perPerson || "pp"}
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[0.7rem] text-muted">
            Photo: {imageCredit(asset)}
          </p>
          <ButtonLink
            href={`/packages/${pkg.slug}`}
            variant="secondary"
            size="sm"
            className="relative z-10 shrink-0"
          >
            {t.common?.viewOutline || "View outline"}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
