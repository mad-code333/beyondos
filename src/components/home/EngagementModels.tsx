"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { engagementPlans, type EngagementPlan } from "@/content/engagement";
import "./engagement.css";

const ease = [0.22, 1, 0.36, 1] as const;

/** Bold check (same weight as the reference's icon set). */
function Check() {
  return (
    <svg className="ec-check" viewBox="0 0 256 256" aria-hidden="true">
      <path
        fill="currentColor"
        d="M232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183 215.51 63.51a12 12 0 0 1 17 17Z"
      />
    </svg>
  );
}

function PlanCard({ plan, index, reduce }: { plan: EngagementPlan; index: number; reduce: boolean }) {
  return (
    <motion.article
      className={`ec-card${plan.popular ? " is-popular" : ""}`}
      data-plan={plan.id}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.1 + index * 0.1 }}
    >
      <div className="ec-body">
        <header className="ec-head">
          <div className="ec-title">
            <h3>{plan.name}</h3>
            {plan.popular ? <span className="ec-badge">Most popular</span> : null}
          </div>
          <p className="ec-desc">{plan.description}</p>
        </header>

        <p className="ec-price">
          {plan.pricePrefix ? <span className="ec-price-prefix">{plan.pricePrefix}</span> : null}
          <strong>{plan.price}</strong>
          <span className="ec-price-suffix">{plan.priceSuffix}</span>
        </p>

        <ul className="ec-features">
          {plan.features.map((feature) => (
            <li key={feature}>
              <Check />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link className="ec-cta" href={plan.href}>
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
      id="pricing"
      aria-labelledby="engage-heading"
    >
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

        <div className="ec-grid">
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
          <Link href="/#faq">Questions? Read the FAQ →</Link>
        </motion.p>
      </div>
    </section>
  );
}

export default EngagementModels;
