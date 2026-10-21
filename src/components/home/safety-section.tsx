import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";

export function SafetySection() {
  return (
    <section className="bg-navy-800 py-20 text-ivory sm:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Viewing safety
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Never look at the Sun without certified protection
            </h2>
            <p className="mt-4 leading-relaxed text-ivory/75">
              During the partial phases it is never safe to look directly at the
              Sun without specialised solar-viewing protection. Ordinary
              sunglasses are not sufficient.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/80">
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Use undamaged solar viewers that meet a recognised safety
                standard.
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Looking unaided is only safe during the brief totality period,
                for viewers completely inside the path of totality.
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                An indirect projection method is a safe alternative.
              </li>
            </ul>
            <div className="mt-8">
              <ButtonLink href="/safety" variant="inverse">
                Read the full safety guide
              </ButtonLink>
            </div>
          </div>

          <div className="relative flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-navy">
            <div
              aria-hidden
              className="h-40 w-40 rounded-full bg-navy shadow-[0_0_0_1.5px_var(--color-gold)]"
            />
            <div
              aria-hidden
              className="absolute h-4 w-4 rounded-full bg-gold blur-[0.5px] shadow-[0_0_40px_12px_rgba(232,184,90,0.55)]"
            />
            <p className="absolute bottom-6 text-center text-xs uppercase tracking-[0.18em] text-ivory/50">
              Corona visible only during totality
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
