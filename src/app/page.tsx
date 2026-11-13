import { Capabilities } from "@/components/home/Capabilities";
import { Connected } from "@/components/home/Connected";
import { EngagementModels } from "@/components/home/EngagementModels";
import { Faq } from "@/components/home/Faq";
import { FeaturesBento } from "@/components/home/FeaturesBento";
import { Hero } from "@/components/home/Hero";
import { Insights } from "@/components/home/Insights";
import { LogoShowcase } from "@/components/home/LogoShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { Process } from "@/components/home/Process";
import { ServicesList } from "@/components/home/ServicesList";
import { Vision } from "@/components/home/Vision";
import { WorkMix } from "@/components/home/WorkMix";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesList />
      <LogoShowcase />
      <PricingSection />
      <EngagementModels />
      <FeaturesBento />
      <Connected />
      <Vision />
      <Process />
      <Capabilities />
      <WorkMix />
      <Insights />
      <Faq />
    </main>
  );
}
