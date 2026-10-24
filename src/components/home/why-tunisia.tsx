"use client";

import { Container, SectionHeading } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export function WhyTunisia() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={t.home?.eyebrow || "Why Tunisia"}
          title={t.home.whyTitle}
          description={t.home.whyDesc}
        />
      </Container>
    </section>
  );
}
