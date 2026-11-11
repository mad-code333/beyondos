import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple Beyond OS pricing — Hobby, Pro, and Expert tiers with clear value and no surprises.",
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
