"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { services, type ServiceSlug } from "@/content/services";
import "./services-toolkit.css";

type PreviewSpec = {
  pace: string;
  stack: string;
  kicker: string;
  title: string;
  lanes: [string, string, string, string];
  bars: Array<{ left: string; width: string }>;
  stats: Array<{ label: string; value: string; accent?: boolean }>;
  scan: "down" | "across" | "up" | "wipe" | "pulse";
};

const DAYS = ["M", "T", "W", "T", "F", "M", "T", "W", "T", "F"] as const;

const BAR_GEOMETRY: PreviewSpec["bars"] = [
  { left: "0%", width: "30%" },
  { left: "20%", width: "40%" },
  { left: "50%", width: "30%" },
  { left: "80%", width: "20%" },
];

const previews: Record<ServiceSlug, PreviewSpec> = {
  crm: {
    pace: "4–8 weeks",
    stack: "Profiles · Pipeline · Follow-ups",
    kicker: "Guest workspace · wk 1–4",
    title: "From first hello to a guest you know.",
    lanes: ["Profiles", "Pipeline", "Follow-ups", "Handoff"],
    bars: BAR_GEOMETRY,
    stats: [
      { label: "Scope", value: "12 open" },
      { label: "Won", value: "4 deals" },
      { label: "Reply", value: "2h", accent: true },
    ],
    scan: "down",
  },
  oms: {
    pace: "6–10 weeks",
    stack: "Tables · Tickets · The pass",
    kicker: "Service board · live night",
    title: "Floor and pass, moving as one.",
    lanes: ["Floor", "Tickets", "Pass", "Close"],
    bars: BAR_GEOMETRY,
    stats: [
      { label: "Open", value: "9 tickets" },
      { label: "Pass", value: "3 ready" },
      { label: "Avg", value: "11m", accent: true },
    ],
    scan: "across",
  },
  hms: {
    pace: "8–14 weeks",
    stack: "Rooms · Arrivals · Departure",
    kicker: "Property view · today",
    title: "Ready before anyone is at the door.",
    lanes: ["Arrivals", "Rooms", "Housekeeping", "Desk"],
    bars: BAR_GEOMETRY,
    stats: [
      { label: "Ready", value: "14 rooms" },
      { label: "In", value: "6 stays" },
      { label: "Out", value: "5 due", accent: true },
    ],
    scan: "up",
  },
  web: {
    pace: "6–12 weeks",
    stack: "Design · Build · Enquiry path",
    kicker: "Site build · wk 1–8",
    title: "A front door that earns the next step.",
    lanes: ["Story", "Design", "Build", "Launch"],
    bars: BAR_GEOMETRY,
    stats: [
      { label: "LCP", value: "1.1s" },
      { label: "CWV", value: "98" },
      { label: "Path", value: "1 step", accent: true },
    ],
    scan: "wipe",
  },
  growth: {
    pace: "Ongoing",
    stack: "Brand · Search · Campaigns",
    kicker: "Growth plan · this month",
    title: "Found by the right guest. Booked direct.",
    lanes: ["Brand", "Search", "Content", "Campaigns"],
    bars: BAR_GEOMETRY,
    stats: [
      { label: "Enq", value: "128" },
      { label: "Direct", value: "42%" },
      { label: "Map", value: "3×", accent: true },
    ],
    scan: "pulse",
  },
};

const STACK = [
  "Next.js",
  "TypeScript",
  "Framer Motion",
  "PostgreSQL",
  "WhatsApp Business API",
  "Channel managers",
  "Payment gateways",
  "Google Business Profile",
  "Resend",
  "Vercel",
  "Zod",
  "next-intl",
] as const;

/** Single shared hover motion — ~200ms, no stagger / bounce. */
const snap = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

export function ServicesList() {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const armed = useRef(false);
  const leaveTimer = useRef<number | null>(null);

  const current = services[active];
  const preview = previews[current.slug];
  const indexLabel = String(active + 1).padStart(2, "0");

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const select = useCallback(
    (index: number) => {
      clearLeave();
      const next = ((index % services.length) + services.length) % services.length;
      setLive(true);
      setActive(next);
    },
    [clearLeave],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      clearLeave();
      setLive(true);
      setActive((value) => (value + direction + services.length) % services.length);
    },
    [clearLeave],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!armed.current) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      step(event.key === "ArrowDown" ? 1 : -1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  useEffect(
    () => () => {
      clearLeave();
    },
    [clearLeave],
  );

  return (
    <section
      id="services"
      className={`services-toolkit is-tessvik${reduce ? " is-still" : ""}`}
      aria-label="What we build"
    >
      <div className="svc-glow" aria-hidden="true" />
      <div className="svc-shell">
        <header className="svc-top">
          <p className="mono svc-kicker">02 / What we build</p>
          <p className="mono svc-count">5 services · 3 ways to engage</p>
          <p className="mono svc-hint">Hover or tab through ↑ ↓ to preview</p>
        </header>

        <div
          className={`svc-stage${live ? " has-active" : " is-idle"}`}
          role="listbox"
          aria-label="Beyond OS services"
          tabIndex={0}
          onMouseEnter={() => {
            armed.current = true;
            clearLeave();
          }}
          onMouseLeave={() => {
            armed.current = false;
            clearLeave();
            leaveTimer.current = window.setTimeout(() => setLive(false), 60);
          }}
          onFocus={() => {
            armed.current = true;
            clearLeave();
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              armed.current = false;
              setLive(false);
            }
          }}
        >
          <LayoutGroup id="svc-pill-group">
            <div className="svc-list">
              {services.map((service, index) => {
                const selected = live && index === active;
                const item = previews[service.slug];
                return (
                  <div
                    key={service.slug}
                    className={`svc-row${selected ? " is-live" : live ? " is-dim" : ""}`}
                  >
                    <Link
                      id={`svc-opt-${service.slug}`}
                      href={`/services/${service.slug}`}
                      role="option"
                      aria-selected={selected}
                      tabIndex={selected || (!live && index === 0) ? 0 : -1}
                      className={`svc-line${selected ? " is-live" : ""}`}
                      onPointerEnter={() => select(index)}
                      onFocus={() => select(index)}
                      onClick={(event) => {
                        select(index);
                        const target = event.target as HTMLElement | null;
                        if (!target?.closest("[data-svc-go]")) {
                          event.preventDefault();
                        }
                      }}
                    >
                      {selected ? (
                        <motion.span
                          layoutId="svc-pill"
                          className="svc-pill"
                          aria-hidden="true"
                          transition={reduce ? { duration: 0 } : snap}
                        />
                      ) : null}

                      <span className="svc-lead">
                        <span className="svc-num">({service.number})</span>
                        <span
                          className="svc-meta"
                          data-visible={selected ? "true" : "false"}
                          aria-hidden={!selected}
                        >
                          <span className="svc-pace">{item.pace}</span>
                          <span className="svc-stack">{item.stack}</span>
                        </span>
                      </span>

                      <span className="svc-title">{service.name}</span>
                      <span className="svc-go" data-svc-go aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </LayoutGroup>

          <aside
            className="svc-preview-rail"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${current.name} preview`}
            aria-hidden={!live}
          >
            <AnimatePresence initial={false}>
              {live ? (
                <PreviewPanel
                  key={current.slug}
                  slug={current.slug}
                  name={current.name}
                  preview={preview}
                  reduce={reduce}
                />
              ) : null}
            </AnimatePresence>
          </aside>

          <div className="svc-side-nav" aria-label="Browse services">
            <button
              type="button"
              className="svc-side-arrow"
              data-dir="up"
              aria-label="Previous service"
              onClick={() => step(-1)}
              onPointerEnter={() => {
                armed.current = true;
                clearLeave();
                setLive(true);
              }}
            >
              <span aria-hidden="true">↑</span>
            </button>
            <span className="mono svc-side-index" aria-hidden="true">
              {live ? indexLabel : "··"}
              <i>/05</i>
            </span>
            <button
              type="button"
              className="svc-side-arrow"
              data-dir="down"
              aria-label="Next service"
              onClick={() => step(1)}
              onPointerEnter={() => {
                armed.current = true;
                clearLeave();
                setLive(true);
              }}
            >
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <p className="mono svc-engage-note">
          Not ready for all five services? Start with one.
        </p>

        <div
          className={`svc-marquee${reduce ? " is-still" : ""}`}
          aria-label="Technology stack"
        >
          <div className="svc-marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="mono">
                {STACK.map((item, index) => (
                  <span key={`${copy}-${item}`}>
                    {item}
                    {index < STACK.length - 1 ? <i aria-hidden="true"> · </i> : null}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewPanel({
  slug,
  name,
  preview,
  reduce,
}: {
  slug: ServiceSlug;
  name: string;
  preview: PreviewSpec;
  reduce: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 240, damping: 24, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 240, damping: 24, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const lift = useSpring(0, { stiffness: 280, damping: 24, mass: 0.45 });
  const scale = useSpring(1, { stiffness: 280, damping: 24, mass: 0.45 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-2deg) translateZ(${lift}px) scale(${scale})`;

  function onMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onEnter() {
    if (reduce) return;
    lift.set(14);
    scale.set(1.025);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
    lift.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      className={`svc-preview is-${slug}`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduce ? { duration: 0 } : snap}
    >
      <motion.div
        ref={cardRef}
        className={`svc-preview-card is-${slug}`}
        style={reduce ? undefined : { transform }}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <LightBand reduce={reduce} />
        <ScanBand variant={preview.scan} reduce={reduce} />

        <div className="svc-preview-head">
          <span className="mono svc-preview-kicker">{preview.kicker}</span>
          <span className="svc-preview-open" aria-hidden="true">
            →
          </span>
        </div>

        <h3>{preview.title}</h3>

        <div className="svc-board">
          <div className="svc-days" aria-hidden="true">
            {DAYS.map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="svc-timeline">
            {preview.lanes.map((lane, index) => {
              const bar = preview.bars[index];
              const accent = index === preview.lanes.length - 1;
              return (
                <div
                  key={lane}
                  className={`svc-timeline-row${accent ? " is-accent" : ""}`}
                >
                  <span>{lane}</span>
                  <div className="svc-track">
                    <i style={{ left: bar.left, width: bar.width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="svc-preview-stats">
          {preview.stats.map((stat) => (
            <div key={stat.label}>
              <span className="mono">{stat.label}</span>
              <strong className={stat.accent ? "is-accent" : undefined}>
                {stat.value}
              </strong>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="mono svc-preview-foot">
        Live preview · {name} · 5 services · 3 ways to engage
      </p>
    </motion.div>
  );
}

function LightBand({ reduce }: { reduce: boolean }) {
  if (reduce) {
    return <span className="svc-light-band" aria-hidden="true" />;
  }

  return (
    <motion.span
      className="svc-light-band"
      aria-hidden="true"
      initial={{ x: "-35%", opacity: 0 }}
      animate={{ x: ["-35%", "165%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.35, repeat: Infinity, ease: "linear", repeatDelay: 0.1 }}
    />
  );
}

function ScanBand({
  variant,
  reduce,
}: {
  variant: PreviewSpec["scan"];
  reduce: boolean;
}) {
  if (reduce) {
    return <span className={`svc-scan svc-scan-${variant}`} aria-hidden="true" />;
  }

  const common = {
    className: `svc-scan svc-scan-${variant}`,
    "aria-hidden": true as const,
  };

  if (variant === "down") {
    return (
      <motion.span
        {...common}
        initial={{ top: "-18%", opacity: 0 }}
        animate={{ top: ["-18%", "108%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "up") {
    return (
      <motion.span
        {...common}
        initial={{ top: "108%", opacity: 0 }}
        animate={{ top: ["108%", "-18%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "across") {
    return (
      <motion.span
        {...common}
        initial={{ left: "-20%", opacity: 0 }}
        animate={{ left: ["-20%", "108%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.45, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "wipe") {
    return (
      <motion.span
        {...common}
        initial={{ opacity: 0, x: "-30%" }}
        animate={{ opacity: [0, 0.95, 0.95, 0], x: ["-30%", "35%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return (
    <motion.span
      {...common}
      initial={{ opacity: 0.18, scale: 0.88 }}
      animate={{ opacity: [0.18, 0.6, 0.18], scale: [0.88, 1.08, 0.88] }}
      transition={{ duration: 1.55, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
