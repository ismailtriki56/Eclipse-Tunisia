import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { imageCredit } from "@/data/images";
import type { DestinationCircumstances } from "@/lib/eclipse/destinations";
import { getImage } from "@/data/images";

function formatTotality(seconds: number | null): string | null {
  if (seconds === null) return null;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

export function DestinationCard({
  circumstances,
  className,
}: {
  circumstances: DestinationCircumstances;
  className?: string;
}) {
  const { destination } = circumstances;
  const asset = getImage(destination.imageKey);
  const totality = formatTotality(circumstances.centralDurationSeconds);
  const isTotal = circumstances.visibility === "total";

  return (
    <article
      className={`group relative z-0 flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${className ?? ""}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <Image
          src={asset.url}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          {isTotal ? (
            <Badge tone="total">Totality {totality}</Badge>
          ) : (
            <Badge tone="partial">
              Partial · {(circumstances.obscuration * 100).toFixed(0)}% covered
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {destination.region}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink">
          <Link
            href={`/destinations/${destination.slug}`}
            className="after:absolute after:inset-0"
          >
            {destination.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {destination.summary}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              Maximum at
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-ink">
              {circumstances.localTimes.maximum ?? "—"} local
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
              Sun altitude
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-ink">
              {circumstances.sunAltitude.toFixed(0)}°
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-[0.7rem] text-muted">
          Photo: {imageCredit(asset)}
        </p>
      </div>
    </article>
  );
}
