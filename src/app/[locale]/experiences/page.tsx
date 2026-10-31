import type { Metadata } from "next";
import { PageHeader } from "@/components/page-shell";
import { ExperienceCatalog } from "@/components/experiences/experience-catalog";

export const metadata: Metadata = {
  title: "Experiences — Bookable Tours & Desert Excursions",
  description:
    "Browse eclipse viewing excursions, desert 4x4 transfers, cultural oasis walks and culinary tastings across Tunisia.",
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experiences"
        title="Experiences to book around the eclipse"
        description="Desert observation camps, private 4x4 transfers, historic medina walks and culinary tasting tours. Transparent pricing, inclusions, and provider details."
      />
      <ExperienceCatalog />
    </>
  );
}
