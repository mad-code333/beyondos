"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ServiceSlug } from "@/content/services";
import "./property-stage.css";

type Practice = {
  slug: ServiceSlug;
  number: string;
  tab: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  description: string;
  cta: string;
  image: string;
  alt: string;
};

const practices: Practice[] = [
  {
    slug: "crm",
    number: "01",
    tab: "CRM",
    eyebrow: "Customer Relationship Management",
    title: "Every relationship.",
    titleEm: "Held in one place.",
    description:
      "Know who wrote, what they asked, and what should happen next. Conversations, preferences and follow-ups in one workspace.",
    cta: "Explore CRM",
    image: "/media/desk.jpg",
    alt: "A hotel reception desk in stone and warm lamplight, before the first guest.",
  },
  {
    slug: "oms",
    number: "02",
    tab: "Restaurant OMS",
    eyebrow: "Restaurant Order Management",
    title: "Every order.",
    titleEm: "In the same rhythm.",
    description:
      "From the floor to the kitchen, one shared view. Clear tickets. A handoff the pass can trust. A calmer service.",
    cta: "Explore Restaurant OMS",
    image: "/media/kitchen.jpg",
    alt: "The pass between a restaurant kitchen and the dining room, plates ready.",
  },
  {
    slug: "hms",
    number: "03",
    tab: "Hotel HMS",
    eyebrow: "Hotel Management System",
    title: "Every stay.",
    titleEm: "Ready before arrival.",
    description:
      "The whole property in one place. Reservations, room readiness and the guest’s notes, visible before anyone reaches the door.",
    cta: "Explore Hotel HMS",
    image: "/media/suite.jpg",
    alt: "A boutique hotel bedroom in morning light, linen and a chair by the window.",
  },
  {
    slug: "web",
    number: "04",
    tab: "Web Development",
    eyebrow: "Websites & Digital Experiences",
    title: "First impressions.",
    titleEm: "Made to last.",
    description:
      "A digital front door with a sense of place. A website that turns a visit into a clear next step.",
    cta: "Explore Web Development",
    image: "/media/facade.jpg",
    alt: "A hotel entrance at blue hour, one warm doorway on a dark stone facade.",
  },
  {
    slug: "growth",
    number: "05",
    tab: "Digital Growth",
    eyebrow: "Growth, Marketing & Branding",
    title: "Your next chapter.",
    titleEm: "Found by the right guest.",
    description:
      "Brand, content and campaigns in one voice. A presence that feels like the property, and a path from discovery to enquiry.",
    cta: "Explore Digital Growth",
    image: "/media/table.jpg",
    alt: "A set table for two, a candle and a glass, the guest's side of the evening.",
  },
];

export function PropertyStage() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const active = practices[index];

  const go = useCallback((direction: 1 | -1) => {
    setIndex((value) => (value + direction + practices.length) % practices.length);
  }, []);

  const select = useCallback((next: number) => {
    setIndex(next);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable]")) {
        return;
      }
      const stage = document.getElementById("property");
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.2;
      if (!inView) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section className="world-stage wrap" id="property" aria-label="The property">
      <div className="world-head">
        <div>
          <span className="mono">01 — The property</span>
          <h2>
            Five practices.
            <br />
            One guest.
          </h2>
        </div>
        <p>Different rooms. The same record of who arrived, what they asked, and what happens next.</p>
      </div>

      <div className="world-bar">
        <div className="world-tabs" role="tablist" aria-label="Beyond OS services">
          {practices.map((practice, i) => (
            <button
              key={practice.slug}
              type="button"
              role="tab"
              id={`property-tab-${practice.slug}`}
              aria-selected={i === index}
              aria-controls="property-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
            >
              <span>{practice.number}</span>
              {practice.tab}
            </button>
          ))}
        </div>
        <div className="world-arrows">
          <button type="button" aria-label="Previous practice" onClick={() => go(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next practice" onClick={() => go(1)}>
            →
          </button>
        </div>
      </div>

      <div className="world-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.slug}
            id="property-panel"
            role="tabpanel"
            aria-labelledby={`property-tab-${active.slug}`}
            className="world-pane"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="world-copy">
              <span className="mono">
                {active.number} / {active.eyebrow}
              </span>
              <h3>
                {active.title} {active.titleEm}
              </h3>
              <p>{active.description}</p>
              <Link href={`/services/${active.slug}`}>
                {active.cta} ↗︎
              </Link>
            </div>
            <div className="world-photo">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 800px) 100vw, 54vw"
                priority={active.slug === "crm"}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
