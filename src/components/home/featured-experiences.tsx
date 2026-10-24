import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/card";
import { ExperienceCard } from "@/components/experience-card";
import { experiences } from "@/data/experiences";

export function FeaturedExperiences() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Experiences"
            title="Experiences, clearly labelled"
            description="Browse sample excursions, transfers, cultural walks and food concepts. Each listing is a development example, not a live provider or a bookable product."
          />
          <ButtonLink
            href="/experiences"
            variant="secondary"
            className="shrink-0"
          >
            Browse all experiences
          </ButtonLink>
        </div>

        <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          The listings below are clearly labelled <strong>sample</strong> data
          for development. They are not real providers and cannot be booked.
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.slice(0, 3).map((experience) => (
            <ExperienceCard key={experience.slug} experience={experience} />
          ))}
        </div>
      </Container>
    </section>
  );
}
