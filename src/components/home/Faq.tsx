"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqItems } from "@/content/faq";
import "./faq.css";

const ease = [0.22, 1, 0.36, 1] as const;

const copyReveal = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, when: "beforeChildren" },
  },
} as const;

const lineReveal = {
  hidden: { y: "110%" },
  show: (delay: number) => ({
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
} as const;

export function Faq() {
  const reduce = Boolean(useReducedMotion());
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq-section" id="faq">
      <div className="faq-section-glow" aria-hidden="true" />
      <div className="wrap faq-layout">
        <motion.div
          className="faq-copy"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={copyReveal}
        >
          <div className="eyebrow">Good questions</div>
          <h2 className="faq-heading">
            <span className="faq-heading-line">
              <motion.span custom={reduce ? 0 : 0.08} variants={lineReveal}>
                A few things
              </motion.span>
            </span>
            <span className="faq-heading-line">
              <motion.span custom={reduce ? 0 : 0.16} variants={lineReveal}>
                you might be
              </motion.span>
            </span>
            <span className="faq-heading-line">
              <motion.em custom={reduce ? 0 : 0.24} variants={lineReveal}>
                wondering.
              </motion.em>
            </span>
          </h2>
        </motion.div>

        <div className="faq-stack">
          {faqItems.map((item, index) => {
            const isOpen = open === index;

            return (
              <motion.div
                key={item.question}
                className={`faq-row${isOpen ? " is-open" : ""}`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease, delay: reduce ? 0 : 0.08 + index * 0.07 }}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
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
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease }}
                    >
                      <motion.p
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: 6 }}
                        transition={{ duration: 0.36, ease, delay: reduce ? 0 : 0.06 }}
                      >
                        {item.answer}
                      </motion.p>
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
