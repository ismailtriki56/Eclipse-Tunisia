import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/card";

export function ProviderCta() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="grid gap-8 p-8 sm:p-12 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                For tourism providers
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                Reach visitors planning their eclipse trip
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                Tour operators, guides, transport providers, accommodation
                businesses and cultural experience organisers can list
                services, present clear prices and receive booking requests.
              </p>
              <div className="mt-8">
                <ButtonLink href="/providers">Register interest</ButtonLink>
              </div>
            </div>
            <div className="rounded-2xl bg-ivory p-6">
              <p className="text-sm leading-relaxed text-muted">
                We only display a provider as partnered once the relationship is
                confirmed. Nothing here implies an existing partnership or
                official endorsement.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
