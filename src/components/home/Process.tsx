"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { processSteps } from "@/content/process";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  const [open, setOpen] = useState(0);
  const active = processSteps[open];

  return (
    <section className="section-pad border-t border-line" id="approach">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            03 / From idea to everyday
          </p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            A clear process.
            <span className="mt-2 block text-[#b7b7b2]">A shared direction.</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] text-muted">
            We start with how your business actually works. Then shape the tools and experiences
            around it.
          </p>
        </Reveal>

        <div className="border-t border-line">
          {processSteps.map((step, index) => {
            const isOpen = open === index;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setOpen(index)}
                className="w-full border-b border-line py-6 text-left"
              >
                <div className="grid grid-cols-[40px_1fr_20px] items-start gap-3">
                  <span className="pt-1 text-[12px] tracking-[0.12em] text-[#6f6f6f]">
                    {step.number}
                  </span>
                  <div>
                    <div
                      className={`text-[22px] tracking-[-0.03em] ${isOpen ? "text-white" : "text-[#8a8a86]"}`}
                    >
                      {step.title}
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 max-w-lg text-[14px] text-muted">{active.body}</p>
                          <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
                            You get / {active.outcome}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <span className="text-[#6f6f6f]">{isOpen ? "−" : "+"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
