import { Container, SectionHeading } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Discover verified locations",
    body: "Explore where totality can be seen, with location-specific circumstances sourced from official data.",
  },
  {
    number: "02",
    title: "Plan a feasible trip",
    body: "Enter your dates, budget and interests, and receive a suggested itinerary grounded in real destinations and listings.",
  },
  {
    number: "03",
    title: "Verify before you go",
    body: "Use the eclipse checklist, real hotel links and external flight search. This site has no booking engine or payment flow; every reservation is made elsewhere.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From curiosity to a workable plan"
          description="We help you compare, calculate and prepare. The final booking always happens with the hotel, airline or licensed provider."
          align="center"
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <span className="font-display text-3xl font-semibold text-gold-600">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
