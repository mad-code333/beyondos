"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./booking-flow.css";

const ease = [0.22, 1, 0.36, 1] as const;

type FlowStep = {
  n: string;
  title: string;
  body: string;
  accent: string;
  Visual: () => ReactNode;
};

function BookingVisual() {
  return (
    <div className="bf-visual bf-visual--book" aria-hidden="true">
      <div className="bf-chrome">
        <span />
        <span />
        <span />
        <em>Beyond Georgia</em>
      </div>
      <div className="bf-book-search">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
          <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m15.2 15.2 3.4 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Stay in Tbilisi</span>
      </div>
      <div className="bf-book-dates">
        <div>
          <small>Check in</small>
          <strong>12 Apr</strong>
        </div>
        <div>
          <small>Check out</small>
          <strong>15 Apr</strong>
        </div>
        <div>
          <small>Guests</small>
          <strong>2 adults</strong>
        </div>
      </div>
      <div className="bf-book-card">
        <div className="bf-book-thumb" />
        <div>
          <strong>Sololaki Courtyard</strong>
          <span>Old Tbilisi · Boutique stay</span>
        </div>
        <em>Booked</em>
      </div>
      <div className="bf-wa-pill">
        <i />
        WhatsApp confirmation sent
      </div>
    </div>
  );
}

function DeskVisual() {
  return (
    <div className="bf-visual bf-visual--desk" aria-hidden="true">
      <div className="bf-desk-grid">
        <div className="bf-desk-panel bf-desk-panel--hms">
          <header>
            <span>HMS</span>
            <em>Live</em>
          </header>
          <div className="bf-desk-row">
            <strong>Sololaki Courtyard</strong>
            <span>12–15 Apr</span>
          </div>
          <div className="bf-desk-row is-dim">
            <strong>Room 204</strong>
            <span>King · late arrival</span>
          </div>
          <div className="bf-desk-bar">
            <i style={{ width: "72%" }} />
          </div>
        </div>
        <div className="bf-desk-panel bf-desk-panel--crm">
          <header>
            <span>CRM</span>
            <em>Synced</em>
          </header>
          <div className="bf-desk-guest">
            {/* eslint-disable-next-line @next/next/no-img-element -- static showcase avatar */}
            <img src="/media/avatars/guest-01.jpg" alt="" draggable={false} />
            <div>
              <strong>Giorgi Beridze</strong>
              <span>VIP · WhatsApp preferred</span>
            </div>
          </div>
          <ul>
            <li>Quiet room</li>
            <li>Late check-in</li>
            <li>Prior stay · Mar 2025</li>
          </ul>
        </div>
      </div>
      <div className="bf-desk-link">
        <span />
        <b />
        <span />
      </div>
    </div>
  );
}

function WhatsAppVisual() {
  return (
    <div className="bf-visual bf-visual--wa" aria-hidden="true">
      <div className="bf-wa-phone">
        <div className="bf-wa-notch" />
        <div className="bf-wa-head">
          <span className="bf-wa-avatar" />
          <div>
            <strong>Beyond Stay</strong>
            <small>online</small>
          </div>
        </div>
        <div className="bf-wa-thread">
          <div className="bf-wa-bubble bf-wa-bubble--out">
            Hi Giorgi — looking forward to hosting you.
          </div>
          <div className="bf-wa-bubble bf-wa-bubble--out bf-wa-bubble--late">
            Check-in from 15:00. Taxi tip and door code below.
          </div>
          <div className="bf-wa-meta">
            <i />
            Directions · timing · door code
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplyVisual() {
  return (
    <div className="bf-visual bf-visual--supply" aria-hidden="true">
      <div className="bf-supply-alert">
        <i />
        <div>
          <strong>Low stock · linen</strong>
          <span>Housekeeping flagged Room block B</span>
        </div>
      </div>
      <div className="bf-supply-order">
        <header>
          <span>Beyond Supply</span>
          <em>Draft order</em>
        </header>
        <div className="bf-supply-line">
          <b />
          <div>
            <strong>King sheets · white</strong>
            <span>× 24</span>
          </div>
        </div>
        <div className="bf-supply-line">
          <b className="is-alt" />
          <div>
            <strong>Bath amenities kit</strong>
            <span>× 40</span>
          </div>
        </div>
        <div className="bf-supply-cta">Place one order →</div>
      </div>
    </div>
  );
}

const STEPS: FlowStep[] = [
  {
    n: "01",
    title: "Guest books on Beyond Georgia",
    body: "Stay or experience booked — often via WhatsApp — with clear intent.",
    accent: "#d4b87a",
    Visual: BookingVisual,
  },
  {
    n: "02",
    title: "Desk systems take the stay",
    body: "The reservation lands in HMS and the guest profile opens in CRM — dates, notes and preferences on one desk.",
    accent: "#c4b5fd",
    Visual: DeskVisual,
  },
  {
    n: "03",
    title: "Pre-arrival WhatsApp goes out",
    body: "Directions and timing before check-in — less inbox chaos.",
    accent: "#86efac",
    Visual: WhatsAppVisual,
  },
  {
    n: "04",
    title: "Low stock can trigger Beyond Supply",
    body: "Linen, amenities or kitchen staples reorder without a scattered chase.",
    accent: "#a78bfa",
    Visual: SupplyVisual,
  },
];

function FlowStepRow({
  step,
  index,
  reduce,
}: {
  step: FlowStep;
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px -18% 0px" });
  const reversed = index % 2 === 1;
  const Visual = step.Visual;

  return (
    <motion.article
      ref={ref}
      className={`bf-step${reversed ? " is-reversed" : ""}${inView ? " is-inview" : ""}`}
      style={{ "--bf-accent": step.accent } as CSSProperties}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease, delay: 0.04 }}
    >
      <div className="bf-step-copy">
        <span className="bf-step-index" aria-hidden="true">
          {step.n}
        </span>
        <h4>{step.title}</h4>
        <p>{step.body}</p>
      </div>

      <div className="bf-step-rail" aria-hidden="true">
        <span className="bf-step-node" />
      </div>

      <div className="bf-step-stage">
        <Visual />
      </div>
    </motion.article>
  );
}

export function BookingFlow() {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 35%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="bf-block wrap">
      <motion.header
        className="bf-head"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease }}
      >
        <p className="mono">How a booking moves</p>
        <h3>Guest in. Stock covered. Desk ready.</h3>
      </motion.header>

      <div className="bf-track" ref={trackRef}>
        <div className="bf-spine" aria-hidden="true">
          <span className="bf-spine-base" />
          {!reduce ? <motion.span className="bf-spine-fill" style={{ height: progress }} /> : null}
          {reduce ? <span className="bf-spine-fill is-static" /> : null}
        </div>

        <div className="bf-steps">
          {STEPS.map((step, index) => (
            <FlowStepRow key={step.n} step={step} index={index} reduce={reduce} />
          ))}
        </div>
      </div>
    </div>
  );
}
