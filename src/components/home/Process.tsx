"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { processSteps } from "@/content/process";
import { Reveal } from "@/components/ui/Reveal";
import "./process.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <section className="process-split" id="approach">
      <div className="process-split-grain" aria-hidden="true" />
      <div className="process-split-glow" aria-hidden="true" />
      <div className="wrap process-split-grid">
        <div className="process-copy">
          <Reveal y={18}>
            <div className="eyebrow">03 / From idea to everyday</div>
          </Reveal>
          <Reveal delay={0.08} y={22}>
            <h2 className="process-heading">
              <span className="process-heading-line">
                <span>
                  A clear
                  <br />
                  process.
                </span>
              </span>
              <span className="process-heading-line">
                <em>
                  A shared
                  <br />
                  direction.
                </em>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.16} y={16}>
            <p className="process-intro">
              We start with how your business actually works. Then shape the tools and experiences
              around it.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={20} className="ship-list is-stacked">
          {processSteps.map((step, index) => {
            const isOpen = open === index;
            return (
              <button
                key={step.number}
                className={`ship-row${isOpen ? " active" : ""}`}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(index)}
              >
                <span className="mono">{step.number}</span>
                <strong>{step.title}</strong>
                <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="ship-copy"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease }}
                    >
                      <p>{step.body}</p>
                      <em>You get · {step.outcome}</em>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </button>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
