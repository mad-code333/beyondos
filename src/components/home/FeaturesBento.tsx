"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import "./features-bento.css";

const ease = [0.22, 1, 0.36, 1] as const;

/* Six-bar equalizer proportions — match the dashboard reference */
const eqBars = [42, 68, 50, 86, 58, 74];
const eqBarsSm = [48, 72, 54, 90, 62, 78];

const transactions = [
  { label: "Suite 12 · 3 nights", amount: "₾1,240" },
  { label: "Table 07 · Dinner", amount: "₾186" },
  { label: "Direct booking · 2 nights", amount: "₾640" },
];

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
};

function Equalizer({ small }: { small?: boolean }) {
  const heights = small ? eqBarsSm : eqBars;
  return (
    <div
      className={`dash-bars eq-bars${small ? " dash-bars-sm" : ""}`}
      aria-hidden
    >
      {heights.map((height, index) => (
        <i key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.22, margin: "0px 0px -8% 0px" });

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22, -22]);
  const photoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1.02]);

  return (
    <section
      ref={sectionRef}
      className={`section features-bento${inView ? " is-live" : ""}`}
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
            custom={0}
            variants={cardReveal}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, scale: 1.008, transition: { duration: 0.35, ease } }
            }
          >
            <div className="bento-visual dashboard">
              <motion.div
                className="dash-row"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.12 }}
              >
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
              </motion.div>
              <Equalizer />
            </div>
            <h3>Software for this property</h3>
            <p>Reservations, orders and guest context — built for the desk, floor and kitchen.</p>
          </motion.article>

          <motion.article
            className="bento-card bento-tall"
            custom={0.06}
            variants={cardReveal}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, scale: 1.008, transition: { duration: 0.35, ease } }
            }
          >
            <div className="bento-visual phone">
              <motion.div
                className="phone-screen"
                animate={
                  reduce
                    ? undefined
                    : {
                        y: [0, -5, 0],
                      }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 6.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                }
              >
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
                  <Equalizer small />
                </div>

                <ul>
                  <motion.li
                    className="live"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.34 }}
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
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.42 }}
                  >
                    <i aria-hidden />
                    <span>
                      <b>Table 07</b>
                      <small>Ready · Dinner</small>
                    </span>
                  </motion.li>
                </ul>

                <motion.div
                  className="phone-strip"
                  aria-hidden
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.48 }}
                >
                  <span style={{ backgroundImage: "url(/media/desk.jpg)" }} />
                  <span style={{ backgroundImage: "url(/media/dining.jpg)" }} />
                  <span style={{ backgroundImage: "url(/media/kitchen.jpg)" }} />
                </motion.div>
              </motion.div>
            </div>
            <h3>In the team’s pocket</h3>
            <p>The same stay, order and follow-up — already in someone’s hand.</p>
          </motion.article>

          <motion.article
            className="bento-card bento-ai"
            custom={0.08}
            variants={cardReveal}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, scale: 1.008, transition: { duration: 0.35, ease } }
            }
          >
            <div className="bento-visual live">
              <span className="pill">Tonight’s covers</span>
              <motion.div
                className="live-figure"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.2 }}
              >
                <strong>
                  <span className="bento-count">42</span>
                </strong>
                <span>Expected · 19:00</span>
              </motion.div>
              <Equalizer small />
            </div>
            <h3>The room, before it fills</h3>
            <p>Covers, arrivals and open enquiries — while there’s still time to act.</p>
          </motion.article>

          <motion.article
            className="bento-card bento-icon"
            custom={0.1}
            variants={cardReveal}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, scale: 1.008, transition: { duration: 0.35, ease } }
            }
          >
            <motion.div
              ref={photoRef}
              className="bento-photo"
              style={{ y: photoY, scale: photoScale }}
            >
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
              <Equalizer small />
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-report"
            custom={0.12}
            variants={cardReveal}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, scale: 1.008, transition: { duration: 0.35, ease } }
            }
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
                <Equalizer small />
              </div>
              <ul>
                {transactions.map((row, index) => (
                  <motion.li
                    key={row.label}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.4,
                      ease,
                      delay: reduce ? 0 : 0.32 + index * 0.07,
                    }}
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
