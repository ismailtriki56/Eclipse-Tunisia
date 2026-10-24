"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { campaigns, type CampaignTheme } from "@/data/campaigns";
import { Container } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/language-context";

const themes: Record<CampaignTheme, string> = {
  night:
    "bg-[radial-gradient(circle_at_20%_20%,#223d63_0%,#0d1826_45%,#060b12_100%)] text-ivory",
  coast:
    "bg-[linear-gradient(135deg,#f4ead8_0%,#e8d5b8_45%,#d7bf9a_100%)] text-navy",
  desert:
    "bg-[linear-gradient(150deg,#b5623f_0%,#8e462e_52%,#3a211c_100%)] text-ivory",
};

const accents: Record<CampaignTheme, string> = {
  night: "text-gold",
  coast: "text-clay",
  desert: "text-gold",
};

export function CampaignWall() {
  const [lead, ...rest] = campaigns;
  const { t } = useLanguage();

  return (
    <section className="bg-ivory py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              {t.campaigns?.eyebrow || "Eclipse travel campaigns"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t.campaigns.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {t.campaigns.subtitle}
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {t.campaigns.illustrative}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Link
            href={lead.href}
            className={cn(
              "group relative isolate overflow-hidden rounded-3xl p-7 shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:p-10",
              themes[lead.theme],
            )}
          >
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/15"
            />
            <div
              aria-hidden
              className="absolute -right-8 top-10 h-40 w-40 rounded-full border border-white/10"
            />
            <div className="relative flex min-h-[21rem] flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                    {lead.category}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold">
                    {lead.brand}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border border-current/30 font-display text-sm font-semibold",
                    accents[lead.theme],
                  )}
                >
                  {lead.mark}
                </span>
              </div>

              <div className="mt-14 max-w-lg">
                <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                  {lead.headline}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-current/70">
                  {lead.body}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-end justify-between gap-5 border-t border-current/15 pt-5">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-current/50">
                    {lead.detail}
                  </p>
                  <p className="mt-1 text-[0.7rem] font-medium text-current/50">
                    {lead.disclosure}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-semibold",
                    accents[lead.theme],
                  )}
                >
                  {lead.ctaLabel}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          <div className="grid gap-5">
            {rest.map((campaign) => (
              <Link
                key={campaign.id}
                href={campaign.href}
                className={cn(
                  "group relative isolate flex min-h-[10rem] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-8",
                  themes[campaign.theme],
                )}
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/15"
                />
                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-current/55">
                      {campaign.category}
                    </p>
                    <p className="mt-1.5 font-display text-xl font-semibold">
                      {campaign.brand}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/25 font-display text-xs font-semibold",
                      accents[campaign.theme],
                    )}
                  >
                    {campaign.mark}
                  </span>
                </div>
                <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4">
                  <div className="max-w-md">
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
                      {campaign.headline}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-current/65">
                      {campaign.disclosure}
                    </p>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      accents[campaign.theme],
                    )}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
