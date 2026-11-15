"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Guest CRM view for "The Mountain House" console: one guest's full profile
 * (value, stays, spend, preferences) beside a live activity timeline.
 * Monochrome on purpose — the hero is black / white.
 */

const ease = [0.22, 1, 0.36, 1] as const;

/** Monthly spend, last 12 months (relative heights 0–1). */
const SPEND = [0.18, 0.26, 0.2, 0.42, 0.34, 0.3, 0.58, 0.46, 0.4, 0.72, 0.64, 0.92];
const MONTHS = ["D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"];

const STATS = [
  { label: "Lifetime value", value: "₾4,820" },
  { label: "Stays", value: "4" },
  { label: "Next visit", value: "Fri · 20:00" },
];

const PREFS = ["Terrace", "Quiet table", "Late check-out", "Still water"];

type Activity = { icon: "chat" | "bed" | "star" | "card"; title: string; meta: string; time: string; live?: boolean };

const ACTIVITY: Activity[] = [
  { icon: "chat", title: "“Quiet table on Friday?”", meta: "WhatsApp · 2 guests", time: "now", live: true },
  { icon: "bed", title: "Suite 201 confirmed", meta: "3 nights · early check-in", time: "1d" },
  { icon: "card", title: "Deposit ₾300 received", meta: "Direct booking", time: "1d" },
  { icon: "star", title: "Left a 5★ review", meta: "“Felt like coming home”", time: "Mar" },
];

function Icon({ name }: { name: Activity["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {name === "chat" && <path {...common} d="M3 4.5h10v6H7l-3 2.5v-2.5H3z" />}
      {name === "bed" && <path {...common} d="M2 12V5m0 4h12v3m0-3V7.5A1.5 1.5 0 0 0 12.5 6H7v3M4.5 7.5h.01" />}
      {name === "card" && <path {...common} d="M2.5 4.5h11v7h-11zM2.5 7h11M5 9.5h2" />}
      {name === "star" && <path {...common} d="m8 2.5 1.7 3.4 3.8.6-2.7 2.6.6 3.8L8 11.1l-3.4 1.8.6-3.8-2.7-2.6 3.8-.6z" />}
    </svg>
  );
}

export function HeroCrmView({ reduce }: { reduce: boolean }) {
  const enter = (delay: number, y = 10) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease, delay },
        };

  return (
    <>
      <div className="hcrm-profile">
        <motion.div className="hcrm-id" {...enter(0.02)}>
          <span className="hcrm-avatar">
            <Image src="/media/avatars/guest-01.jpg" alt="" fill sizes="52px" />
          </span>
          <span className="hcrm-name">
            <strong>Giorgi Beridze</strong>
            <small>Returning guest · Tbilisi · since 2023</small>
          </span>
          <span className="hcrm-tier">VIP</span>
        </motion.div>

        <div className="hcrm-stats">
          {STATS.map((stat, i) => (
            <motion.span key={stat.label} className="hcrm-stat" {...enter(0.1 + i * 0.06)}>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
            </motion.span>
          ))}
        </div>

        <motion.div className="hcrm-chart" {...enter(0.22)}>
          <div className="hcrm-chart-head">
            <small>Spend · last 12 months</small>
            <em>+38%</em>
          </div>
          <div className="hcrm-bars" aria-hidden="true">
            {SPEND.map((h, i) => (
              <span key={i} className="hcrm-bar-col">
                <motion.i
                  className={i === SPEND.length - 1 ? "is-now" : undefined}
                  style={{ height: `${Math.round(h * 100)}%`, transformOrigin: "50% 100%" }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.04 }}
                />
                <b>{MONTHS[i]}</b>
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div className="hcrm-prefs" {...enter(0.42, 6)}>
          {PREFS.map((pref) => (
            <span key={pref}>{pref}</span>
          ))}
        </motion.div>
      </div>

      <aside className="hcrm-activity">
        <div className="hcrm-activity-head">
          <small>Activity</small>
          <span className="hcrm-live">
            <i aria-hidden="true" /> Live
          </span>
        </div>
        <ol className="hcrm-timeline">
          {ACTIVITY.map((item, i) => (
            <motion.li
              key={item.title}
              className={item.live ? "is-live" : undefined}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.18 + i * 0.09 }}
            >
              <span className="hcrm-ico">
                <Icon name={item.icon} />
              </span>
              <span className="hcrm-ev">
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
              <time>{item.time}</time>
            </motion.li>
          ))}
        </ol>
        <motion.a className="hcrm-suggest" href="#services" {...enter(0.6, 6)}>
          <span>
            <small>Assistant</small>
            Offer the terrace at 20:00 and confirm the deposit.
          </span>
          <b aria-hidden="true">Draft reply →</b>
        </motion.a>
      </aside>
    </>
  );
}
