"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";

/**
 * "The Mountain House" — an illustrative property running on Beyond OS,
 * shown under the hero horizon. Original, coded UI (no third-party screenshots).
 * Operations borrows the live-service event pattern common to restaurant POS
 * tools; Guest CRM carries an assistant-style desk note.
 */

export type TabId = "reservations" | "crm" | "operations" | "booking";
type Tone = "ok" | "warn" | "soft" | "accent";

type Row = { title: string; meta: string; status: string; tone: Tone };
type Note = { kicker: string; body: string; action: string };
type View = { heading: string; count: string; rows: Row[]; note: Note };

const TABS: { id: TabId; label: string }[] = [
  { id: "reservations", label: "Reservations" },
  { id: "crm", label: "Guest CRM" },
  { id: "operations", label: "Operations" },
  { id: "booking", label: "Direct booking" },
];

const VIEWS: Record<TabId, View> = {
  reservations: {
    heading: "Reservations",
    count: "5 arrivals",
    rows: [
      { title: "101 Classic", meta: "A. Morgan · today", status: "14:00 in", tone: "accent" },
      { title: "201 Suite", meta: "D. Rivera · 3 nights", status: "Room ready", tone: "ok" },
      { title: "301 Terrace", meta: "Departure · 11:00", status: "Housekeeping", tone: "warn" },
    ],
    note: {
      kicker: "Desk · sample",
      body: "Two arrivals before 15:00. Suite 201 cleared for early check-in.",
      action: "Open arrivals",
    },
  },
  crm: {
    heading: "Guest CRM",
    count: "3 guests",
    rows: [
      { title: "Nino K.", meta: "Returning · prefers terrace", status: "Follow-up due", tone: "warn" },
      { title: "David R.", meta: "4 stays · anniversary in May", status: "Confirmed", tone: "ok" },
      { title: "Ana M.", meta: "Dining enquiry · WhatsApp", status: "In conversation", tone: "soft" },
    ],
    note: {
      kicker: "Assistant · sample",
      body: "Nino asked for a quiet table on Friday. Suggest the terrace at 20:00 and confirm the deposit.",
      action: "Draft reply",
    },
  },
  operations: {
    heading: "Live service",
    count: "9 open tickets",
    rows: [
      { title: "Table F2 · Available", meta: "Ready for seating", status: "Free", tone: "ok" },
      { title: "T07 · Order placed", meta: "Ticket sent to the kitchen", status: "Firing", tone: "accent" },
      { title: "T12 · Occupied 24 min", meta: "Check in with the table", status: "Attention", tone: "warn" },
    ],
    note: {
      kicker: "Kitchen · sample",
      body: "Average ticket time 11 minutes. Three plates ready at the pass for terrace tables.",
      action: "Open kitchen view",
    },
  },
  booking: {
    heading: "Direct booking",
    count: "This week",
    rows: [
      { title: "Website enquiries", meta: "From search and social", status: "128", tone: "accent" },
      { title: "Booked direct", meta: "No commission paid", status: "42%", tone: "ok" },
      { title: "Abandoned at dates", meta: "Recovered by email", status: "6 back", tone: "soft" },
    ],
    note: {
      kicker: "Growth · sample",
      body: "Weekend cottage searches are up. A two-night offer page could catch them before the OTAs do.",
      action: "Plan the offer",
    },
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 6h8M7 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Controlled by the hero (its tab follows the highlighted service), or
 * self-managed when no `tab` is passed.
 */
export function HeroWorkspace({
  tab: tabProp,
  onTabChange,
}: {
  tab?: TabId;
  onTabChange?: (tab: TabId) => void;
} = {}) {
  const reduce = Boolean(useReducedMotion());
  const [ownTab, setOwnTab] = useState<TabId>("reservations");
  const tab = tabProp ?? ownTab;
  const setTab = (next: TabId) => {
    if (tabProp === undefined) setOwnTab(next);
    onTabChange?.(next);
  };
  const view = VIEWS[tab];

  return (
    <div className="hw" aria-label="The Mountain House, an illustrative Beyond OS workspace">
      <header className="hw-head">
        <span className="hw-logo" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M2 13 6.5 6l2.5 3.5L11 7l3 6Z" fill="currentColor" />
          </svg>
        </span>
        <span className="hw-title">
          <strong>The Mountain House</strong>
          <small>Illustrative property / Beyond OS</small>
        </span>
        <span className="hw-badge">Interactive concept</span>
      </header>

      <LayoutGroup id="hw-tabs">
        <div className="hw-tabs" role="tablist" aria-label="Workspace views">
          {TABS.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`hw-tab${active ? " is-active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                {active ? (
                  <motion.span
                    layoutId="hw-tab-pill"
                    className="hw-tab-pill"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="hw-tab-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="hw-body" role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="hw-view"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.14 } }}
            transition={{ duration: 0.2 }}
          >
            <div className="hw-main">
              <div className="hw-view-head">
                <span>
                  <small>Your workspace</small>
                  <motion.strong
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {view.heading}
                  </motion.strong>
                </span>
                <em>{view.count}</em>
              </div>
              <ul className="hw-rows">
                {view.rows.map((row, i) => (
                  <motion.li
                    key={row.title}
                    className="hw-row"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.08 + i * 0.08 }}
                  >
                    <span>
                      <strong>{row.title}</strong>
                      <small>{row.meta}</small>
                    </span>
                    <em className={`is-${row.tone}`}>{row.status}</em>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.aside
              className="hw-note"
              initial={reduce ? false : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.3 }}
            >
              <small>
                <i aria-hidden="true" />
                {view.note.kicker}
              </small>
              <p>{view.note.body}</p>
              <a href="#services">
                {view.note.action} <ArrowRight />
              </a>
            </motion.aside>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
