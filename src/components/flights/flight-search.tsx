"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarDays, Plane, Search, Users } from "lucide-react";
import { airports, commonOrigins, flightSearchUrl, timetableUrl } from "@/data/flights";
import { useLanguage } from "@/context/language-context";

export function FlightSearch() {
  const { t } = useLanguage();
  const [origin, setOrigin] = useState("LHR");
  const [destination, setDestination] = useState("MIR");
  const [departDate, setDepartDate] = useState("2027-07-31");
  const [returnDate, setReturnDate] = useState("2027-08-05");
  const [travellers, setTravellers] = useState(2);

  const url = flightSearchUrl({
    origin,
    destination,
    departDate,
    returnDate,
    travellers,
  });
  const selectedAirport = airports.find((airport) => airport.iata === destination);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <form
        className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-gold-600" />
          <h2 className="font-display text-xl font-semibold text-ink">
            {t.flights?.searchLive || "Search live routes"}
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {t.flights?.flyingFrom || "Flying from"}
            </span>
            <select
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm font-medium text-ink focus:border-navy focus:outline-none"
            >
              {commonOrigins.map((item) => (
                <option key={item.iata} value={item.iata}>
                  {item.city} ({item.iata})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {t.flights?.arrivingAt || "Arriving at"}
            </span>
            <select
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm font-medium text-ink focus:border-navy focus:outline-none"
            >
              {airports.map((airport) => (
                <option key={airport.iata} value={airport.iata}>
                  {airport.city} — {airport.name} ({airport.iata})
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <CalendarDays className="h-3.5 w-3.5" />
                {t.flights?.outbound || "Outbound"}
              </span>
              <input
                type="date"
                value={departDate}
                min="2027-07-20"
                max="2027-08-10"
                onChange={(event) => setDepartDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm font-medium text-ink focus:border-navy focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <CalendarDays className="h-3.5 w-3.5" />
                {t.flights?.return || "Return"}
              </span>
              <input
                type="date"
                value={returnDate}
                min={departDate}
                max="2027-08-20"
                onChange={(event) => setReturnDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm font-medium text-ink focus:border-navy focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <Users className="h-3.5 w-3.5" />
              {t.flights?.travellers || "Travellers"}
            </span>
            <input
              type="number"
              min={1}
              max={9}
              value={travellers}
              onChange={(event) =>
                setTravellers(Math.min(9, Math.max(1, Number(event.target.value))))
              }
              className="mt-2 w-full rounded-xl border border-line bg-ivory px-3 py-3 text-sm font-medium text-ink focus:border-navy focus:outline-none"
            />
          </label>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-navy-800"
        >
          <Search className="h-4 w-4" />
          {t.flights?.openSearch || "Open live flight search"}
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-muted">
          {t.flights?.externalSearchNote || "Opens an external flight search. We do not display, store or guarantee fares, schedules or availability."}
        </p>

        {selectedAirport ? (
          <div className="mt-6 rounded-xl border border-line bg-ivory p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
              Why {selectedAirport.iata}?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {selectedAirport.note}
            </p>
            <a
              href={timetableUrl(origin, destination)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
            >
              Check route options <ExternalLinkIcon />
            </a>
          </div>
        ) : null}
      </form>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Tunisian gateways
        </p>
        <div className="mt-4 space-y-2.5">
          {airports.map((airport) => (
            <a
              key={airport.iata}
              href={airport.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 rounded-xl border border-line bg-white p-4 transition-colors hover:border-navy"
            >
              <div>
                <p className="font-display text-base font-semibold text-ink">
                  {airport.city}{" "}
                  <span className="font-mono text-xs font-medium text-muted">
                    {airport.iata}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted">{airport.name}</p>
                <p className="mt-2 text-xs font-medium text-clay">{airport.bestFor}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy" />
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Airport roles are practical guidance, not a claim about current
          airline routes. Always confirm schedules and entry requirements with
          the airline and official Tunisian authorities.
        </p>
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return <ArrowUpRight className="h-3 w-3" />;
}
