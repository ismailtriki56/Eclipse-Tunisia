"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { imageCredit } from "@/data/images";
import type { DestinationCircumstances } from "@/lib/eclipse/destinations";
import { getImage } from "@/data/images";
import { useLanguage } from "@/context/language-context";
import { destinationText } from "@/lib/destination-text";
import { localePath } from "@/lib/locale-path";
import { formatDuration } from "@/lib/format";

export function DestinationCard({
  circumstances,
  className,
}: {
  circumstances: DestinationCircumstances;
  className?: string;
}) {
  const { locale, t } = useLanguage();
  const { destination } = circumstances;
  const text = destinationText(t, destination);
  const asset = getImage(destination.imageKey);
  const totality = formatDuration(circumstances.centralDurationSeconds, {
    minute: t.hero.minutes,
    second: t.hero.seconds,
  });
  const isTotal = circumstances.visibility === "total";

  return (
    <article
      className={`group relative z-0 flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${className ?? ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={asset.url}
          alt={text.name}
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/70 to-transparent"
        />
        <p className="pointer-events-none absolute bottom-2 end-3 text-[0.58rem] font-medium uppercase tracking-[0.1em] text-ivory/75">
          {t.common.photoCredit}: {imageCredit(asset)}
        </p>
        <div className="absolute left-3 top-3">
          {isTotal ? (
            <Badge tone="total">
              {t.map.totality} {totality}
            </Badge>
          ) : (
            <Badge tone="partial">
              {t.map.partial} ·{" "}
              {t.common.covered.replace(
                "{percent}",
                (circumstances.obscuration * 100).toFixed(0),
              )}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {text.region}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink">
          <Link
            href={localePath(locale, `/destinations/${destination.slug}`)}
            className="after:absolute after:inset-0"
          >
            {text.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {text.summary}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              {t.common.maximumAt}
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-ink">
              {circumstances.localTimes.maximum ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              {t.map.sunAltitude}
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-ink">
              {circumstances.sunAltitude.toFixed(0)}°
            </dd>
          </div>
        </dl>

      </div>
    </article>
  );
}
