"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/content/faq";
import { Container } from "@/components/ui/Container";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad border-t border-line" id="faq">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">Good questions</p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] md:text-5xl">
            A few things you might be wondering.
          </h2>
        </div>
        <div className="border-t border-line">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px]"
                >
                  {item.question}
                  <span className="text-[#6f6f6f]">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-5 text-[14px] text-muted"
                    >
                      {item.answer}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
