"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import "./ecosystem.css";

const PremiumEarth = dynamic(
  () => import("./PremiumEarth").then((m) => m.PremiumEarth),
  {
    ssr: false,
    loading: () => <div className="earth-globe-wrap" aria-hidden="true" />,
  },
);

const ease = [0.22, 1, 0.36, 1] as const;

const navStrip = [
  { href: "/services/crm", label: "CRM" },
  { href: "/services/oms", label: "Restaurant OMS" },
  { href: "/services/hms", label: "Hotel HMS" },
  { href: "/services/web", label: "Web Development" },
  { href: "/services/growth", label: "Digital Growth" },
] as const;

const practices = [
  {
    n: "01",
    title: "Beyond Georgia",
    body: "Demand. A Georgia-only travel platform — stays, tours, transfers, dining, WhatsApp booking — so the right guests find your property with clear intent.",
    href: "https://www.beyondgeorgia.com/",
    cta: "Visit Beyond Georgia",
    external: true,
  },
  {
    n: "02",
    title: "Beyond Supply",
    body: "Cost. B2B ecommerce for hotels and restaurants — food, linen, amenities, equipment — so procurement is calmer than five vendor chats.",
    href: "/beyondsupply",
    cta: "Explore Beyond Supply",
    external: false,
  },
  {
    n: "03",
    title: "Beyond OS",
    body: "Operations. HMS, OMS, CRM, websites and digital growth — the systems that run the desk, the pass and the direct booking path.",
    href: "/#services",
    cta: "Explore Beyond OS",
    external: false,
  },
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

const fadeGlobe = (reduce: boolean) =>
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

          <ul className="ecosystem-list">
            {practices.map((item, index) => (
              <motion.li key={item.n} {...fadeCard(0.06 + index * 0.05, reduce)}>
                <span className="mono">{item.n}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.cta} ↗
                    </a>
                  ) : (
                    <Link href={item.href}>
                      {item.cta} ↗
                    </Link>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>

          <span className="mono georgia-coords">41.7151° N / 44.8271° E · Tbilisi</span>
        </motion.div>

        <motion.div className="globe-stage" {...fadeGlobe(reduce)}>
          <PremiumEarth className="earth-globe-wrap" />
          <span className="mono globe-caption">Green pin = Georgia · Tbilisi</span>
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
