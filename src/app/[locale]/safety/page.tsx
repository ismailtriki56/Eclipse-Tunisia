import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Viewing Safety",
  description:
    "How to view the solar eclipse safely: certified solar viewers, the brief totality exception, and indirect viewing methods.",
};

const phases = [
  {
    title: "Before and after totality (partial phases)",
    safe: false,
    body: "You must use certified solar viewers or a safe indirect projection method at all times. Ordinary sunglasses, camera viewfinders, and unfiltered telescopes or binoculars are not safe.",
  },
  {
    title: "During totality (only inside the path of totality)",
    safe: true,
    body: "Only when the Moon completely covers the Sun may you look directly without a filter. This lasts a short time. The moment the Sun reappears, put your certified viewers back on.",
  },
  {
    title: "Anywhere outside the path of totality",
    safe: false,
    body: "There is no safe unaided moment. The Sun is never fully covered, so protection is required throughout the entire event.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Viewing safety"
        title="View the eclipse safely"
        description="Looking directly at the Sun is dangerous except during the brief phase of totality. Protect your eyes throughout every partial phase."
      />

      <Container className="py-16 sm:py-20">
        <div className="space-y-5">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full ${
                    phase.safe ? "bg-success" : "bg-danger"
                  }`}
                />
                <h2 className="font-display text-lg font-semibold text-ink">
                  {phase.title}
                </h2>
                <span
                  className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                    phase.safe
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {phase.safe ? "Unaided viewing safe" : "Protection required"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {phase.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-navy p-6 text-ivory sm:p-8">
          <h2 className="font-display text-xl font-semibold">
            Key safety rules
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ivory/80">
            <li>
              Use undamaged solar viewers that meet a recognised safety standard.
              Discard any with scratches, tears or other damage.
            </li>
            <li>
              Never use ordinary sunglasses, smoked glass, or exposed film as a
              substitute.
            </li>
            <li>
              Never look through an unfiltered camera, telescope or binoculars —
              concentrate sunlight can cause instant injury.
            </li>
            <li>
              Children need constant supervision and correctly sized viewers.
            </li>
            <li>
              Follow reputable astronomical safety guidance, for example from{" "}
              <a
                href={site.nasaEclipseUrl}
                className="underline underline-offset-2 hover:text-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                NASA
              </a>
              .
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-muted">
          This page provides general guidance only. It does not replace official
          safety instructions or the advice of qualified professionals.
        </p>
      </Container>
    </>
  );
}
