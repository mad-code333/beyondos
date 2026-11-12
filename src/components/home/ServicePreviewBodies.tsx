"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, animate, motion } from "framer-motion";
import type { ServiceSlug } from "@/content/services";

/**
 * Five independent dashboard previews for the "What we build" card.
 * Each one owns its own entrance, movement and timing. All motion is one-shot
 * (runs once when the service becomes active, then rests), and timers are
 * cleared on unmount so rapid switching never leaves a stale sequence behind.
 */

type BodyProps = { reduce: boolean };

const ease = [0.22, 1, 0.36, 1] as const;

/** Advances 0 → times.length at the given ms offsets, once. Reduced motion jumps to the end. */
function useSequence(times: number[], reduce: boolean) {
  const [step, setStep] = useState(reduce ? times.length : 0);
  useEffect(() => {
    if (reduce) return;
    const ids = times.map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // times is a static literal per body
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);
  return step;
}

/** Number that counts up once, written straight to the DOM (no re-render per frame). */
function Count({
  from,
  to,
  delay = 0,
  duration = 0.9,
  format = (v: number) => String(Math.round(v)),
  reduce,
}: {
  from: number;
  to: number;
  delay?: number;
  duration?: number;
  format?: (value: number) => string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(to);
      return;
    }
    node.textContent = format(from);
    const controls = animate(from, to, {
      duration,
      delay,
      ease,
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
    // format is a stable inline formatter per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, delay, duration, reduce]);
  return <span ref={ref}>{format(reduce ? to : from)}</span>;
}

type Stat = { label: string; value: React.ReactNode; accent?: boolean };

function Stats({ stats, reduce, delay = 0.3 }: { stats: Stat[]; reduce: boolean; delay?: number }) {
  return (
    <div className="svb-stats">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: delay + i * 0.06 }}
        >
          <span className="mono">{stat.label}</span>
          <strong className={stat.accent ? "is-accent" : undefined}>{stat.value}</strong>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── 01 · CRM ─────────────────────────
 * Conversation bubbles pop in from their speaker's side, the guest
 * profile swings in, then a connector draws from the reply to the profile. */

const CRM_MESSAGES = [
  { from: "guest", text: "Do you have a quiet table Friday?" },
  { from: "staff", text: "Yes — terrace at 20:00." },
  { from: "guest", text: "Please — two guests." },
] as const;

function CrmBody({ reduce }: BodyProps) {
  return (
    <>
      <div className="svb svb-crm">
        <div className="svb-panel svb-chat">
          <span className="mono svb-label">WhatsApp · Guest</span>
          {CRM_MESSAGES.map((m, i) => (
            <motion.p
              key={m.text}
              className={`svb-bubble is-${m.from}`}
              style={{ transformOrigin: m.from === "staff" ? "100% 100%" : "0% 100%" }}
              initial={
                reduce ? false : { opacity: 0, scale: 0.6, x: m.from === "staff" ? 14 : -14 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 30, delay: 0.1 + i * 0.24 }}
            >
              {m.text}
            </motion.p>
          ))}
        </div>

        <svg className="svb-crm-link" viewBox="0 0 24 60" aria-hidden="true">
          <motion.path
            d="M0 44 C 12 44, 10 18, 24 18"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.75 }}
          />
          <motion.circle
            cx="24"
            cy="18"
            r="2.4"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 1.2 }}
          />
        </svg>

        <motion.div
          className="svb-panel svb-profile"
          style={{ transformOrigin: "100% 50%", transformPerspective: 600 }}
          initial={reduce ? false : { opacity: 0, rotateY: -38, x: 18 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.42 }}
        >
          <strong>Nino K.</strong>
          <span>Returning · Prefers terrace</span>
          <motion.span
            className="svb-profile-tags"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <i>4 stays</i>
            <i>VIP</i>
          </motion.span>
          <motion.em
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 1.2 }}
          >
            Next: confirm deposit
          </motion.em>
        </motion.div>
      </div>
      <Stats
        reduce={reduce}
        delay={0.5}
        stats={[
          { label: "Scope", value: "12 open" },
          { label: "Won", value: <><Count from={0} to={4} delay={0.6} reduce={reduce} /> deals</> },
          { label: "Reply", value: "2h", accent: true },
        ]}
      />
    </>
  );
}

/* ──────────────────────── 02 · Restaurant OMS ────────────────────────
 * Tickets physically travel between Received → Preparing → Ready
 * (shared-layout moves), the preparing ticket's progress fills,
 * and the floor/kitchen sync chip confirms at the end. */

type Ticket = { id: string; title: string; status: [string, string, string]; col: [number, number, number] };

const OMS_TICKETS: Ticket[] = [
  { id: "t12", title: "T12 · Tasting", status: ["New", "On the line", "On the line"], col: [-1, 0, 0] },
  { id: "t07", title: "T07 · Mains", status: ["Received", "Firing", "On the line"], col: [0, 1, 1] },
  { id: "bar", title: "Bar · 2", status: ["Plating", "Plating", "Pass clear"], col: [1, 1, 2] },
];
const OMS_COLUMNS = ["Received", "Preparing", "Ready"] as const;

function OmsBody({ reduce }: BodyProps) {
  const step = useSequence([380, 1000], reduce);
  return (
    <>
      <div className="svb svb-oms">
        <LayoutGroup id="svb-oms">
          <div className="svb-oms-cols">
            {OMS_COLUMNS.map((column, colIndex) => (
              <motion.div
                key={column}
                className={`svb-oms-col${colIndex === 1 ? " is-hot" : ""}`}
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: colIndex * 0.07 }}
              >
                <span className="mono svb-label">{column}</span>
                {OMS_TICKETS.filter((t) => t.col[step] === colIndex).map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    layoutId={`oms-${ticket.id}`}
                    className={`svb-ticket${colIndex === 1 && ticket.id === "t07" ? " is-firing" : ""}${
                      colIndex === 2 ? " is-ready" : ""
                    }`}
                    initial={reduce ? false : { opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ layout: { type: "spring", stiffness: 260, damping: 28 }, duration: 0.4, ease }}
                  >
                    <strong>{ticket.title}</strong>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={ticket.status[step]}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        {ticket.status[step]}
                      </motion.span>
                    </AnimatePresence>
                    {ticket.id === "t07" && colIndex === 1 ? (
                      <i className="svb-ticket-progress">
                        <motion.b
                          initial={reduce ? false : { scaleX: 0 }}
                          animate={{ scaleX: 0.72 }}
                          transition={{ duration: 0.9, ease, delay: 0.25 }}
                        />
                      </i>
                    ) : null}
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
        <div className={`svb-sync${step >= 2 ? " is-synced" : ""}`}>
          <span className="mono">Floor</span>
          <i aria-hidden="true">
            <motion.b
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: step >= 2 ? "0%" : "-60%" }}
              transition={{ duration: 0.6, ease }}
            />
          </i>
          <span className="mono">Kitchen</span>
          <em>{step >= 2 ? "Synced" : "Syncing"}</em>
        </div>
      </div>
      <Stats
        reduce={reduce}
        delay={0.45}
        stats={[
          { label: "Open", value: <><Count from={5} to={9} delay={0.5} reduce={reduce} /> tickets</> },
          { label: "Pass", value: <><Count from={1} to={3} delay={1.0} duration={0.5} reduce={reduce} /> ready</> },
          { label: "Avg", value: "11m", accent: true },
        ]}
      />
    </>
  );
}

/* ───────────────────────── 03 · Hotel HMS ─────────────────────────
 * Room tiles flip into place in a scattered order, then each room's
 * status changes on its own clock — the board settles room by room. */

type Tone = "ok" | "warn" | "bad" | "in";
type Room = { no: string; from: [string, Tone]; to: [string, Tone]; flip: number; at: number };

const ROOMS: Room[] = [
  { no: "101", from: ["Cleaning", "warn"], to: ["Ready", "ok"], flip: 0.05, at: 900 },
  { no: "102", from: ["Out", "bad"], to: ["Dirty", "bad"], flip: 0.22, at: 1150 },
  { no: "201", from: ["Booked", "warn"], to: ["In", "in"], flip: 0.12, at: 700 },
  { no: "202", from: ["Ready", "ok"], to: ["Ready", "ok"], flip: 0.3, at: 0 },
  { no: "301", from: ["In", "in"], to: ["Out", "bad"], flip: 0.17, at: 1350 },
  { no: "302", from: ["Dirty", "bad"], to: ["Ready", "ok"], flip: 0.36, at: 1550 },
];

function RoomTile({ room, reduce }: { room: Room; reduce: boolean }) {
  const [done, setDone] = useState(reduce || room.at === 0);
  useEffect(() => {
    if (reduce || room.at === 0) return;
    const id = window.setTimeout(() => setDone(true), room.at);
    return () => window.clearTimeout(id);
  }, [reduce, room.at]);
  const [label, tone] = done ? room.to : room.from;

  return (
    <motion.div
      className={`svb-room is-${tone}${done && room.at ? " is-updated" : ""}`}
      style={{ transformOrigin: "50% 0%", transformPerspective: 500 }}
      initial={reduce ? false : { opacity: 0, rotateX: -80 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.6, ease, delay: room.flip }}
    >
      <strong>{room.no}</strong>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          className="mono"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

function HmsBody({ reduce }: BodyProps) {
  return (
    <>
      <div className="svb svb-hms">
        <div className="svb-rooms">
          {ROOMS.map((room) => (
            <RoomTile key={room.no} room={room} reduce={reduce} />
          ))}
        </div>
        <motion.div
          className="svb-hms-arrivals"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <span className="mono">Arrivals 15:00</span>
          <i aria-hidden="true">
            <motion.b
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 0.64 }}
              transition={{ duration: 1.2, ease, delay: 0.6 }}
            />
          </i>
          <span className="mono">4 / 6</span>
        </motion.div>
      </div>
      <Stats
        reduce={reduce}
        delay={0.4}
        stats={[
          { label: "Ready", value: <><Count from={9} to={14} delay={0.6} duration={1.1} reduce={reduce} /> rooms</> },
          { label: "In", value: <><Count from={2} to={6} delay={0.6} duration={1.1} reduce={reduce} /> stays</> },
          { label: "Out", value: "5 due", accent: true },
        ]}
      />
    </>
  );
}

/* ──────────────────────── 04 · Web Development ────────────────────────
 * The site assembles from sections (chrome drops, hero wipes, copy lines
 * grow, CTA pops) and then the page scrolls to reveal the rooms below. */

function WebBody({ reduce }: BodyProps) {
  const revealed = useSequence([1050], reduce) >= 1;
  return (
    <>
      <div className="svb svb-web">
        <div className="svb-browser">
          <motion.div
            className="svb-browser-bar"
            initial={reduce ? false : { y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease }}
          >
            <i />
            <i />
            <i />
            <span className="mono">beyond.app / stay</span>
          </motion.div>
          <div className="svb-browser-view">
            <motion.div
              className="svb-page"
              animate={{ y: revealed ? -64 : 0 }}
              transition={{ duration: reduce ? 0 : 0.85, ease }}
            >
              <motion.div
                className="svb-page-nav"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <b />
                <span />
                <span />
                <span />
              </motion.div>
              <motion.div
                className="svb-page-hero"
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0 round 10px)" }}
                animate={{ clipPath: "inset(0 0% 0 0 round 10px)" }}
                transition={{ duration: 0.7, ease, delay: 0.3 }}
              >
                {[0.78, 0.52].map((w, i) => (
                  <motion.i
                    key={w}
                    style={{ width: `${w * 100}%`, transformOrigin: "0 50%" }}
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease, delay: 0.6 + i * 0.1 }}
                  />
                ))}
                <motion.em
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 22, delay: 0.85 }}
                >
                  Book direct
                </motion.em>
              </motion.div>
              <div className="svb-page-rooms">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
                    transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.2 + i * 0.08 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Stats
        reduce={reduce}
        delay={0.55}
        stats={[
          { label: "LCP", value: <><Count from={3.2} to={1.1} delay={0.7} format={(v) => `${v.toFixed(1)}s`} reduce={reduce} /></> },
          { label: "CWV", value: <Count from={62} to={98} delay={0.7} reduce={reduce} /> },
          { label: "Path", value: "1 step", accent: true },
        ]}
      />
    </>
  );
}

/* ──────────────────────── 05 · Digital Growth ────────────────────────
 * Gold bars rise on a staggered spring, a trend line draws across their
 * tops, and the traffic + direct-booking figures count up together. */

const GROWTH_BARS = [24, 34, 30, 46, 42, 60, 56, 78];

function GrowthBody({ reduce }: BodyProps) {
  const points = GROWTH_BARS.map((h, i) => `${(i + 0.5) * (100 / GROWTH_BARS.length)},${100 - h - 6}`);
  return (
    <>
      <div className="svb svb-growth">
        <div className="svb-growth-head">
          <span className="mono svb-label">Direct bookings</span>
          <motion.span
            className="svb-growth-delta"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.9 }}
          >
            ↑ <Count from={0} to={24} delay={0.9} reduce={reduce} />%
          </motion.span>
        </div>
        <div className="svb-chart">
          {GROWTH_BARS.map((h, i) => (
            <motion.i
              key={i}
              style={{ height: `${h}%`, transformOrigin: "50% 100%" }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.08 + i * 0.06 }}
            />
          ))}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.polyline
              points={points.join(" ")}
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.55 }}
            />
          </svg>
        </div>
      </div>
      <Stats
        reduce={reduce}
        delay={0.35}
        stats={[
          { label: "Enq", value: <Count from={0} to={128} delay={0.45} reduce={reduce} /> },
          { label: "Direct", value: <><Count from={18} to={42} delay={0.45} reduce={reduce} />%</> },
          { label: "Map", value: <><Count from={1} to={3} delay={0.45} duration={0.7} reduce={reduce} />×</>, accent: true },
        ]}
      />
    </>
  );
}

const BODIES: Record<ServiceSlug, (props: BodyProps) => React.ReactElement> = {
  crm: CrmBody,
  oms: OmsBody,
  hms: HmsBody,
  web: WebBody,
  growth: GrowthBody,
};

export function ServicePreviewBody({ slug, reduce }: { slug: ServiceSlug; reduce: boolean }) {
  const Body = BODIES[slug];
  return <Body reduce={reduce} />;
}
