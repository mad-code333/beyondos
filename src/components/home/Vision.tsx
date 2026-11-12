"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import "./connected.css";

const ease = [0.22, 1, 0.36, 1] as const;

const rings = [
  {
    className: "vision-ring vision-ring--halo is-reverse",
    style: {
      ["--s" as string]: "min(380px, 98%)",
      ["--spin" as string]: "48s",
      ["--breath" as string]: "10s",
      ["--r" as string]: "-12deg",
      ["--d" as string]: "-2s",
      ["--tilt" as string]: "78deg",
    },
    secondNode: false,
  },
  {
    className: "vision-ring vision-ring--far is-reverse",
    style: {
      ["--s" as string]: "min(318px, 86%)",
      ["--spin" as string]: "38s",
      ["--breath" as string]: "9s",
      ["--r" as string]: "-22deg",
      ["--d" as string]: "0s",
      ["--tilt" as string]: "74deg",
    },
    secondNode: false,
  },
  {
    className: "vision-ring vision-ring--mid",
    style: {
      ["--s" as string]: "min(248px, 68%)",
      ["--spin" as string]: "26s",
      ["--breath" as string]: "7s",
      ["--r" as string]: "28deg",
      ["--d" as string]: "-4s",
      ["--tilt" as string]: "72deg",
    },
    secondNode: true,
  },
  {
    className: "vision-ring vision-ring--near is-reverse",
    style: {
      ["--s" as string]: "min(178px, 50%)",
      ["--spin" as string]: "16s",
      ["--breath" as string]: "6s",
      ["--r" as string]: "10deg",
      ["--d" as string]: "-1.5s",
      ["--tilt" as string]: "70deg",
    },
    secondNode: false,
  },
] as const;

export function Vision() {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    const orbit = track.closest(".vision-orbit");
    if (!(orbit instanceof HTMLElement)) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (event: PointerEvent) => {
      const rect = orbit.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * 10;
      targetY = ny * -8;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      track.style.transform = `rotateX(${12 + currentY * 0.35}deg) rotateY(${-18 + currentX}deg) translate3d(${currentX * 0.35}px, ${currentY * 0.25}px, 0)`;
      raf = window.requestAnimationFrame(tick);
    };

    orbit.addEventListener("pointermove", onMove, { passive: true });
    orbit.addEventListener("pointerleave", onLeave);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      orbit.removeEventListener("pointermove", onMove);
      orbit.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <section className="vision" id="vision" aria-labelledby="vision-heading">
      <div className="vision-ambient" aria-hidden="true" />
      <div className="wrap vision-grid">
        <div className="vision-copy">
          <Reveal y={16}>
            <p className="eyebrow vision-eyebrow">One ecosystem · One partner</p>
          </Reveal>
          <Reveal delay={0.08} y={22}>
            <h2 id="vision-heading" className="vision-title">
              Demand. Cost.
              <em>Operations.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16} y={18}>
            <p>
              Beyond Georgia sends guests. Beyond Supply lowers the chase for goods. Beyond OS
              connects the website, the booking, the desk and the kitchen — one partner in Tbilisi,
              not another tool stack.
            </p>
          </Reveal>
          <Reveal delay={0.22} y={14}>
            <Link href="/#ecosystem" className="vision-link">
              See the Beyond ecosystem
              <span aria-hidden="true">↗︎</span>
            </Link>
          </Reveal>
        </div>

        <motion.div
          className="vision-orbit"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease, delay: 0.12 }}
        >
          <div className="vision-orbit-aura" />
          <div className="vision-orbit-rings">
            {rings.map((ring) => (
              <div key={ring.className} className={ring.className} style={ring.style}>
                <span className="vision-ring-edge" />
                <span className="vision-ring-glow" />
                <span className="vision-ring-node" />
                {ring.secondNode ? <span className="vision-ring-node is-second" /> : null}
              </div>
            ))}
          </div>

          <div className="vision-core-track" ref={trackRef}>
            <div className={`vision-core${reduce ? "" : " is-alive"}`}>
              <span className="vision-core-face" />
              <span className="vision-core-sheen" />
              <span className="vision-core-mark">b/os</span>
            </div>
          </div>

          <p className="vision-orbit-label">Operations ↔ Experience ↔ Growth</p>
        </motion.div>

        <a href="/#approach" className="vision-scroll-cue" aria-label="Continue to process">
          <span />
        </a>
      </div>
    </section>
  );
}
