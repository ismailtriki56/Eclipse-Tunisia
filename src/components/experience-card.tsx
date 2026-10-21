import Link from "next/link";
import type { Experience } from "@/data/experiences";
import { getDestination } from "@/data/destinations";
import { Card } from "@/components/ui/card";
import { formatHours, formatMoney } from "@/lib/format";
import { ChevronRight } from "lucide-react";

const categoryLabels: Record<Experience["category"], string> = {
  "eclipse-viewing": "Eclipse viewing",
  transport: "Transport",
  culture: "Culture",
  history: "History",
  food: "Food & drink",
  package: "Package",
  accommodation: "Accommodation",
};

export function ExperienceCard({ experience }: { experience: Experience }) {
  const destination = getDestination(experience.destinationSlug);

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift border border-line bg-paper">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {categoryLabels[experience.category]}
        </span>
        {experience.isSample ? (
          <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-muted">
            Sample Listing
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-gold-600 transition-colors">
          <Link href={`/experiences/${experience.slug}`}>{experience.title}</Link>
        </h3>

        <p className="mt-1 text-xs text-muted">
          {destination ? destination.name : "Tunisia"} &middot;{" "}
          <span className="text-ink/70">{experience.providerName}</span>
        </p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
          {experience.summary}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              {formatMoney(experience.priceAmount, experience.priceCurrency)}
            </p>
            <p className="text-xs text-muted">
              {experience.priceBasis} &middot;{" "}
              {formatHours(experience.durationHours)} &middot; max{" "}
              {experience.groupSizeMax}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/experiences/${experience.slug}`}
              className="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-gold/30 transition-colors"
            >
              <span>Details</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
