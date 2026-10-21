import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { Container } from "@/components/ui/card";
import { ExperienceCard } from "@/components/experience-card";
import { experiences } from "@/data/experiences";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Browse bookable eclipse-viewing excursions, transfers, cultural walks and food experiences in Tunisia.",
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experiences"
        title="Experiences to book around the eclipse"
        description="Excursions, transport, cultural walks and food experiences. Prices, inclusions and provider details are shown upfront."
      />
      <Container className="py-16 sm:py-20">
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          All listings below are clearly labelled <strong>sample</strong> data
          for development. They represent no real provider and cannot be booked.
          Search, filters and real listings arrive in a later stage.
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.slug} experience={experience} />
          ))}
        </div>
      </Container>
    </>
  );
}
