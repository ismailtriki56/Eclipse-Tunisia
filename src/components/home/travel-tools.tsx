"use client";

import Link from "next/link";
import { ArrowUpRight, BedDouble, Plane } from "lucide-react";
import { Container } from "@/components/ui/card";
import { stays } from "@/data/stays";
import { airports } from "@/data/flights";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";

export function TravelTools() {
  const { t, locale } = useLanguage();

  return (
    <section className="reveal bg-white py-16 sm:py-[90px]">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href={localePath(locale, "/stays")}
            className="group relative overflow-hidden rounded-[4px] bg-navy p-7 text-ivory shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10"
            />
            <BedDouble className="h-6 w-6 text-gold" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {t.home.staysEyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {t.home.staysTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
              {t.home.staysDesc}
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              {t.home.openStays}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <span className="sr-only">{stays.length}</span>
          </Link>

          <Link
            href={localePath(locale, "/flights")}
            className="group relative overflow-hidden rounded-[4px] bg-sand p-7 text-navy shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border border-navy/10"
            />
            <Plane className="h-6 w-6 text-clay" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
              {t.home.flightsEyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {t.home.flightsTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/70">
              {t.home.flightsDesc}
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-clay">
              {t.home.compareFlights}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <span className="sr-only">{airports.length}</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
