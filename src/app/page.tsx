import { Capabilities } from "@/components/home/Capabilities";
import { Connected } from "@/components/home/Connected";
import { Contact } from "@/components/home/Contact";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Insights } from "@/components/home/Insights";
import { Process } from "@/components/home/Process";
import { ServicesList } from "@/components/home/ServicesList";
import { WorkMix } from "@/components/home/WorkMix";
import { WorkspaceDemo } from "@/components/home/WorkspaceDemo";

export default function Home() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <WorkspaceDemo />
      <ServicesList />
      <CoreFeatures />
      <Connected />
      <Process />
      <WorkMix />
      <Insights />
      <Faq />
      <Contact />
    </main>
  );
}
