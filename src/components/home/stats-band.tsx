"use client";

import { eclipseFacts, totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { destinationText } from "@/lib/destination-text";
import { useLanguage } from "@/context/language-context";

export function StatsBand() {
  const { t } = useLanguage();
  const longest = totalityDestinations()[0];
  const longestName = longest
    ? destinationText(t, longest.destination).name
    : "Sfax";
  const greatestClock = eclipseFacts.greatestEclipseLocal.split(" ")[0];

  const items = [
    {
      label: t.stats.longest,
      value: formatDuration(longest?.centralDurationSeconds ?? null, {
        minute: t.hero.minutes,
        second: t.hero.seconds,
      }),
      note: t.stats.longestLabel.replace("{place}", longestName),
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
    <section className="reveal bg-navy text-ivory">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-5 py-16 sm:px-8 lg:grid-cols-4 lg:py-20">
        {items.map((item) => (
          <div key={item.label} className="border-t border-gold/30 pt-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">
              {item.label}
            </p>
            <p className="mt-2 font-display text-[2.625rem] font-semibold leading-none tracking-tight text-gold">
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ivory/55">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
