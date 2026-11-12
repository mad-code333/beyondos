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
            <div className="eyebrow">03 / How long it takes</div>
          </Reveal>
          <Reveal delay={0.08} y={22}>
            <h2 className="process-heading">
              <span className="process-heading-line">
                <span>A clear process.</span>
              </span>
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={20} className="ship-list is-stacked">
          {processSteps.map((step, index) => {
            const isOpen = open === index;
            return (
              <motion.div
                key={step.number}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease, delay: 0.05 * index }}
              >
                <button
                  className={`ship-row${isOpen ? " active" : ""}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`process-panel-${step.number}`}
                  id={`process-trigger-${step.number}`}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setOpen(Math.min(processSteps.length - 1, index + 1));
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setOpen(Math.max(0, index - 1));
                    }
                  }}
                >
                  <span className="mono">{step.number}</span>
                  <strong>{step.title}</strong>
                  <i aria-hidden="true" />
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        className="ship-copy"
                        id={`process-panel-${step.number}`}
                        role="region"
                        aria-labelledby={`process-trigger-${step.number}`}
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
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
