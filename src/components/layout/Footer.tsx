"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./footer.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  const reduceMotion = useReducedMotion();
  const [motionOn, setMotionOn] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("beyondos-motion");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = stored ? stored !== "paused" : !prefersReduce;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
  }, []);

  function toggleMotion() {
    const next = !motionOn;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
    window.localStorage.setItem("beyondos-motion", next ? "on" : "paused");
  }

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div>
          <Link href="/" className="wordmark" aria-label="Beyond OS home">
            <span className="brand-icon">b</span>
            beyond
            <span className="os">os</span>
          </Link>
          <p className="footer-copy">
            Software, websites and growth
            <br />
            for hotels and restaurants.
            <br />
            Part of Beyond, in Tbilisi.
          </p>
          <span className="footer-coords">
            Tbilisi, Georgia · 41.7151° N / 44.8271° E
          </span>
        </div>

        <div className="footer-col">
          <span className="mono">Solutions</span>
          <Link href="/services/crm">CRM</Link>
          <Link href="/services/oms">Restaurant OMS</Link>
          <Link href="/services/hms">Hotel HMS</Link>
        </div>

        <div className="footer-col">
          <span className="mono">Services</span>
          <Link href="/services/web">Web Development</Link>
          <Link href="/services/growth">Digital Growth &amp; Branding</Link>
          <Link href="/#contact">Start a conversation ↗</Link>
        </div>

        <div className="footer-col">
          <span className="mono">Explore</span>
          <Link href="/#work">Selected work</Link>
          <Link href="/#approach">Our approach</Link>
          <Link href="/#insights">Insights</Link>
          <a href="https://www.beyondgeorgia.com/" target="_blank" rel="noopener noreferrer">
            Beyond Georgia ↗
          </a>
          <Link href="/#ecosystem">The ecosystem</Link>
        </div>
      </div>

      <div className="footer-bottom wrap">
        <span>© 2026 Beyond OS</span>
        <span>Tbilisi · Hotels, restaurants &amp; hospitality brands</span>
        <button
          type="button"
          aria-pressed={!motionOn}
          onClick={toggleMotion}
        >
          {motionOn ? "Pause motion Ⅱ" : "Play motion ▶"}
        </button>
        <Link href="/#top">Back to top ↑</Link>
      </div>

      <motion.div
        className="footer-banner"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 0.92 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.1, ease }}
      >
        <Image
          src="/footer-reach.jpg"
          alt="A mechanical hand and a human hand, almost meeting."
          fill
          sizes="100vw"
          priority={false}
        />
      </motion.div>
    </footer>
  );
}
