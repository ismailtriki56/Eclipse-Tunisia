import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container, SectionHeading } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/packages/package-card";
import { packages } from "@/data/packages";
import { getDestination } from "@/data/destinations";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { formatDuration, formatMoney } from "@/lib/format";
import { getDictionary, isLocale } from "@/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  return { title: t.packages.title, description: t.packages.description };
}

export default async function PackagesPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  const text = t.packageText as Record<string, { name: string }>;

  const notes = [
    { title: t.packages.whatPriceIs, body: t.packages.whatPriceIsBody },
    { title: t.packages.whatPriceIsNot, body: t.packages.whatPriceIsNotBody },
    { title: t.packages.howToUse, body: t.packages.howToUseBody },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.packages.headerEyebrow}
        title={t.packages.headerTitle}
        description={t.packages.headerDesc}
      />

      <Container className="py-14 sm:py-20">
        <div className="rounded-2xl border border-gold-600/30 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-ink">
          {t.packages.illustrativeBanner}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow={t.packages.headerEyebrow}
            title={t.packages.sideBySide}
            description={t.packages.sideBySideDesc}
          />

          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ivory">
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.packages.headerEyebrow}
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.packages.variant}
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.common.nights}
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.common.totalityAtBase}
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.common.from}
                  </th>
                  <th className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t.packages.bestFor}
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => {
                  const destination = getDestination(pkg.destinationSlug);
                  const circumstances = destination
                    ? circumstancesFor(destination)
                    : null;
                  return (
                    <tr key={pkg.slug} className="border-b border-line/70 last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-display text-base font-semibold text-ink">
                          {text[pkg.slug]?.name ?? pkg.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">{pkg.area}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {destination?.name ?? pkg.eclipseBase}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-ink">
                        {pkg.nights}
                      </td>
                      <td className="px-5 py-4">
                        {circumstances?.visibility === "total" ? (
                          <Badge tone="total">
                            {formatDuration(circumstances.centralDurationSeconds)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted">{t.common.partial}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-display text-lg font-semibold text-ink">
                        {formatMoney(pkg.basePricePerPerson, pkg.currency)}
                      </td>
                      <td className="px-5 py-4 text-xs leading-relaxed text-muted">
                        {pkg.bestFor.join(" · ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {notes.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-display text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
