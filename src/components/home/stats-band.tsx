"use client";

import { eclipseFacts, totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { useLanguage } from "@/context/language-context";

export function StatsBand() {
  const { t } = useLanguage();
  const longest = totalityDestinations()[0];
  const greatestClock = eclipseFacts.greatestEclipseLocal.split(" ")[0];

  const items = [
    {
      label: t.stats.longest,
      value: formatDuration(longest?.centralDurationSeconds ?? null),
      note: t.stats.longestLabel,
    },
    {
      label: t.stats.greatest,
      value: greatestClock,
      note: t.stats.greatestLabel,
    },
    {
      label: t.stats.width,
      value: `${eclipseFacts.pathWidthKm} km`,
      note: t.stats.widthLabel,
    },
    {
      label: t.stats.saros,
      value: `#${eclipseFacts.saros}`,
      note: t.stats.sarosLabel,
    },
  ];

  return (
    <section className="bg-navy text-ivory">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">
              {item.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-gold sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ivory/55">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
