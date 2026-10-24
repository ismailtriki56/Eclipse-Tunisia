"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import type { TravelPackage } from "@/data/packages";
import { formatMoney } from "@/lib/format";
import { packagePlannerHref, quotePackage } from "@/lib/packages";
import { cn } from "@/lib/cn";

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function PackageCustomizer({ pkg }: { pkg: TravelPackage }) {
  const [startDate, setStartDate] = useState(
    pkg.nights >= 5 ? "2027-07-30" : "2027-07-31",
  );
  const [nights, setNights] = useState(pkg.nights);
  const [travellers, setTravellers] = useState(2);
  const [roomId, setRoomId] = useState(pkg.roomOptions[0]?.id ?? "standard");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [familyFriendly, setFamilyFriendly] = useState(false);

  const quote = useMemo(
    () =>
      quotePackage(pkg, {
        nights,
        travellers,
        roomId,
        addOnIds,
      }),
    [pkg, nights, travellers, roomId, addOnIds],
  );

  const plannerHref = packagePlannerHref(pkg, {
    nights,
    travellers,
    roomId,
    addOnIds,
    startDate,
    familyFriendly,
  });

  const toggleAddOn = (id: string) => {
    setAddOnIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
      <div className="border-b border-line bg-navy px-6 py-7 text-ivory sm:px-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
          Build an illustrative outline
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Adjust the trip, see the price basis.
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ivory/65">
          This calculator is a planning tool, not a checkout. Flights are
          excluded, availability is not checked, and the total is not a quote.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-7 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <CalendarDays className="h-3.5 w-3.5" />
                Arrival
              </span>
              <input
                type="date"
                value={startDate}
                min="2027-07-27"
                max="2027-08-01"
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm font-medium text-ink focus:border-navy focus:outline-none"
              />
              <span className="mt-1.5 block text-[0.7rem] text-muted">
                Departure {formatDate(addDays(startDate, nights))}
              </span>
            </label>

            <div>
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <Users className="h-3.5 w-3.5" />
                Travellers
              </span>
              <div className="mt-2 flex h-[2.85rem] items-center justify-between rounded-xl border border-line bg-ivory px-2">
                <button
                  type="button"
                  aria-label="Remove a traveller"
                  onClick={() => setTravellers((value) => Math.max(1, value - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-navy"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono text-sm text-ink">
                  {travellers} {travellers === 1 ? "person" : "people"}
                </span>
                <button
                  type="button"
                  aria-label="Add a traveller"
                  onClick={() => setTravellers((value) => Math.min(8, value + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-navy"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="mt-1.5 block text-[0.7rem] text-muted">
                Prices assume two sharing unless solo.
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={familyFriendly}
            onClick={() => setFamilyFriendly((value) => !value)}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
              familyFriendly
                ? "border-navy bg-sand/40"
                : "border-line bg-ivory hover:border-line-strong",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                familyFriendly
                  ? "border-navy bg-navy text-gold"
                  : "border-line-strong bg-white text-transparent",
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">
                Family-friendly pacing
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                Sends a relaxed pace and family preference to the planner. It
                does not change the price and does not guarantee child-friendly
                rooms or activities.
              </span>
            </span>
          </button>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Nights
            </span>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNights(value)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                    nights === value
                      ? "border-navy bg-navy text-ivory"
                      : "border-line bg-ivory text-muted hover:border-navy hover:text-navy",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Room
            </span>
            <div className="mt-2 space-y-2">
              {pkg.roomOptions.map((option) => {
                const active = roomId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRoomId(option.id)}
                    className={cn(
                      "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-navy bg-sand/40"
                        : "border-line bg-ivory hover:border-line-strong",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">
                        {option.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink">
                      {option.priceDelta === 0
                        ? "Included"
                        : `+${formatMoney(option.priceDelta, pkg.currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Optional additions
            </span>
            <div className="mt-2 space-y-2">
              {pkg.addOns.map((addOn) => {
                const active = addOnIds.includes(addOn.id);
                return (
                  <button
                    key={addOn.id}
                    type="button"
                    onClick={() => toggleAddOn(addOn.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-navy bg-sand/40"
                        : "border-line bg-ivory hover:border-line-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                        active
                          ? "border-navy bg-navy text-gold"
                          : "border-line-strong bg-white text-transparent",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {addOn.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">
                        {addOn.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink">
                      +{formatMoney(addOn.pricePerPerson, pkg.currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="border-t border-line bg-ivory p-6 lg:border-l lg:border-t-0 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Illustrative total
          </p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {formatMoney(quote.total, pkg.currency)}
          </p>
          <p className="mt-2 text-sm text-muted">
            {travellers} {travellers === 1 ? "traveller" : "travellers"} ·{" "}
            {nights} nights ·{" "}
            {formatMoney(quote.perPerson, pkg.currency)} per person before
            supplement
          </p>

          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
            {quote.lines.map((line) => (
              <div key={line.label} className="flex items-start justify-between gap-4">
                <div>
                  <dt className="font-medium text-ink">{line.label}</dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-muted">
                    {line.detail}
                  </dd>
                </div>
                <dd className="shrink-0 font-mono text-xs text-ink">
                  {line.amount === 0
                    ? "Included"
                    : `${line.amount > 0 ? "+" : ""}${formatMoney(line.amount, pkg.currency)}`}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-xl border border-gold-600/30 bg-gold/10 p-4 text-xs leading-relaxed text-ink">
            This is an illustrative planning figure. No hotel, flight, transfer
            or activity is held or confirmed. Final pricing would be quoted
            separately after checking dates, hotels and availability.
          </div>

          <div className="mt-6 space-y-2.5">
            <Link
              href={plannerHref}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-navy-800"
            >
              Take this outline to the planner
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/packages"
              className="flex w-full items-center justify-center rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
            >
              Compare packages
            </Link>
          </div>

          <p className="mt-4 text-center text-[0.7rem] text-muted">
            Flights are excluded. No payment is taken.
          </p>
        </aside>
      </div>
    </div>
  );
}
