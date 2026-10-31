import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";
import { getDictionary, isLocale, defaultLocale } from "@/i18n";
import type { Dictionary } from "@/i18n";

export type SecondaryPageKey = keyof Dictionary["secondaryPages"];

async function copyFor(
  params: Promise<{ locale: string }>,
  page: SecondaryPageKey,
) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : defaultLocale);
  return t.secondaryPages[page];
}

export async function secondaryPageMetadata(
  params: Promise<{ locale: string }>,
  page: SecondaryPageKey,
): Promise<Metadata> {
  const copy = await copyFor(params, page);
  return { title: copy.title, description: copy.description };
}

export async function SecondaryPage({
  params,
  page,
}: {
  params: Promise<{ locale: string }>;
  page: SecondaryPageKey;
}) {
  const copy = await copyFor(params, page);

  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoon note={copy.note} />
    </>
  );
}
