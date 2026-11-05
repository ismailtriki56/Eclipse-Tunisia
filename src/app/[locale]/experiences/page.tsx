import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-shell";
import { ExperienceCatalog } from "@/components/experiences/experience-catalog";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import { experiencesEnabled } from "@/lib/features";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

function dictionaryFor(locale: string) {
  return getDictionary(isLocale(locale) ? locale : defaultLocale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionaryFor(locale);
  return {
    title: t.experiencePage.metadataTitle,
    description: t.experiencePage.metadataDescription,
  };
}

export default async function ExperiencesPage({ params }: Props) {
  if (!experiencesEnabled) notFound();
  const { locale } = await params;
  const t = dictionaryFor(locale);

  return (
    <>
      <PageHeader
        eyebrow={t.experiencePage.eyebrow}
        title={t.experiencePage.title}
        description={t.experiencePage.description}
      />
      <ExperienceCatalog />
    </>
  );
}
