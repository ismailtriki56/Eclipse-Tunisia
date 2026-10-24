import { Hero } from "@/components/home/hero";
import { WhyTunisia } from "@/components/home/why-tunisia";
import { CampaignWall } from "@/components/home/campaign-wall";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { ExplorerPreview } from "@/components/home/explorer-preview";
import { TravelTools } from "@/components/home/travel-tools";
import { FeaturedExperiences } from "@/components/home/featured-experiences";
import { HowItWorks } from "@/components/home/how-it-works";
import { SafetySection } from "@/components/home/safety-section";
import { ProviderCta } from "@/components/home/provider-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyTunisia />
      <CampaignWall />
      <FeaturedPackages />
      <ExplorerPreview />
      <TravelTools />
      <FeaturedExperiences />
      <HowItWorks />
      <SafetySection />
      <ProviderCta />
    </>
  );
}
