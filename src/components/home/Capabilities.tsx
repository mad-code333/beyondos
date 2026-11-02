"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import "./capabilities.css";

const ease = [0.22, 1, 0.36, 1] as const;

const INTEGRATIONS = [
  "Stripe",
  "Mail",
  "Slack",
  "WhatsApp",
  "Booking",
  "POS",
  "Calendar",
  "CRM",
] as const;

const BAR_HEIGHTS = [42, 68, 55, 82, 60, 74, 90];

const FLOW_STEPS = [
  { n: "1", label: "New booking" },
  { n: "2", label: "Assign room" },
  { n: "3", label: "Notify housekeeping" },
  { n: "✓", label: "Send welcome message" },
] as const;

const ORBIT_RADIUS = 34;
const ORBIT_START = (-110 * Math.PI) / 180;
const ORBIT_STEP = (Math.PI * 2) / INTEGRATIONS.length;

function orbitPoint(index: number) {
  const angle = ORBIT_START + index * ORBIT_STEP;
  return {
    x: 50 + ORBIT_RADIUS * Math.cos(angle),
    y: 50 + ORBIT_RADIUS * Math.sin(angle),
  };
}

function useMotionPaused(reduce: boolean) {
  const [paused, setPaused] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setPaused(true);
      return;
    }

    const root = document.documentElement;
    const sync = () => setPaused(root.getAttribute("data-motion") === "paused");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, [reduce]);

  return paused;
}

function DashboardPreview({ paused }: { paused: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (paused || !cardRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    cardRef.current.style.transform = `perspective(1100px) rotateX(${6 - y * 10}deg) rotateY(${-10 + x * 16}deg)`;
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #ffffff28 0%, transparent 42%)`;
    }
  }

  function untilt() {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1100px) rotateX(4deg) rotateY(-8deg)";
    if (shineRef.current) {
      shineRef.current.style.background =
        "radial-gradient(circle at 50% 45%, #ffffff28 0%, transparent 42%)";
    }
  }

  return (
    <div className="core-visual-panel core-dash" onPointerMove={tilt} onPointerLeave={untilt}>
      <div className="core-dash-atmosphere" aria-hidden="true">
        <span className="core-dash-grain" />
        <span className="core-dash-bloom" />
        <span className="core-dash-grid" />
      </div>
      <motion.div
        ref={cardRef}
        className="core-dash-card"
        initial={paused ? false : { opacity: 0, y: 18, rotateX: 10, rotateY: -14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease }}
        style={{ transform: "perspective(1100px) rotateX(4deg) rotateY(-8deg)" }}
      >
        <span
          ref={shineRef}
          className="core-dash-shine"
          aria-hidden="true"
          style={{ background: "radial-gradient(circle at 50% 45%, #ffffff28 0%, transparent 42%)" }}
        />
        <div className="core-dash-chrome">
          <span className="core-dash-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="mono">Property overview</span>
          <em>Live</em>
        </div>
        <div className="core-dash-metrics">
          <div className="core-dash-top">
            <span>Revenue</span>
            <strong>₾53,000</strong>
            <em className="is-pop">+55%</em>
          </div>
          <div className="core-dash-top">
            <span>Occupancy</span>
            <strong>86%</strong>
            <em className="is-pop">+12%</em>
          </div>
        </div>
        <div className="core-bars-wrap">
          <div className="core-bars-label mono" aria-hidden="true">
            <span>Mon</span>
            <span>Sun</span>
          </div>
          <div className={`core-bars${paused ? "" : " is-play"}`} aria-hidden="true">
            {BAR_HEIGHTS.map((height, index) => (
              <i key={index} style={{ ["--h" as string]: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="core-dash-footer" aria-hidden="true">
          <span>Today vs last week</span>
          <span className="mono">SYNCED · 2m</span>
        </div>
      </motion.div>
    </div>
  );
}

function IntegrationNetwork({ paused }: { paused: boolean }) {
  const reduce = Boolean(paused);
  const gradientId = useId().replace(/:/g, "");
  const [hot, setHot] = useState(0);
  const points = INTEGRATIONS.map((_, index) => orbitPoint(index));

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setHot((current) => (current + 1) % INTEGRATIONS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="core-visual-panel core-integrations">
      <div className="core-orbit-atmosphere" aria-hidden="true">
        <span className="core-orbit-ring core-orbit-ring-a" />
        <span className="core-orbit-ring core-orbit-ring-b" />
        <span className="core-orbit-bloom" />
        <span className="core-orbit-grain" />
      </div>
      <svg className="core-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {points.map((point, index) => (
          <line
            key={INTEGRATIONS[index]}
            x1="50"
            y1="50"
            x2={point.x}
            y2={point.y}
            vectorEffect="non-scaling-stroke"
            stroke={index === hot ? `url(#${gradientId})` : "#ffffff"}
            strokeWidth={index === hot ? 1.4 : 0.7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            className={index === hot ? "is-hot-line" : undefined}
            style={{ opacity: index === hot ? 0.85 : 0.16 }}
          />
        ))}
      </svg>
      <div className="core-orbit-core-wrap">
        <motion.button
          type="button"
          className="core-orbit-core"
          aria-label="Connected systems"
          initial={reduce ? false : { opacity: 0, scale: 0.72 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="core-orbit-core-glow" aria-hidden="true" />
          <span className="core-orbit-core-face">
            <span className="core-orbit-core-icon" aria-hidden="true">
              ☁
            </span>
          </span>
        </motion.button>
      </div>
      <ul className={`core-orbit-tags${reduce ? "" : " is-live"}`}>
        {INTEGRATIONS.map((name, index) => {
          const point = points[index];
          return (
            <li
              key={name}
              data-i={index}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                ["--d" as string]: `${0.15 + index * 0.05}s`,
                ["--float-d" as string]: `${index * 0.28}s`,
              }}
            >
              <button
                type="button"
                className={index === hot ? "is-hot" : undefined}
                onClick={() => setHot(index)}
              >
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WorkflowPreview({ paused }: { paused: boolean }) {
  const [active, setActive] = useState(3);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % FLOW_STEPS.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div className="core-visual-panel core-flow">
      <ul>
        {FLOW_STEPS.map((step, index) => (
          <li key={step.label} className={index === active ? "is-done" : undefined}>
            <span>{index === active && index === 3 ? "✓" : step.n}</span>
            <strong>{step.label}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Capabilities() {
  const reduceMotion = useReducedMotion();
  const paused = useMotionPaused(Boolean(reduceMotion));

  return (
    <section className={`core-features${paused ? " is-still" : ""}`} id="core-features">
      <div className="wrap">
        <div className="core-head">
          <div>
            <Reveal y={14}>
              <div className="eyebrow">Capabilities</div>
            </Reveal>
            <Reveal delay={0.08} y={20}>
              <h2 className="core-title">
                Discover our core
                <br />
                <em>
                  software
                  <br />
                  features
                </em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} y={12}>
            <Link className="core-all" href="/#services">
              View all features <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>

        <div className="core-stack">
          <article className="core-row core-row-dashboard">
            <div className="core-copy">
              <Reveal y={16}>
                <span className="core-icon" aria-hidden="true">
                  ▦
                </span>
              </Reveal>
              <Reveal delay={0.06} y={16}>
                <h3>Custom Dashboard Creation</h3>
              </Reveal>
              <Reveal delay={0.1} y={14}>
                <p>
                  See arrivals, covers, pipeline and occupancy in one property view — shaped around
                  how your team already decides.
                </p>
              </Reveal>
              <Reveal delay={0.14} y={12}>
                <ul className="core-points">
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>One live picture of the desk and the floor</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>KPIs that match hospitality, not generic SaaS</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Layouts your managers can actually read</span>
                  </li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.12} y={22} className="core-media">
              <DashboardPreview paused={paused} />
            </Reveal>
          </article>

          <article className="core-row core-row-integrations is-flip">
            <div className="core-copy">
              <Reveal y={16}>
                <span className="core-icon" aria-hidden="true">
                  ◎
                </span>
              </Reveal>
              <Reveal delay={0.06} y={16}>
                <h3>Third-Party Integration</h3>
              </Reveal>
              <Reveal delay={0.1} y={14}>
                <p>
                  Connect payments, messaging, channel managers and the tools you already rely on —
                  without forcing a rip-and-replace.
                </p>
              </Reveal>
              <Reveal delay={0.14} y={12}>
                <ul className="core-points">
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Payments and booking channels mapped early</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>WhatsApp, mail and desk tools in the same flow</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Only change what needs to change</span>
                  </li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.12} y={22} className="core-media">
              <IntegrationNetwork paused={paused} />
            </Reveal>
          </article>

          <article className="core-row core-row-automation">
            <div className="core-copy">
              <Reveal y={16}>
                <span className="core-icon" aria-hidden="true">
                  ↻
                </span>
              </Reveal>
              <Reveal delay={0.06} y={16}>
                <h3>Workflow Automation</h3>
              </Reveal>
              <Reveal delay={0.1} y={14}>
                <p>
                  Move a booking, an order or a lead through clear steps — so the next person
                  already has context.
                </p>
              </Reveal>
              <Reveal delay={0.14} y={12}>
                <ul className="core-points">
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Bookings → rooms → housekeeping, in sequence</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Orders with a state the pass can trust</span>
                  </li>
                  <li>
                    <i aria-hidden="true">✓</i>
                    <span>Follow-ups that do not die in an inbox</span>
                  </li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.12} y={22} className="core-media">
              <WorkflowPreview paused={paused} />
            </Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}
