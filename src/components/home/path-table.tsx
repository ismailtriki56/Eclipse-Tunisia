"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { totalityDestinations } from "@/lib/eclipse/destinations";
import { formatDuration } from "@/lib/format";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";

export function PathTable() {
  const { t, locale } = useLanguage();
  const rows = totalityDestinations();

  return (
    <section className="border-y border-line bg-sand/60 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={t.home.pathEyebrow}
            title={t.home.pathTitle}
            description={t.home.pathDesc}
          />
          <ButtonLink href="/destinations" variant="secondary" className="shrink-0">
            {t.home.viewAllDestinations}
          </ButtonLink>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-ivory/70">
                <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.home.destination}
                </th>
                <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.home.region}
                </th>
                <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.home.totalityDuration}
                </th>
                <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.home.magnitude}
                </th>
                <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.home.sunAltitude}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.destination.slug} className="border-b border-line/70 last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={localePath(locale, `/destinations/${row.destination.slug}`)}
                      className="group inline-flex items-center gap-1 font-display text-base font-semibold text-ink hover:text-navy"
                    >
                      {row.destination.name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{row.destination.region}</td>
                  <td className="px-5 py-4 font-mono text-sm text-ink">
                    {formatDuration(row.centralDurationSeconds) ?? t.common.partial}
                  </td>
                  <td className="px-5 py-4 font-mono text-sm text-muted">
                    {row.magnitude.toFixed(3)}
                  </td>
                  <td className="px-5 py-4 font-mono text-sm text-muted">
                    {row.sunAltitude.toFixed(1)}&deg;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {t.common.allTimesInTunis} {t.common.sources}: NASA GSFC.
        </p>
      </Container>
    </section>
  );
}
