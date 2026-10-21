import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 18%, rgba(232,184,90,0.32) 0%, rgba(232,184,90,0) 42%), radial-gradient(80% 60% at 15% 85%, rgba(23,42,58,0.9) 0%, rgba(16,24,32,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-6rem] top-12 h-72 w-72 rounded-full bg-navy shadow-[0_0_0_10px_var(--color-gold)] sm:h-96 sm:w-96"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-gold">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
            Total solar eclipse &middot; {site.eventDate}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Experience totality in Tunisia
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
            Verified viewing locations, real tourism experiences and trip
            planning for the eclipse of {site.eventDate} — brought together in
            one calm, trustworthy place.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/experiences" size="lg">
              Explore Eclipse Experiences
            </ButtonLink>
            <ButtonLink href="/plan" size="lg" variant="inverse">
              Plan My Trip
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-ivory/60">
            Free to browse. No account needed to explore.
          </p>
        </div>
      </Container>
    </section>
  );
}
