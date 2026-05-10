import { AudienceSection } from "@/components/AudienceSection";
import { FeaturedJobs } from "@/components/FeaturedJobs";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { StatsSection } from "@/components/StatsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsSection />
      <HowItWorks />
      <AudienceSection />
      <FeaturedJobs />
      <FinalCTA />
      <Footer />
    </main>
  );
}
