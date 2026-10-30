"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services, type Service } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const previews: Record<
  Service["slug"],
  { kicker: string; title: string; stats: [string, string][] }
> = {
  crm: {
    kicker: "Guest workspace",
    title: "From a first hello to a confirmed stay.",
    stats: [
      ["Open", "03"],
      ["Pipeline", "₾7,080"],
      ["Next", "Today"],
    ],
  },
  oms: {
    kicker: "Service floor",
    title: "Tables, tickets and the pass in one rhythm.",
    stats: [
      ["Covers", "42"],
      ["Open", "06"],
      ["Pace", "Calm"],
    ],
  },
  hms: {
    kicker: "Property desk",
    title: "Rooms, arrivals and readiness on one board.",
    stats: [
      ["Arrivals", "11"],
      ["Ready", "08"],
      ["Stay", "3 nts"],
    ],
  },
  web: {
    kicker: "Still House",
    title: "A site with a sense of place, and a next step.",
    stats: [
      ["Pages", "12"],
      ["Path", "Book"],
      ["Direct", "On"],
    ],
  },
  growth: {
    kicker: "Demand",
    title: "Brand, search and campaigns for the right guests.",
    stats: [
      ["Reach", "86%"],
      ["Direct", "+41%"],
      ["Brand", "Live"],
    ],
  },
};

export function ServicesList() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const preview = previews[current.slug];

  function move(direction: 1 | -1) {
    setActive((value) => (value + direction + services.length) % services.length);
  }

  return (
    <section
      className="section-pad border-t border-line"
      id="services"
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <Container className="max-w-[1320px]">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
                — 02 / The Beyond toolkit
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-medium tracking-[-0.045em] md:text-6xl">
                The right tools.
                <span className="mt-1 block text-[#b5b5b0]">The bigger picture.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-6 text-muted md:text-right">
              Software to run your operation. Digital experiences to represent it. Growth to take
              it further.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-14">
          <div className="border-t border-white/10 lg:pr-[300px]">
            {services.map((service, index) => {
              const selected = index === active;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/10 px-3 py-7 transition-colors duration-300 sm:px-6 md:grid-cols-[72px_minmax(220px,0.9fr)_minmax(280px,1.35fr)_88px] md:gap-10 md:px-8 md:py-8 ${
                    selected ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
                  }`}
                >
                  <span className="text-[12px] tracking-[0.14em] text-[#6d6d69]">{service.number}</span>
                  <span>
                    <span className="block text-[26px] tracking-[-0.04em] text-[#f4f4f1] md:text-[32px]">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[#6f6f6b]">
                      {service.category}
                    </span>
                  </span>
                  <span className="hidden text-[14px] leading-6 text-[#8d8d88] md:block">
                    {service.summary}
                  </span>
                  <span className="inline-flex h-11 w-[72px] items-center justify-center justify-self-end rounded-full border border-white/15 text-[#d8d8d4] transition group-hover:border-white/40 group-hover:bg-white group-hover:text-[#111]">
                    <Arrow />
                  </span>
                </Link>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.aside
              key={current.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none mt-6 hidden w-[280px] rounded-[22px] border border-white/15 bg-[#121212] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:absolute lg:right-0 lg:top-8 lg:mt-0 lg:block"
              style={{ top: `calc(${active} * 7.6rem + 1.5rem)` }}
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]">{preview.kicker}</p>
              <p className="mt-3 text-[18px] leading-6 tracking-[-0.03em] text-[#f4f4f1]">{preview.title}</p>
              <div className="mt-4 space-y-2">
                <span className="block h-2 w-full rounded-full bg-white/10" />
                <span className="block h-2 w-4/5 rounded-full bg-white/10" />
                <span className="block h-2 w-3/5 rounded-full bg-white/15" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {preview.stats.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/30 px-2 py-2">
                    <div className="text-[9px] uppercase tracking-[0.12em] text-[#6f6f6b]">{label}</div>
                    <div className="mt-1 text-[13px] text-[#f4f4f1]">{value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[#6f6f6b]">
                {current.number} · {current.shortName}
              </p>
            </motion.aside>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12 12 4M6 4h6v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
