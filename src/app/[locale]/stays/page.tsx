import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { StaysDirectory } from "@/components/stays/stays-directory";
import { stays } from "@/data/stays";
import { getDictionary, isLocale } from "@/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  return { title: t.stays.title, description: t.stays.description };
}

export default async function StaysPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");

  const facts = [
    { label: t.stays.whatVerified, body: t.stays.whatVerifiedBody },
    { label: t.stays.whatNotShown, body: t.stays.whatNotShownBody },
    { label: t.stays.beforeBook, body: t.stays.beforeBookBody },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.nav.stays}
        title={t.stays.headerTitle}
        description={t.stays.headerDesc}
      />

      <Container className="py-12 sm:py-16">
        <div className="mb-8 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-3 sm:p-6">
          {facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {fact.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{fact.body}</p>
            </div>
          ))}
        </div>

        <StaysDirectory />

        <p className="mt-8 text-xs leading-relaxed text-muted">
          {t.stays.note.replace("{count}", String(stays.length))}
        </p>
      </Container>
    </>
  );
}
