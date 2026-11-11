"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  formatPlanPrice,
  pricingPlans,
  type BillingCycle,
  type PricingPlan,
} from "@/content/pricing";
import { Reveal } from "@/components/ui/Reveal";
import "./pricing.css";

function CheckIcon({ accent }: { accent?: boolean }) {
  return (
    <span className={`pricing-check${accent ? " is-accent" : ""}`} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 7.2 5.4 10l6.1-6.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PlanCard({
  plan,
  cycle,
  index,
}: {
  plan: PricingPlan;
  cycle: BillingCycle;
  index: number;
}) {
  const reduce = Boolean(useReducedMotion());
  const price = formatPlanPrice(plan, cycle);
  const isPaid = plan.monthly != null;

  return (
    <Reveal delay={0.08 + index * 0.08} y={28}>
      <article
        className={`pricing-card${plan.popular ? " is-popular" : ""}`}
        data-plan={plan.id}
      >
        {plan.popular ? (
          <span className="pricing-badge mono">Most popular</span>
        ) : null}

        <div className="pricing-card-top">
          <h3>{plan.name}</h3>
          <p className="pricing-card-desc">{plan.description}</p>
        </div>

        <div className="pricing-amount" aria-live="polite">
          {isPaid ? <span className="pricing-currency">$</span> : null}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${plan.id}-${cycle}-${price}`}
              className="pricing-value"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {price}
            </motion.span>
          </AnimatePresence>
          {isPaid ? <span className="pricing-period">/month</span> : null}
        </div>

        <ul className="pricing-features">
          {plan.features.map((feature) => (
            <li key={feature}>
              <CheckIcon accent={plan.popular} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link className="pricing-cta" href={plan.href}>
          {plan.cta}
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
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const TitleTag = titleAs;

  return (
    <div className={`pricing-block${compact ? " is-compact" : ""}`} id={id}>
      {showHeader ? (
        <Reveal y={20}>
          <div className="pricing-intro">
            <TitleTag className="pricing-title">Pricing</TitleTag>
            <p className="pricing-lead">
              Choose the tier that fits your journey. Simple pricing with clear
              value and no surprises.
            </p>
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={0.05} y={16}>
        <div
          className="pricing-toggle"
          role="radiogroup"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            role="radio"
            aria-checked={cycle === "monthly"}
            className={cycle === "monthly" ? "is-active" : undefined}
            onClick={() => setCycle("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={cycle === "yearly"}
            className={cycle === "yearly" ? "is-active" : undefined}
            onClick={() => setCycle("yearly")}
          >
            Yearly
          </button>
          <span className="pricing-discount mono">-15%</span>
        </div>
      </Reveal>

      <div className="pricing-grid">
        {pricingPlans.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} index={index} />
        ))}
      </div>
    </div>
  );
}
