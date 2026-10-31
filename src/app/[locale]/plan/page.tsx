import type { Metadata } from "next";
import { Container } from "@/components/ui/card";
import { QuoteForm } from "@/components/forms/quote-form";
import { getDictionary, isLocale } from "@/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  return {
    title: `${t.form.title} - ${t.meta.title}`,
    description: t.form.description,
  };
}

export default async function PlanPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");

  return (
    <>
      <section className="border-b border-line bg-sand/60">
        <Container className="py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            {t.footer.plan}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-navy text-balance sm:text-5xl">
            {t.form.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {t.form.description}
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {t.home.safetyTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t.home.safetyBody}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t.common.allTimesInTunis}
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t.common.eclipseOccursMorning}
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t.form.privacyNote}
              </li>
            </ul>
          </div>
          <QuoteForm />
        </div>
      </Container>
    </>
  );
}
