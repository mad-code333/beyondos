import Link from "next/link";
import { PricingCards } from "@/components/pricing/PricingCards";
import { Reveal } from "@/components/ui/Reveal";
import "@/components/pricing/pricing.css";

export function PricingSection() {
  return (
    <section className="pricing-section" aria-labelledby="home-pricing-heading">
      <div className="wrap">
        <div className="pricing-section-head">
          <Reveal y={18}>
            <div>
              <p className="pricing-section-kicker mono">Plans</p>
              <h2 id="home-pricing-heading" className="pricing-title">
                Pricing
              </h2>
              <p className="pricing-lead">
                Choose the tier that fits your journey. Simple pricing with clear
                value and no surprises.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} y={14}>
            <Link href="/pricing" className="pricing-section-link">
              Full pricing details <span aria-hidden="true">↗︎</span>
            </Link>
          </Reveal>
        </div>

        <PricingCards showHeader={false} compact id="home-pricing" />
      </div>
    </section>
  );
}
