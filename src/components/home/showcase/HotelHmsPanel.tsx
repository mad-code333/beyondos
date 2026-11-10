"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./showcase.css";

const ease = [0.22, 1, 0.36, 1] as const;

const reservations = [
  {
    guest: "Nino K.",
    room: "Suite 12",
    arrive: "Fri 14",
    depart: "Sun 16",
    status: "Confirmed",
    pay: "Deposit paid",
    tone: "ok" as const,
  },
  {
    guest: "David R.",
    room: "Classic 07",
    arrive: "Today",
    depart: "Sat 15",
    status: "Arriving",
    pay: "Balance due",
    tone: "warn" as const,
  },
  {
    guest: "Ana M.",
    room: "Terrace 03",
    arrive: "Today",
    depart: "Mon 17",
    status: "Checked in",
    pay: "Settled",
    tone: "ok" as const,
  },
  {
    guest: "Mariam D.",
    room: "Suite 08",
    arrive: "Sat 15",
    depart: "Tue 18",
    status: "Hold",
    pay: "Awaiting card",
    tone: "soft" as const,
  },
];

const hkSeed = [
  { label: "Clean", count: 9 },
  { label: "Dirty", count: 4 },
  { label: "Occupied", count: 11 },
  { label: "Inspect", count: 2 },
  { label: "In progress", count: 3 },
];

export function HotelHmsPanel() {
  const reduce = useReducedMotion();
  const [hk, setHk] = useState(hkSeed);
  const [flash, setFlash] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(2);
      return;
    }
    const t1 = window.setTimeout(() => setStep(1), 600);
    const t2 = window.setTimeout(() => {
      setStep(2);
      setHk((current) =>
        current.map((item) => {
          if (item.label === "Dirty") return { ...item, count: Math.max(0, item.count - 1) };
          if (item.label === "In progress") return { ...item, count: item.count + 1 };
          return item;
        }),
      );
      setFlash(4);
    }, 2200);
    const t3 = window.setTimeout(() => {
      setHk((current) =>
        current.map((item) => {
          if (item.label === "In progress") return { ...item, count: Math.max(0, item.count - 1) };
          if (item.label === "Clean") return { ...item, count: item.count + 1 };
          return item;
        }),
      );
      setFlash(0);
    }, 4200);
    const t4 = window.setTimeout(() => setFlash(null), 5200);
    return () => [t1, t2, t3, t4].forEach((id) => window.clearTimeout(id));
  }, [reduce]);

  return (
    <div className="sx">
      <div className="sx-topline">
        <div>
          <h3>The property at a glance</h3>
          <p>Front desk · rooms · housekeeping — demonstration data</p>
        </div>
        <span className="sx-badge is-demo">
          <i /> Demo preview
        </span>
      </div>

      <div className="sx-kpis">
        <Kpi label="Arrivals" value="12" hint="Today" delay={0.04} />
        <Kpi label="Departures" value="07" hint="Today" delay={0.08} />
        <Kpi label="In house" value="18" hint="Of 24 rooms" delay={0.12} accent />
        <Kpi label="Available" value="06" hint="Ready to sell" delay={0.16} />
      </div>

      <motion.div
        className="sx-card"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: step >= 1 ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="sx-card-head">
          <strong>Reservations</strong>
          <span>Room assignment & payment</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="sx-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Arrive</th>
                <th>Depart</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((row, index) => (
                <motion.tr
                  key={row.guest}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.08 + index * 0.05, duration: 0.3 }}
                >
                  <td>{row.guest}</td>
                  <td>{row.room}</td>
                  <td>{row.arrive}</td>
                  <td>{row.depart}</td>
                  <td>
                    <span className={`sx-status is-${row.tone}`}>{row.status}</span>
                  </td>
                  <td>{row.pay}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        className="sx-card"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: step >= 2 ? 1 : 0.35, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="sx-card-head">
          <strong>Housekeeping board</strong>
          <span>Room readiness</span>
        </div>
        <div className="sx-hk">
          {hk.map((item, index) => (
            <div key={item.label} className={`sx-hk-cell${flash === index ? " is-flash" : ""}`}>
              <b>{String(item.count).padStart(2, "0")}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="sx-disclaimer">Statuses update as a visual demonstration of the readiness handoff.</p>
      </motion.div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  delay = 0,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      className={`sx-kpi${accent ? " is-accent" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease }}
    >
      <span>{label}</span>
      <b>{value}</b>
      <small>{hint}</small>
    </motion.div>
  );
}
