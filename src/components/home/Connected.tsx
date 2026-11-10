"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EcosystemStoryPanel } from "./ecosystem/EcosystemStoryPanel";
import { ECOSYSTEM_STORIES, type EcosystemStoryId } from "./ecosystem/stories";
import "./ecosystem.css";

const ease = [0.22, 1, 0.36, 1] as const;

const navStrip = [
  { href: "/services/crm", label: "CRM" },
  { href: "/services/oms", label: "Restaurant OMS" },
  { href: "/services/hms", label: "Hotel HMS" },
  { href: "/services/web", label: "Web Development" },
  { href: "/services/growth", label: "Digital Growth" },
] as const;

const flow = [
  {
    n: "01",
    title: "Guest books on Beyond Georgia",
    body: "Stay or experience booked — often via WhatsApp — with clear intent.",
  },
  {
    n: "02",
    title: "Reservation lands in HMS",
    body: "Dates and notes show up where the front desk already works.",
  },
  {
    n: "03",
    title: "Guest profile opens in CRM",
    body: "Preferences and conversation history sit on one card.",
  },
  {
    n: "04",
    title: "Pre-arrival WhatsApp goes out",
    body: "Directions and timing before check-in — less inbox chaos.",
  },
  {
    n: "05",
    title: "Low stock can trigger Beyond Supply",
    body: "Linen, amenities or kitchen staples reorder without a scattered chase.",
  },
] as const;

const fadeUp = (delay = 0, reduce: boolean) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" as const },
        transition: { duration: 0.55, ease, delay },
      };

const fadeCard = (delay = 0, reduce: boolean) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" as const },
        transition: { duration: 0.45, ease, delay },
      };

const fadeStage = (reduce: boolean) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.985 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-60px" as const },
        transition: { duration: 0.7, ease, delay: 0.1 },
      };

export function Connected() {
  const reduce = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<EcosystemStoryId>("georgia");

  const onServiceKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const ids = ECOSYSTEM_STORIES.map((story) => story.id);
      const index = ids.indexOf(activeId);
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setActiveId(ids[(index + 1) % ids.length]);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveId(ids[(index - 1 + ids.length) % ids.length]);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveId(ids[0]);
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveId(ids[ids.length - 1]);
      }
    },
    [activeId],
  );

  return (
    <section className="georgia-globe-section section" id="ecosystem" aria-label="The Beyond ecosystem">
      <nav className="eco-nav-strip" aria-label="Beyond OS services">
        {navStrip.map((item) => (
          <Link key={item.href} href={item.href}>
            <i aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="wrap georgia-globe-layout">
        <motion.div className="georgia-globe-copy" {...fadeUp(0, reduce)}>
          <div className="mono">The Beyond Ecosystem · Tbilisi</div>
          <h2>
            One company.
            <em>Three ways to serve</em>
            <em>hospitality.</em>
          </h2>
          <p>
            From a hotel or restaurant owner&apos;s chair: guests should arrive with intent, the house
            should stay stocked, and the desk should not rebuild every stay from five apps.
          </p>

          <div
            className="ecosystem-list"
            role="listbox"
            aria-label="Beyond ecosystem businesses"
            aria-activedescendant={`eco-service-${activeId}`}
            onKeyDown={onServiceKeyDown}
          >
            {ECOSYSTEM_STORIES.map((item, index) => {
              const active = activeId === item.id;
              return (
                <motion.div key={item.id} role="none" {...fadeCard(0.06 + index * 0.05, reduce)}>
                  <button
                    id={`eco-service-${item.id}`}
                    type="button"
                    role="option"
                    className={`ecosystem-item${active ? " is-active" : ""}`}
                    data-story={item.id}
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                  >
                    <span className="mono">{item.index}</span>
                    <div>
                      <strong>
                        {item.title}
                        <em>{item.category}</em>
                      </strong>
                      <p>{item.body}</p>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          tabIndex={active ? 0 : -1}
                        >
                          {item.cta} ↗
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={(event) => event.stopPropagation()}
                          tabIndex={active ? 0 : -1}
                        >
                          {item.cta} ↗
                        </Link>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <span className="mono georgia-coords">41.7151° N / 44.8271° E · Tbilisi</span>
        </motion.div>

        <motion.div className="globe-stage eco-story-host" {...fadeStage(reduce)}>
          <EcosystemStoryPanel key={activeId} activeId={activeId} />
        </motion.div>
      </div>

      <div className="eco-flow-block wrap">
        <motion.div {...fadeUp(0, reduce)}>
          <p className="mono">How a booking moves</p>
          <h3 className="eco-flow-title">Guest in. Stock covered. Desk ready.</h3>
        </motion.div>

        <ol className="ecosystem-list eco-flow-list">
          {flow.map((step, index) => (
            <motion.li key={step.n} {...fadeUp(0.04 + index * 0.05, reduce)}>
              <span className="mono">{step.n}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
