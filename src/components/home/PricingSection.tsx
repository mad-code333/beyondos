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
              <p className="pricing-section-kicker mono">Pricing</p>
              <h2 id="home-pricing-heading" className="pricing-title">
                Start with one service.
                <em>Grow into the whole system.</em>
              </h2>
              <p className="pricing-lead">
                Pricing follows scope, not seats. Every plan begins with a short Discovery and
                ends with a fixed, written quote.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} y={14}>
            <Link href="/pricing" className="pricing-section-link">
              How pricing works <span aria-hidden="true">↗︎</span>
            </Link>
          </Reveal>
        </div>

        <PricingCards showHeader={false} compact id="home-pricing" />
      </div>
    </section>
  );
}
