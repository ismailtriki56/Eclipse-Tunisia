import type { Experience } from "@/data/experiences";
import { getDestination } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatHours, formatMoney } from "@/lib/format";

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
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <Badge>{categoryLabels[experience.category]}</Badge>
        {experience.isSample ? <Badge tone="sample">Sample</Badge> : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {experience.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {destination ? destination.name : "Tunisia"} &middot;{" "}
          {experience.providerName}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {experience.summary}
        </p>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              {formatMoney(experience.priceAmount, experience.priceCurrency)}
            </p>
            <p className="text-xs text-muted">
              {experience.priceBasis} &middot;{" "}
              {formatHours(experience.durationHours)} &middot; up to{" "}
              {experience.groupSizeMax} people
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
