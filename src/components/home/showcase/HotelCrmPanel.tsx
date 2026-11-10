"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./showcase.css";

const ease = [0.22, 1, 0.36, 1] as const;

const guest = {
  initials: "NK",
  name: "Nino Kalandadze",
  email: "nino.k@example.com",
  phone: "+995 555 014 228",
  stays: "7 previous stays",
  preference: "Quiet suite · late checkout",
  note: "Prefers WhatsApp for pre-arrival. Allergic to shellfish — flag for restaurant.",
  status: "Confirmed · Suite 12 · Fri–Sun",
};

const pipeline = [
  { name: "David R.", detail: "Returning · 2 nights", stage: "Conversation", value: "₾840" },
  { name: "Ana M.", detail: "Dining + stay enquiry", stage: "New", value: "₾1,120" },
  { name: "Nino K.", detail: "Suite · VIP", stage: "Confirmed", value: "₾1,440" },
];

type Phase = 0 | 1 | 2 | 3;

export function HotelCrmPanel() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);

  useEffect(() => {
    if (reduce) {
      setPhase(3);
      return;
    }
    const timers = [
      window.setTimeout(() => setPhase(1), 700),
      window.setTimeout(() => setPhase(2), 1600),
      window.setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduce]);

  return (
    <div className="sx">
      <div className="sx-topline">
        <div>
          <h3>Every guest. Every stay.</h3>
          <p>Guest relationships and context — demonstration data</p>
        </div>
        <span className="sx-badge is-demo">
          <i /> Demo preview
        </span>
      </div>

      <div className="sx-kpis">
        <Kpi label="Open enquiries" value="08" hint="This week" delay={0.04} />
        <Kpi label="Confirmed" value="03" hint="Ready to arrive" delay={0.1} accent />
        <Kpi label="VIP guests" value="02" hint="In house + arriving" delay={0.16} />
        <Kpi label="Follow-ups due" value="05" hint="Today" delay={0.22} />
      </div>

      <div className="sx-split">
        <motion.div
          className="sx-card"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: phase >= 1 ? 1 : 0.35, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="sx-card-head">
            <strong>Guest profile</strong>
            <span className="sx-status is-accent">VIP</span>
          </div>
          <div className="sx-guest">
            <div className="sx-avatar" aria-hidden="true">
              {guest.initials}
            </div>
            <div className="sx-guest-meta">
              <h4>
                {guest.name} <span className="sx-vip">VIP</span>
              </h4>
              <p>{guest.status}</p>
            </div>
          </div>
          <div className="sx-facts">
            <div className="sx-fact">
              <span>Contact</span>
              <b>{guest.email}</b>
            </div>
            <div className="sx-fact">
              <span>Phone</span>
              <b>{guest.phone}</b>
            </div>
            <div className="sx-fact">
              <span>History</span>
              <b>{guest.stays}</b>
            </div>
            <div className="sx-fact">
              <span>Preferences</span>
              <b>{guest.preference}</b>
            </div>
          </div>
          <div className="sx-notes">{guest.note}</div>
        </motion.div>

        <motion.div
          className="sx-card"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: phase >= 1 ? 1 : 0.35, y: 0 }}
          transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.08 }}
        >
          <div className="sx-card-head">
            <strong>Pipeline</strong>
            <span>3 stages</span>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {pipeline.map((row, index) => (
              <motion.div
                key={row.name}
                className="sx-menu-item"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
                initial={reduce ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.12 + index * 0.06, duration: 0.35, ease }}
              >
                <div>
                  <b style={{ color: "#eee" }}>{row.name}</b>
                  <div style={{ fontSize: 11, color: "#8f8f89", marginTop: 2 }}>{row.detail}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`sx-status ${row.stage === "Confirmed" ? "is-ok" : row.stage === "New" ? "is-warn" : "is-soft"}`}>
                    {row.stage}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#c8c8c2" }}>{row.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="sx-card"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 2 ? 1 : 0.25, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="sx-card-head">
          <strong>Operations assistant</strong>
          <span>Visual demonstration only</span>
        </div>
        <div className="sx-ai">
          <AnimatePresence>
            {phase >= 2 ? (
              <motion.div
                key="user"
                className="sx-ai-msg is-user"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <strong>Front desk</strong>
                Show me today&apos;s arrivals and outstanding balances.
              </motion.div>
            ) : null}
            {phase >= 3 ? (
              <motion.div
                key="bot"
                className="sx-ai-msg is-bot"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <strong>Assistant</strong>
                12 arrivals today. 8 reservations are confirmed. 3 guests have outstanding balances.
                <div className="sx-ai-stats">
                  <div>
                    <b>12</b>
                    <span>Arrivals</span>
                  </div>
                  <div>
                    <b>08</b>
                    <span>Confirmed</span>
                  </div>
                  <div>
                    <b>03</b>
                    <span>Balances due</span>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
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
