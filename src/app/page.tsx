import { Connected } from "@/components/home/Connected";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { FeaturesBento } from "@/components/home/FeaturesBento";
import { GuestJourney } from "@/components/home/GuestJourney";
import { Hero } from "@/components/home/Hero";
import { Insights } from "@/components/home/Insights";
import { Process } from "@/components/home/Process";
import { PropertyStage } from "@/components/home/PropertyStage";
import { ServicesList } from "@/components/home/ServicesList";
import { WorkMix } from "@/components/home/WorkMix";
import { WorkspaceDemo } from "@/components/home/WorkspaceDemo";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkspaceDemo />
      <PropertyStage />
      <GuestJourney />
      <ServicesList />
      <FeaturesBento />
      <Connected />
      <Process />
      <WorkMix />
      <Insights />
      <Faq />
      <Contact />
    </main>
  );
}
