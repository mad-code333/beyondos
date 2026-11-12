"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { insights } from "@/content/insights";
import { Reveal } from "@/components/ui/Reveal";
import "./insights.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Insights() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section className="insights-editorial" id="insights" aria-labelledby="insights-heading">
      <div className="insights-editorial-grain" aria-hidden="true" />
      <div className="wrap insights-editorial-inner">
        <div className="insights-editorial-head">
          <div className="insights-editorial-title-block">
            <Reveal y={14}>
              <p className="eyebrow insights-editorial-eyebrow">03 / Notes from Beyond</p>
            </Reveal>
            <Reveal delay={0.08} y={22}>
              <h2 id="insights-heading" className="insights-editorial-heading">
                <span>A little</span>
                <span>perspective.</span>
                <span>A better next</span>
                <span>step.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} y={18} className="insights-editorial-lede-wrap">
            <p className="insights-editorial-lede">
              Practical notes from hotels, restaurants and brands we work with — so the next step
              feels clearer before you commit to a build.
            </p>
          </Reveal>
        </div>

        <div className="insights-editorial-list" role="list">
          {insights.map((item, index) => (
            <motion.div
              key={item.id}
              role="listitem"
              className="insights-editorial-row"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, ease, delay: reduce ? 0 : 0.05 * index }}
            >
              <Link className="insights-editorial-link" href={item.href}>
                <span className="insights-editorial-num" aria-hidden="true">
                  {item.number}
                </span>
                <div className="insights-editorial-body">
                  <span className="insights-editorial-meta">
                    {item.category} · {item.readTime}
                  </span>
                  <h3 className="insights-editorial-item-title">{item.title}</h3>
                  <p className="insights-editorial-excerpt">{item.excerpt}</p>
                </div>
                <span className="insights-editorial-cta">
                  Read the perspective
                  <i aria-hidden="true">→</i>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
