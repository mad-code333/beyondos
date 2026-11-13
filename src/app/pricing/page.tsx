import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Beyond OS pricing follows scope: start with one service, connect a few, or run the complete system. Every plan starts with Discovery and a fixed quote.",
};

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <div className="wrap">
        <PricingCards titleAs="h1" />
      </div>
    </main>
  );
}
