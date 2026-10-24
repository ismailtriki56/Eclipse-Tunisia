"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "@/components/home/countdown";
import { images } from "@/data/images";
import { site } from "@/lib/site";
import {
  eclipseFacts,
  totalityDestinations,
} from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { useLanguage } from "@/context/language-context";

export function Hero() {
  const hero = images.djerbaBeach;
  const longest = totalityDestinations()[0];
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <Image
          src={hero.url}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-px w-10 rule-gradient" />
            {t.hero.eventDate}
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-ivory text-balance sm:text-6xl lg:text-7xl">
            {t.hero.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85 text-pretty">
            {t.hero.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/packages" size="lg" variant="inverse">
              {t.hero.planTrip}
            </ButtonLink>
            <ButtonLink href="/explorer" size="lg" variant="outline">
              {t.hero.discoverTunisia}
            </ButtonLink>
          </div>

          {(t.hero as unknown as { whyTravel?: string; whyTravelDesc?: string }).whyTravel && (
            <div className="mt-8 max-w-xl rounded-2xl border border-white/20 bg-black/20 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {(t.hero as unknown as { whyTravel?: string }).whyTravel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                {(t.hero as unknown as { whyTravelDesc?: string }).whyTravelDesc}
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/15 pt-10 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/50">
              {t.hero.timeRemaining}
            </p>
            <Countdown target={site.greatestEclipseUtc} className="mt-4" />
            <p className="mt-3 text-sm text-ivory/60">
              {t.hero.greatestEclipseNote} Eclipse is in the morning in Tunisia.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:gap-x-14">
            {[
              {
                term: t.hero.djerbaLongest,
                detail: formatDuration(longest?.centralDurationSeconds ?? null),
              },
              { term: t.hero.pathWidth, detail: eclipseFacts.pathWidthKm + " km" },
              { term: t.hero.greatestEclipse, detail: "11:06:34 Tunis" },
              { term: t.hero.saros, detail: "#" + eclipseFacts.saros },
            ].map((item) => (
              <div key={item.term}>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                  {item.term}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ivory">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
