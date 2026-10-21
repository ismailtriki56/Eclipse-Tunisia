import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDuration, formatTimeInZone } from "@/lib/format";

export function DestinationCard({ destination }: { destination: Destination }) {
  const isTotal = destination.visibility === "total";
  const maxTime = formatTimeInZone(
    destination.circumstances.maximum,
    destination.circumstances.timeZone,
  );
  const totality = formatDuration(destination.circumstances.totalitySeconds);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div
        aria-hidden
        className={`relative h-32 ${
          isTotal
            ? "bg-gradient-to-br from-navy via-navy-800 to-navy text-gold"
            : "bg-gradient-to-br from-navy-800 to-navy-700 text-ivory"
        }`}
      >
        <span
          className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isTotal ? "bg-navy shadow-[0_0_0_6px_var(--color-gold)]" : "bg-gold"
          }`}
        />
        {!isTotal ? (
          <span
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-800"
            aria-hidden
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-ink">
            <Link href={`/explorer/${destination.slug}`} className="hover:text-gold-600">
              {destination.name}
            </Link>
          </h3>
          <Badge tone={isTotal ? "total" : "partial"}>
            {isTotal ? "Totality" : "Partial"}
          </Badge>
        </div>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
          {destination.region}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {destination.summary}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-xs text-muted">Maximum</dt>
            <dd className="font-semibold text-ink">{maxTime ?? "Not verified"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Totality</dt>
            <dd className="font-semibold text-ink">
              {totality ?? "None"}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
