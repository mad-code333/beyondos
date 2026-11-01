"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import "./connected.css";

const ease = [0.22, 1, 0.36, 1] as const;

const rings = [
  { key: "mid", cls: "vision-ring--mid", s: "320px", r: "0deg", spin: "16s", breath: "7s", d: "0s" },
  {
    key: "near",
    cls: "vision-ring--near is-reverse",
    s: "240px",
    r: "65deg",
    spin: "10s",
    breath: "5.5s",
    d: "-2s",
  },
  { key: "far", cls: "vision-ring--far", s: "400px", r: "-45deg", spin: "22s", breath: "9s", d: "-5s" },
] as const;

export function Connected() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reduce || !trackRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    trackRef.current.style.transform = `rotateX(${12 - y * 10}deg) rotateY(${-18 + x * 16}deg)`;
  }

  function untilt() {
    if (!trackRef.current) return;
    trackRef.current.style.transform = "rotateX(12deg) rotateY(-18deg)";
  }

  return (
    <section className="vision" id="ecosystem">
      <div className="vision-ambient" aria-hidden="true" />
      <div className="wrap vision-grid">
        <div className="vision-copy">
          <Reveal y={18}>
            <div className="eyebrow">— Designed to work together</div>
          </Reveal>
          <Reveal delay={0.08} y={22}>
            <h2 className="vision-title">
              One business.
              <em>A connected way forward.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16} y={18}>
            <p>
              Your website starts the conversation. Your software carries it through. Your brand and
              growth strategy bring people back. We design around that whole journey.
            </p>
          </Reveal>
          <Reveal delay={0.22} y={14}>
            <Link className="vision-link" href="/#approach">
              How we connect the dots
              <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>

        <motion.div
          className="vision-orbit"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.93 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          onPointerMove={tilt}
          onPointerLeave={untilt}
        >
          <div className="vision-orbit-aura" />
          <div className="vision-orbit-rings">
            {rings.map((ring) => (
              <span
                key={ring.key}
                className={`vision-ring ${ring.cls}`}
                style={
                  {
                    "--s": ring.s,
                    "--r": ring.r,
                    "--spin": ring.spin,
                    "--breath": ring.breath,
                    "--d": ring.d,
                  } as CSSProperties
                }
              >
                <i className="vision-ring-edge" />
                <i className="vision-ring-glow" />
                <i className="vision-ring-node" />
                <i className="vision-ring-node is-second" />
              </span>
            ))}
          </div>
          <div className="vision-core-track" ref={trackRef}>
            <div className="vision-core">
              <span className="vision-core-sheen" />
              <span className="vision-core-mark">b/os</span>
            </div>
          </div>
          <span className="vision-orbit-label">Operations · Experience · Growth</span>
        </motion.div>
      </div>
    </section>
  );
}
