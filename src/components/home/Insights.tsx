"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { insights } from "@/content/insights";
import "./insights.css";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
};

const barHeights = [40, 70, 55, 90, 65, 78];

function JournalArt({ art }: { art: (typeof insights)[number]["art"] }) {
  if (art === "sheets") {
    return <div className="shape" aria-hidden />;
  }

  if (art === "ring") {
    return <div className="disc" aria-hidden />;
  }

  return (
    <div className="graph-lines" aria-hidden>
      {barHeights.map((height, index) => (
        <i key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function Insights() {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);

  return (
    <section className="section insights-section" id="insights">
      <div className="wrap">
        <motion.div
          className="eyebrow"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
        >
          06 / Notes from the work
        </motion.div>

        <motion.div
          className="section-head"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.06 }}
        >
          <h2>
            On the guest,
            <br />
            <em>the kitchen, the booking.</em>
          </h2>
        </motion.div>

        <div className="journal-grid">
          {insights.map((item, index) => (
            <motion.div
              key={item.id}
              custom={reduce ? 0 : 0.08 + index * 0.1}
              variants={fadeUp}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Link className="journal-card" href={item.href}>
                <motion.div
                  className="journal-art"
                  initial={reduce ? false : { opacity: 0.7, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.75, ease, delay: reduce ? 0 : 0.12 + index * 0.08 }}
                >
                  <JournalArt art={item.art} />
                </motion.div>
                <div className="journal-meta">
                  {item.category} / {item.readTime}
                </div>
                <h3>{item.title}</h3>
                <p className="journal-dek">{item.excerpt}</p>
                <span className="journal-link">
                  Read the perspective <i aria-hidden>↗</i>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
