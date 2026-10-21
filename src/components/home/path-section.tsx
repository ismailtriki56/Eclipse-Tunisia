import { Container, SectionHeading } from "@/components/ui/card";
import { PathDiagram } from "@/components/path-diagram";
import { ButtonLink } from "@/components/ui/button";
import { eclipseFacts } from "@/lib/eclipse/destinations";

export function PathSection() {
  return (
    <section className="border-y border-line bg-paper py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <SectionHeading
              eyebrow="The path"
              title="A narrow corridor across the whole country"
              description="Tunisia sits directly under the path of totality. The Moon's shadow first touches the ground near the Algerian border in the far south-west, sweeps north-east across the salt lakes of Chott el Jerid, crosses the oases of Gafsa and Gabès, and leaves the country near Mahdia, having passed over the causeway to Djerba."
            />

            <dl className="mt-9 grid gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-gold pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Path width
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                  {eclipseFacts.pathWidthKm} km
                </dd>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  The strip of ground that sees totality. Step 30 km to the
                  north or south of the centre line and the eclipse is partial
                  only.
                </p>
              </div>
              <div className="border-l-2 border-gold pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Greatest eclipse
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                  {eclipseFacts.greatestEclipseUT}
                </dd>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  The instant of maximum coverage anywhere on Earth, over
                  Egypt. In Tunisia the peak arrives at around 11:06 local
                  time.
                </p>
              </div>
            </dl>

            <div className="mt-9">
              <ButtonLink href="/explorer" variant="primary">
                See the path on the interactive map
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-ivory p-5 shadow-card sm:p-8">
            <PathDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}
