import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { PartnersStrip } from "@/components/home/partners-strip";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { PathTable } from "@/components/home/path-table";
import { TravelTools } from "@/components/home/travel-tools";
import { SafetyBanner } from "@/components/home/safety-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <PartnersStrip />
      <FeaturedPackages />
      <PathTable />
      <TravelTools />
      <SafetyBanner />
    </>
  );
}
