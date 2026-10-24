import Link from "next/link";
import { ArrowUpRight, BedDouble, Plane } from "lucide-react";
import { Container } from "@/components/ui/card";
import { stays } from "@/data/stays";
import { airports } from "@/data/flights";

export function TravelTools() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/stays"
            className="group relative overflow-hidden rounded-3xl bg-navy p-7 text-ivory shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10"
            />
            <BedDouble className="h-6 w-6 text-gold" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Where to stay
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Real hotels, with the booking decision left to you.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
              A small verified directory of {stays.length} properties in Mahdia,
              Djerba, Tozeur and Sousse. Official-site links, external search
              links and no invented rates.
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              Open the stay directory
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/flights"
            className="group relative overflow-hidden rounded-3xl bg-sand p-7 text-navy shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-10"
          >
            <div
              aria-hidden
              className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border border-navy/10"
            />
            <Plane className="h-6 w-6 text-clay" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
              Getting there
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Choose the airport by the eclipse base you want.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/70">
              Compare {airports.length} Tunisian gateways, then open a live
              flight search with your dates. No schedules or fares are stored or
              invented here.
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-clay">
              Compare flight gateways
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
