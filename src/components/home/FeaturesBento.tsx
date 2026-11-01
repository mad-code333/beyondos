"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./features-bento.css";

const ease = [0.22, 1, 0.36, 1] as const;

const dashBars = [40, 65, 48, 80, 55, 72, 90];
const phoneBars = [45, 70, 52, 88, 60];
const liveBars = [55, 78, 42, 90, 64, 72];
const readyBars = [38, 62, 48, 80, 55];
const reportBars = [50, 72, 44, 86, 58, 76];

const transactions = [
  { label: "Suite 12 · 3 nights", amount: "₾1,240" },
  { label: "Table 07 · Dinner", amount: "₾186" },
  { label: "Direct booking · 2 nights", amount: "₾640" },
];

function Bars({ heights, small }: { heights: number[]; small?: boolean }) {
  return (
    <div className={`dash-bars${small ? " dash-bars-sm" : ""}`} aria-hidden>
      {heights.map((height, index) => (
        <i key={`${height}-${index}`} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -18]);
  const photoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1.02]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section features-bento${live ? " is-live" : ""}`}
      id="features"
    >
      <div className="bento-glow" aria-hidden />

      <div className="wrap">
        <div>
          <motion.div
            className="eyebrow mono"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
          >
            03 / Across the property
          </motion.div>

          <div className="section-head bento-head">
            <h2 className="bento-title">
              <span className="bento-title-line">
                <motion.span
                  initial={reduce ? false : { y: 64 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease }}
                >
                  What the day
                </motion.span>
              </span>
              <span className="bento-title-line">
                <motion.em
                  initial={reduce ? false : { y: 64 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.06 }}
                >
                  should feel like.
                </motion.em>
              </span>
            </h2>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.1 }}
            >
              Tools shaped for the desk, the floor and the kitchen — not a generic suite with
              hospitality pasted on.
            </motion.p>
          </div>
        </div>

        <div className="bento-grid">
        <motion.article
          className="bento-card bento-wide"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease }}
        >
          <div className="bento-visual dashboard">
            <div className="dash-row">
              <div>
                <span>Revenue</span>
                <strong>
                  <span className="bento-count">₾53,000</span>
                </strong>
                <em>This week</em>
              </div>
              <div>
                <span>Occupancy</span>
                <strong>
                  <span className="bento-count">86%</span>
                </strong>
                <em>In house</em>
              </div>
            </div>
            <Bars heights={dashBars} />
          </div>
          <h3>Software for this property</h3>
          <p>Reservations, orders and guest context — built for the desk, floor and kitchen.</p>
        </motion.article>

        <motion.article
          className="bento-card bento-tall"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.06 }}
        >
          <div className="bento-visual phone">
            <div className="phone-screen">
              <div className="phone-hero">
                <Image
                  src="/media/suite.jpg"
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover"
                />
                <div className="phone-hero-copy">
                  <span className="planet-mark" aria-hidden />
                  <strong>Tonight</strong>
                  <em>The property, in hand</em>
                </div>
              </div>

              <div className="phone-metric">
                <div>
                  <span>Open now</span>
                  <strong>
                    <span className="bento-count">3</span>
                  </strong>
                </div>
                <Bars heights={phoneBars} small />
              </div>

              <ul>
                <motion.li
                  className="live"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.18 }}
                >
                  <i aria-hidden />
                  <span>
                    <b>Room 204</b>
                    <small>In house · Suite</small>
                  </span>
                </motion.li>
                <motion.li
                  className="ready"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.26 }}
                >
                  <i aria-hidden />
                  <span>
                    <b>Table 07</b>
                    <small>Ready · Dinner</small>
                  </span>
                </motion.li>
              </ul>

              <div className="phone-strip" aria-hidden>
                <span style={{ backgroundImage: "url(/media/desk.jpg)" }} />
                <span style={{ backgroundImage: "url(/media/dining.jpg)" }} />
                <span style={{ backgroundImage: "url(/media/kitchen.jpg)" }} />
              </div>
            </div>
          </div>
          <h3>In the team’s pocket</h3>
          <p>The same stay, order and follow-up — already in someone’s hand.</p>
        </motion.article>

        <motion.article
          className="bento-card bento-ai"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.08 }}
        >
          <div className="bento-visual live">
            <span className="pill">Tonight’s covers</span>
            <motion.div
              className="live-figure"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: reduce ? 0 : 0.12 }}
            >
              <strong>
                <span className="bento-count">42</span>
              </strong>
              <span>Expected · 19:00</span>
            </motion.div>
            <Bars heights={liveBars} small />
          </div>
          <h3>The room, before it fills</h3>
          <p>Covers, arrivals and open enquiries — while there’s still time to act.</p>
        </motion.article>

        <motion.article
          className="bento-card bento-icon"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.1 }}
        >
          <motion.div ref={photoRef} className="bento-photo" style={{ y: photoY, scale: photoScale }}>
            <Image
              src="/media/corridor.jpg"
              alt="A quiet hotel corridor, one sconce and a closed door."
              fill
              sizes="(max-width: 980px) 100vw, 28vw"
              className="object-cover"
            />
          </motion.div>
          <div className="bento-photo-metric">
            <div>
              <span>Ready rooms</span>
              <strong>
                <span className="bento-count">18</span>
              </strong>
            </div>
            <Bars heights={readyBars} small />
          </div>
        </motion.article>

        <motion.article
          className="bento-card bento-report"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.12 }}
        >
          <div className="bento-visual report">
            <div className="report-head">
              <span className="mono">Your transactions</span>
              <span className="mono">Today</span>
            </div>
            <div className="report-metric">
              <div>
                <span>Settled</span>
                <strong>
                  <span className="bento-count">₾2,024</span>
                </strong>
              </div>
              <Bars heights={reportBars} small />
            </div>
            <ul>
              {transactions.map((row, index) => (
                <motion.li
                  key={row.label}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease, delay: reduce ? 0 : 0.16 + index * 0.06 }}
                >
                  <span>{row.label}</span>
                  <strong>
                    +<span className="bento-count">{row.amount}</span>
                  </strong>
                </motion.li>
              ))}
            </ul>
          </div>
          <h3>A close you can trust</h3>
          <p>Revenue, orders and occupancy in one picture — useful when service ends.</p>
        </motion.article>
        </div>
      </div>
    </section>
  );
}
