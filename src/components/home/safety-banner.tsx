"use client";

import { Eye } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export function SafetyBanner() {
  const { t } = useLanguage();

  return (
    <section className="reveal bg-gold/15 py-16 sm:py-[90px]">
      <Container>
        <div className="flex flex-col gap-6 rounded-[4px] border border-gold/40 bg-gold/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-600">
                {t.home.safetyEyebrow}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
                {t.home.safetyTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/75">
                {t.home.safetyBody}
              </p>
            </div>
          </div>
          <ButtonLink href="/safety" variant="primary" className="shrink-0">
            {t.home.readSafety}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
