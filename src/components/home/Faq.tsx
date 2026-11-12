"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqItems } from "@/content/faq";
import { Reveal } from "@/components/ui/Reveal";
import "./faq.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const reduce = Boolean(useReducedMotion());
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-section-grain" aria-hidden="true" />
      <div className="wrap faq-layout">
        <div className="faq-copy">
          <Reveal y={14}>
            <p className="eyebrow faq-eyebrow">04 / Good questions</p>
          </Reveal>
          <Reveal delay={0.08} y={22}>
            <h2 id="faq-heading" className="faq-heading">
              <span>A few things</span>
              <span>you might be</span>
              <span>wondering.</span>
            </h2>
          </Reveal>
        </div>

        <div className="faq-stack" role="list">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <motion.div
                key={item.question}
                className={`faq-row${isOpen ? " is-open" : ""}`}
                role="listitem"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.05 * index }}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setOpen(Math.min(faqItems.length - 1, index + 1));
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setOpen(Math.max(0, index - 1));
                    }
                  }}
                >
                  <span className="faq-q">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <i className="faq-icon-h" />
                    <i className="faq-icon-v" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="faq-answer"
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
