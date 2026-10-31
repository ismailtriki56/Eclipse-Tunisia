import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin, X } from "lucide-react";
import { Container, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { QuoteForm } from "@/components/forms/quote-form";
import { getPackage, packages } from "@/data/packages";
import { getDestination } from "@/data/destinations";
import { getImage, imageCredit } from "@/data/images";
import { staysForDestination } from "@/data/stays";
import { availabilityFor } from "@/data/availability";
import { circumstancesFor } from "@/lib/eclipse/destinations";
import { formatDuration, formatMoney } from "@/lib/format";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { localePath } from "@/lib/locale-path";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

interface PackageDetailText {
  area: string;
  bestFor: string[];
  included: string[];
  excluded: string[];
  itinerary: { title: string; body: string }[];
  variants?: Record<string, { label: string; description: string }>;
}

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  const t = getDictionary(isLocale(locale) ? locale : "en");
  const text = (
    t.packageText as Record<string, { name: string; summary: string }>
  )[pkg.slug];
  return {
    title: `${text?.name ?? pkg.name} - ${t.packages.headerEyebrow}`,
    description: text?.summary ?? pkg.summary,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const destination = getDestination(pkg.destinationSlug);
  if (!destination) notFound();

  const activeLocale = (isLocale(locale) ? locale : "en") as Locale;
  const t = getDictionary(activeLocale);
  const text = (
    t.packageText as Record<string, { name: string; tagline: string; summary: string }>
  )[pkg.slug];
  const detail = (
    t.packageDetail as Record<string, PackageDetailText>
  )[pkg.slug];
  const area = detail?.area ?? pkg.area;
  const included = detail?.included ?? pkg.included;
  const excluded = detail?.excluded ?? pkg.excluded;
  const days = pkg.itinerary.map((day, index) => ({
    day: day.day,
    title: detail?.itinerary[index]?.title ?? day.title,
    body: detail?.itinerary[index]?.body ?? day.body,
  }));
  const variants = pkg.variants?.map((variant) => ({
    ...variant,
    ...detail?.variants?.[variant.id],
  }));
  const circumstances = circumstancesFor(destination);
  const asset = getImage(pkg.imageKey);
  const hotels = staysForDestination(pkg.destinationSlug);
  const hotelDetails = t.hotelDetail as Record<string, { character: string }>;
  const duration = formatDuration(circumstances.centralDurationSeconds);
  const status = availabilityFor(pkg.slug);
  const soldOut = status === "sold_out";

  const contactRows = [
    { label: t.packages.firstContact, value: circumstances.localTimes.firstContact },
    { label: t.packages.totalityBegins, value: circumstances.localTimes.secondContact },
    { label: t.packages.maximum, value: circumstances.localTimes.maximum },
    { label: t.packages.totalityEnds, value: circumstances.localTimes.thirdContact },
    { label: t.packages.lastContact, value: circumstances.localTimes.fourthContact },
    { label: t.packages.sunAltitude, value: `${circumstances.sunAltitude.toFixed(0)}°` },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-ivory">
        <div className="absolute inset-0">
          <Image
            src={asset.url}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <Container className="relative py-14 sm:py-20">
          <Link
            href={localePath(activeLocale, "/packages")}
            className="inline-flex items-center gap-2 text-sm font-medium text-ivory/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.backToPackages}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge tone="total">
              {pkg.nights === 0
                ? t.packages.day
                : `${pkg.nights} ${pkg.nights === 1 ? t.common.night : t.common.nights}`}
            </Badge>
            <Badge tone="sample">{t.common.illustrative}</Badge>
            {status === "sold_out" ? (
              <Badge tone="soldOut">{t.availability.sold_out}</Badge>
            ) : status === "limited" ? (
              <Badge tone="limited">{t.availability.limited}</Badge>
            ) : (
              <Badge tone="outline">{t.availability.open}</Badge>
            )}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {text?.name ?? pkg.name}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {text?.tagline ?? pkg.kicker}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
            {(text?.summary ?? pkg.summary).replace(
              "{duration}",
              duration ?? t.common.partial,
            )}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-ivory/50">
            {t.common.photoCredit}: {imageCredit(asset)} · Wikimedia Commons
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {text?.tagline ?? pkg.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              {t.packages.outline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {area}. {t.packages.howToUseBody}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.packages.variant}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {destination.name}
                </p>
              </div>
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.common.totalityAtBase}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {duration ?? t.common.partial}
                </p>
              </div>
              <div className="rounded-xl bg-ivory p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.common.from}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">
                  {formatMoney(pkg.basePricePerPerson, pkg.currency)}
                </p>
              </div>
            </div>

            {variants && variants.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {t.packages.variant}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {variants.map((variant) => (
                    <div key={variant.id} className="rounded-xl border border-line bg-white p-3">
                      <p className="font-display text-base font-semibold text-ink">
                        {variant.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {variant.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>

          <div className="rounded-2xl border border-gold-600/30 bg-gold/10 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {t.common.illustrative}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {t.packages.illustrativeBanner}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {formatMoney(pkg.basePricePerPerson, pkg.currency)} {t.common.perPerson} ·{" "}
              {t.common.illustrativePriceNote}
            </p>
          </div>
        </div>
      </Container>

      <Container className="grid gap-10 pb-14 lg:grid-cols-[1.1fr_0.9fr] sm:pb-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            {t.packages.outline}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            {pkg.nights === 0
              ? t.packages.eclipseDay
              : `${pkg.nights} ${pkg.nights === 1 ? t.common.night : t.common.nights}`}
          </h2>
          <ol className="mt-7 space-y-5">
            {days.map((day) => (
              <li key={day.day} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-xs font-semibold text-gold">
                  {String(day.day).padStart(2, "0")}
                </span>
                <div className="border-b border-line pb-5">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {day.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {day.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              {t.packages.included}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              {t.packages.excluded}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {excluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>

      <Container className="pb-14 sm:pb-20">
        <Card className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
            <div className="bg-navy p-6 text-ivory sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {t.packages.eclipseCircumstances}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {destination.name} · {t.hero.eventDate}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                {t.common.allTimesInTunis}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {contactRows.map((item) => (
                  <div key={item.label}>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory/45">
                      {item.label}
                    </p>
                    <p className="mt-1 font-mono text-sm text-ivory">
                      {item.value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-clay">
                <MapPin className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {t.packages.hotels}
                </p>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                {t.home.staysTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t.packages.hotelsDesc}
              </p>
              {hotels.length === 0 ? (
                <p className="mt-5 rounded-xl border border-line bg-ivory p-4 text-sm text-muted">
                  {t.packages.noHotels}
                </p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {hotels.map((hotel) => (
                    <li
                      key={hotel.slug}
                      className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">{hotel.name}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {hotelDetails[hotel.slug]?.character ?? hotel.character}
                        </p>
                      </div>
                      <a
                        href={hotel.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs font-semibold text-navy hover:underline"
                      >
                        {t.common.officialSite}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                <ButtonLink href="/stays" variant="secondary" size="sm">
                  {t.home.openStays}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>
      </Container>

      <Container className="pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {t.packages.requestQuote}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
              {soldOut ? t.form.waitlistTitle : t.form.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {soldOut ? t.form.waitlistDescription : t.form.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/packages" variant="secondary">
                {t.common.backToPackages}
              </ButtonLink>
              <ButtonLink href="/plan" variant="ghost">
                {t.footer.itinerary}
              </ButtonLink>
            </div>
          </div>
          <QuoteForm
            defaultPackageSlug={pkg.slug}
            mode={soldOut ? "waitlist" : "quote"}
          />
        </div>
      </Container>
    </>
  );
}
