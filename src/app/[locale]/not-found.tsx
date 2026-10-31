"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";
import { getDictionary, isLocale } from "@/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const t = getDictionary(isLocale(segment) ? segment : "en");

  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {t.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        {t.notFound.description}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">{t.notFound.home}</ButtonLink>
        <ButtonLink href="/explorer" variant="secondary">
          {t.notFound.explorer}
        </ButtonLink>
      </div>
    </Container>
  );
}
