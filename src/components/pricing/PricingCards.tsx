import Link from "next/link";
import { pricingNotes, pricingPlans, type PricingPlan } from "@/content/pricing";
import { Reveal } from "@/components/ui/Reveal";
import "./pricing.css";

function CheckIcon() {
  return (
    <span className="pricing-check" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 7.2 5.4 10l6.1-6.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ArrowUpRight() {
  return (
    <svg className="pricing-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M3 9L9 3M4 3h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <Reveal delay={0.08 + index * 0.08} y={28}>
      <article
        className={`pricing-card${plan.popular ? " is-popular" : ""}`}
        data-plan={plan.id}
      >
        <div className="pricing-card-top">
          <div className="pricing-card-meta">
            <span className="pricing-scope mono">{plan.scope}</span>
            {plan.popular ? <span className="pricing-badge mono">Recommended</span> : null}
          </div>
          <h3>{plan.name}</h3>
          <p className="pricing-card-desc">{plan.description}</p>
        </div>

        <div className="pricing-amount">
          <strong>{plan.priceLabel}</strong>
          <span>{plan.priceNote}</span>
        </div>

        <ul className="pricing-features">
          {plan.features.map((feature) => (
            <li key={feature}>
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link className="pricing-cta" href={plan.href}>
          {plan.cta} <ArrowUpRight />
        </Link>
      </article>
    </Reveal>
  );
}

type PricingCardsProps = {
  showHeader?: boolean;
  compact?: boolean;
  id?: string;
  titleAs?: "h1" | "h2";
};

export function PricingCards({
  showHeader = true,
  compact = false,
  id = "pricing",
  titleAs = "h2",
}: PricingCardsProps) {
  const TitleTag = titleAs;

  return (
    <div className={`pricing-block${compact ? " is-compact" : ""}`} id={id}>
      {showHeader ? (
        <Reveal y={20}>
          <div className="pricing-intro">
            <p className="pricing-section-kicker mono">Pricing</p>
            <TitleTag className="pricing-title">
              Start with one service.
              <em>Grow into the whole system.</em>
            </TitleTag>
            <p className="pricing-lead">
              Pricing follows scope, not seats. Every plan begins with a short Discovery and
              ends with a fixed, written quote.
            </p>
          </div>
        </Reveal>
      ) : null}

      <div className="pricing-grid">
        {pricingPlans.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>

      <Reveal delay={0.1} y={12}>
        <ul className="pricing-notes" aria-label="How pricing works">
          {pricingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
