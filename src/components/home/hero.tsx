"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Countdown } from "@/components/home/countdown";
import { images, imageCredit } from "@/data/images";
import { site } from "@/lib/site";
import { totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { useLanguage } from "@/context/language-context";

export function Hero() {
  const { t } = useLanguage();
  const hero = images.eclipseHero;
  const longest = totalityDestinations()[0];
  const duration =
    formatDuration(longest?.centralDurationSeconds ?? null) ?? t.common.partial;
  const subheadline = t.hero.subheadline.replace("{duration}", duration);

  return (
    <section className="relative isolate flex min-h-[80vh] items-end overflow-hidden bg-navy">
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
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,28,50,.82), rgba(14,28,50,.5) 48%, rgba(14,28,50,.08))",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-px w-10 bg-gold/70" />
            {t.hero.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ivory text-balance sm:text-5xl lg:text-6xl">
            {t.hero.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/85 text-pretty sm:text-lg">
            {subheadline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/packages" size="lg" variant="inverse">
              {t.hero.viewPackages}
            </ButtonLink>
            <ButtonLink href="/explorer" size="lg" variant="outline">
              {t.hero.explorePath}
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-8">
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
            {t.common.photoCredit}: {imageCredit(hero)} · Wikimedia Commons
          </p>
        </div>
      </div>
    </section>
  );
}
