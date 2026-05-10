import { AudienceSection } from "@/components/AudienceSection";
import { FeaturedJobs } from "@/components/FeaturedJobs";
import { FinalCTA } from "@/components/FinalCTA";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsSection } from "@/components/StatsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <HowItWorks />
      <AudienceSection />
      <FeaturedJobs />
      <FinalCTA />
    </main>
  );
}
