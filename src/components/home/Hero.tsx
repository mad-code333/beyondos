"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services, type ServiceSlug } from "@/content/services";
import { OrbitScene } from "@/components/home/orbitScenes";
import "./orbit.css";

const order: ServiceSlug[] = ["crm", "oms", "hms", "web", "growth"];

type Story = {
  line: string;
  em: string;
  lead: string;
  features: string[];
  micro: string;
};

const stories: Record<ServiceSlug, Story> = {
  crm: {
    line: "Every relationship.",
    em: "Held in one place.",
    lead: "Know who wrote, what they asked, and what should happen next. Conversations, preferences and follow-ups in one workspace.",
    features: ["Guest profiles", "Sales pipeline", "Follow-ups"],
    micro: "Guests. Conversations. Connections.",
  },
  oms: {
    line: "Every order.",
    em: "In the same rhythm.",
    lead: "From the floor to the kitchen, one shared view. Clear tickets. A handoff the pass can trust. A calmer service.",
    features: ["Tables & orders", "Kitchen workflow", "Service overview"],
    micro: "The floor. The kitchen. The guest.",
  },
  hms: {
    line: "Every stay.",
    em: "Ready before arrival.",
    lead: "The whole property in one place. Reservations, room readiness and the guest’s notes, visible before anyone reaches the door.",
    features: ["Room calendar", "Reservations", "Guest journey"],
    micro: "Rooms. Reservations. Arrivals.",
  },
  web: {
    line: "First impressions.",
    em: "Made to last.",
    lead: "A digital front door with a sense of place. A website that turns a visit into a clear next step.",
    features: ["Web design", "Development", "Booking journeys"],
    micro: "Your brand. Your story. Your website.",
  },
  growth: {
    line: "Your next chapter.",
    em: "Found by the right guest.",
    lead: "Brand, content and campaigns in one voice. A presence that feels like the property, and a path from discovery to enquiry.",
    features: ["Brand identity", "Search & content", "Campaign strategy"],
    micro: "Brand. Visibility. Momentum.",
  },
};

function relativePosition(index: number, active: number) {
  let delta = index - active;
  if (delta > 2) delta -= 5;
  if (delta < -2) delta += 5;
  return delta;
}

export function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const slug = order[index];
  const active = services.find((service) => service.slug === slug)!;
  const story = stories[slug];

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((value) => (value + 1) % order.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, reduce]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select")) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(direction: 1 | -1) {
    setPaused(true);
    setIndex((value) => (value + direction + order.length) % order.length);
  }

  function select(next: ServiceSlug) {
    setPaused(true);
    setIndex(order.indexOf(next));
  }

  return (
    <>
      <section
        className={`service-orbit-hero${paused || reduce ? " motion-paused" : ""}`}
        aria-label="Explore Beyond OS services"
      >
        <div className="hero-horizon" aria-hidden="true" />
        <div className="environment" aria-hidden="true">
          {order.map((item) => (
            <div
              key={item}
              className={`environment-layer${item === slug ? " active" : ""}`}
              data-environment={item}
            >
              <OrbitScene slug={item} prefix={`bg-${item}`} />
            </div>
          ))}
        </div>

        <div className="hero-orbit-top orbit-mono">
          <span>
            <i className="dot" /> The connected hospitality toolkit
          </span>
          <span>Built in Georgia / Designed around you</span>
        </div>

        <div className="wrap orbit-hero-layout">
          <div className="orbit-copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={slug}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="eyebrow">
                  {active.number} / {active.category}
                </div>
                <h1>
                  {story.line}
                  <br />
                  <em>{story.em}</em>
                </h1>
                <p className="orbit-lead">{story.lead}</p>
                <div className="orbit-features">
                  {story.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <div className="hero-actions">
                  <Link className="orbit-btn" href={`/services/${slug}`}>
                    Explore {active.shortName} <span>↗</span>
                  </Link>
                  <Link className="orbit-btn outline" href="/#contact">
                    Let&apos;s talk <span>↗</span>
                  </Link>
                </div>
                <div className="orbit-micro">{story.micro}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="orbit-service-selector" aria-label="Choose a service">
            <div className="orbit-arc" aria-hidden="true">
              <svg viewBox="0 0 600 700" preserveAspectRatio="none">
                <path d="M465 -40C30 35 30 650 465 740" />
              </svg>
            </div>
            {services.map((service) => {
              const serviceIndex = order.indexOf(service.slug);
              const position = relativePosition(serviceIndex, index);
              const selected = position === 0;
              return (
                <button
                  key={service.slug}
                  className="orbit-service"
                  type="button"
                  data-orbit={service.slug}
                  data-position={position}
                  aria-pressed={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-label={`Show ${service.name}`}
                  onClick={() => select(service.slug)}
                >
                  <span className="orbit-thumb">
                    <OrbitScene slug={service.slug} prefix={`th-${service.slug}`} />
                    <span className="thumb-index">{service.number}</span>
                  </span>
                  <span className="orbit-service-label">
                    <strong>{service.shortName}</strong>
                    <small>{service.demoLabel}</small>
                  </span>
                </button>
              );
            })}
            <span className="orbit-selector-note orbit-mono">Choose your next step</span>
          </div>
        </div>

        <div className="wrap orbit-bottom">
          <div className="orbit-status">
            <span>{active.number}</span>
            <i />
            <span>05</span>
            <button
              type="button"
              aria-pressed={paused}
              aria-label={paused ? "Resume service rotation" : "Pause service rotation"}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          </div>
          <a className="orbit-scroll orbit-mono" href="#capabilities">
            Scroll to discover <span>↓</span>
          </a>
          <div className="orbit-controls">
            <button type="button" aria-label="Previous service" onClick={() => go(-1)}>
              ↑
            </button>
            <button type="button" aria-label="Next service" onClick={() => go(1)}>
              ↓
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          Showing {active.name}
        </span>
      </section>

      <div className="scope-strip">
        <div className="wrap scope-inner">
          <span className="orbit-mono">
            One partner.
            <br />
            Five practices.
          </span>
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              aria-current={service.slug === slug ? "true" : undefined}
            >
              <b>{service.icon}</b>
              {service.shortName}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
