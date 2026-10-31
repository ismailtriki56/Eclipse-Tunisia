import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

function dictionaryFor(locale: string) {
  return getDictionary(isLocale(locale) ? locale : defaultLocale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionaryFor(locale);
  return { title: t.safety.title, description: t.safety.description };
}

export default async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  const t = dictionaryFor(locale);

  const phases = [
    {
      title: t.safety.partialTitle,
      safe: false,
      body: t.safety.partialBody,
    },
    {
      title: t.safety.totalityTitle,
      safe: true,
      body: t.safety.totalityBody,
    },
    {
      title: t.safety.outsideTitle,
      safe: false,
      body: t.safety.outsideBody,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.safety.eyebrow}
        title={t.safety.title}
        description={t.safety.description}
      />

      <Container className="py-16 sm:py-20">
        <div className="space-y-5">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full ${
                    phase.safe ? "bg-success" : "bg-danger"
                  }`}
                />
                <h2 className="font-display text-lg font-semibold text-ink">
                  {phase.title}
                </h2>
                <span
                  className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                    phase.safe
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {phase.safe ? t.safety.safeLabel : t.safety.protectionLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {phase.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-navy p-6 text-ivory sm:p-8">
          <h2 className="font-display text-xl font-semibold">
            {t.safety.rulesTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ivory/80">
            {t.safety.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <a
            href={site.nasaEclipseUrl}
            className="mt-5 inline-block text-sm text-ivory underline underline-offset-2 hover:text-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.safety.nasaLink}
          </a>
        </div>

        <p className="mt-6 text-sm text-muted">{t.safety.disclaimer}</p>
      </Container>
    </>
  );
}
