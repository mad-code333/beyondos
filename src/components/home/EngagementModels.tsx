"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { engagementPlans, type EngagementPlan } from "@/content/engagement";
import "./engagement.css";

const ease = [0.22, 1, 0.36, 1] as const;

function PlanCard({ plan, index, reduce }: { plan: EngagementPlan; index: number; reduce: boolean }) {
  return (
    <motion.article
      className={`pricing-tier${plan.popular ? " is-popular" : ""}`}
      data-plan={plan.id}
      initial={reduce ? false : { opacity: 0, y: 36, filter: "blur(6px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease, delay: reduce ? 0 : 0.12 + index * 0.1 }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      {plan.popular ? <span className="pricing-tier-aura" aria-hidden="true" /> : null}

      <header className="pricing-tier-head">
        <h3>{plan.name}</h3>
        {plan.popular ? <span className="pricing-badge">Most popular</span> : null}
      </header>

      <p className="pricing-best">{plan.description}</p>

      <p className="pricing-amount">
        <span>{plan.priceLabel}</span>
        <small>{plan.priceNote}</small>
      </p>

      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <Link className="pricing-cta" href={plan.href}>
        {plan.cta}
      </Link>
    </motion.article>
  );
}

export function EngagementModels() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section
      className="engagement-models engage-cassis"
      id="engagement"
      aria-labelledby="engage-heading"
    >
      <div className="engage-glow" aria-hidden="true" />
      <div className="engage-glow engage-glow--pulse" aria-hidden="true" />

      <div className="wrap">
        <motion.div
          className="engage-head engage-head--center"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
          }}
        >
          <motion.p
            className="mono"
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
            }}
          >
            Ways of working
          </motion.p>

          <motion.h2
            id="engage-heading"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
            }}
          >
            <span className="engage-heading-line">
              <motion.span
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease } },
                }}
              >
                Three ways in.
              </motion.span>
            </span>
            <span className="engage-heading-line">
              <motion.em
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease } },
                }}
              >
                One team either way.
              </motion.em>
            </span>
          </motion.h2>

          <motion.p
            className="engage-lead"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
          >
            Choose the engagement that fits your journey. Clear scope, clear value — no mystery
            retainers.
          </motion.p>
        </motion.div>

        <div className="pricing-tiers engage-pricing-tiers">
          {engagementPlans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} reduce={reduce} />
          ))}
        </div>

        <motion.p
          className="engage-foot mono"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease, delay: reduce ? 0 : 0.35 }}
        >
          <Link href="/pricing">Compare plans &amp; FAQ →</Link>
        </motion.p>
      </div>
    </section>
  );
}

export default EngagementModels;
