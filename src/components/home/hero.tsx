"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "@/components/home/countdown";
import { images, imageCredit } from "@/data/images";
import { site } from "@/lib/site";
import { totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { destinationText } from "@/lib/destination-text";
import { useLanguage } from "@/context/language-context";

export function Hero() {
  const { t } = useLanguage();
  const hero = images.eclipseHero;
  const longest = totalityDestinations()[0];
  const duration =
    formatDuration(longest?.centralDurationSeconds ?? null, {
      minute: t.hero.minutes,
      second: t.hero.seconds,
    }) ?? t.common.partial;
  const place = longest ? destinationText(t, longest.destination).name : "Sfax";
  const subheadline = t.hero.subheadline
    .replace("{place}", place)
    .replace("{duration}", duration);

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <Image
          src={hero.url}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes="100vw"
          className="hero-image h-full w-full object-cover"
        />
        <div aria-hidden className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-36 sm:px-8 sm:pb-20 sm:pt-44">
        <div className="max-w-[46rem]">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-px w-10 bg-gold/70" />
            {t.hero.eyebrow}
          </p>

          <h1 className="mt-7 font-display text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-ivory text-balance sm:text-6xl lg:text-[5rem]">
            {t.hero.headline}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ivory/85 text-pretty sm:text-lg">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/packages" size="lg" variant="inverse">
              {t.hero.viewPackages}
            </ButtonLink>
            <ButtonLink href="/explorer" size="lg" variant="outline">
              {t.hero.explorePath}
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-7">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory/50">
            {t.hero.countdown}
          </p>
          <Countdown
            target={site.greatestEclipseUtc}
            className="mt-3"
            labels={{
              days: t.hero.days,
              hours: t.hero.hours,
              minutes: t.hero.minutes,
              seconds: t.hero.seconds,
              complete: t.hero.complete,
            }}
          />
          <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ivory/40">
            {t.hero.illustration} · {t.common.photoCredit}: {imageCredit(hero)} · Wikimedia Commons
          </p>
        </div>
      </div>
    </section>
  );
}
