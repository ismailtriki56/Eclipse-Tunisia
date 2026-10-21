import { Hero } from "@/components/home/hero";
import { ExplorerPreview } from "@/components/home/explorer-preview";
import { FeaturedExperiences } from "@/components/home/featured-experiences";
import { HowItWorks } from "@/components/home/how-it-works";
import { SafetySection } from "@/components/home/safety-section";
import { ProviderCta } from "@/components/home/provider-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ExplorerPreview />
      <FeaturedExperiences />
      <HowItWorks />
      <SafetySection />
      <ProviderCta />
    </>
  );
}
