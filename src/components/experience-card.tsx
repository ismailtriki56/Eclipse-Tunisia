"use client";

import Link from "next/link";
import type { Experience } from "@/data/experiences";
import { getDestination } from "@/data/destinations";
import { Card } from "@/components/ui/card";
import { formatHours, formatMoney } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { destinationText } from "@/lib/destination-text";
import { localePath } from "@/lib/locale-path";
import { categoryText, experienceText, priceBasisText } from "@/lib/experience-text";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const { locale, t } = useLanguage();
  const copy = experienceText(t, experience);
  const destination = getDestination(experience.destinationSlug);
  const destinationName = destination
    ? destinationText(t, destination).name
    : t.nav.destinations;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift border border-line bg-paper">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {categoryText(t, experience.category)}
        </span>
        {experience.isSample ? (
          <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-muted">
            {t.experienceText.sampleListing}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-gold-600 transition-colors">
          <Link href={localePath(locale, `/experiences/${experience.slug}`)}>
            {copy.title}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-muted">
          {destinationName} &middot;{" "}
          <span className="text-ink/70">{copy.providerName}</span>
        </p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
          {copy.summary}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              {formatMoney(experience.priceAmount, experience.priceCurrency)}
            </p>
            <p className="text-xs text-muted">
              {priceBasisText(t, experience)} &middot;{" "}
              {formatHours(experience.durationHours)} &middot;{" "}
              {t.experienceText.cardMax} {experience.groupSizeMax}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={localePath(locale, `/experiences/${experience.slug}`)}
              className="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-gold/30 transition-colors"
            >
              <span>{t.experienceText.details}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}


