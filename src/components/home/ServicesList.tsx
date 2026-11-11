"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
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

/** Soft spring for the single moving highlight */
const pillSpring = { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.7 };
/** Content morph — short, no bounce */
const morph = { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };
const metaEase = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };
const followSpring = { stiffness: 140, damping: 22, mass: 0.55 };
const tiltSpring = { stiffness: 180, damping: 24, mass: 0.4 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ServicesList() {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const [pill, setPill] = useState({ y: 0, h: 0, ready: false });
  const armed = useRef(false);
  const leaveTimer = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const current = services[active]!;
  const preview = previews[current.slug];
  const indexLabel = String(active + 1).padStart(2, "0");

  const followX = useMotionValue(0);
  const followY = useMotionValue(0);
  const springX = useSpring(followX, reduce ? { stiffness: 1000, damping: 100 } : followSpring);
  const springY = useSpring(followY, reduce ? { stiffness: 1000, damping: 100 } : followSpring);
  const tiltNX = useMotionValue(0);
  const tiltNY = useMotionValue(0);
  const springTiltX = useSpring(tiltNX, reduce ? { stiffness: 1000, damping: 100 } : tiltSpring);
  const springTiltY = useSpring(tiltNY, reduce ? { stiffness: 1000, damping: 100 } : tiltSpring);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const resetFollow = useCallback(() => {
    followX.set(0);
    followY.set(0);
    tiltNX.set(0);
    tiltNY.set(0);
  }, [followX, followY, tiltNX, tiltNY]);

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

  const measurePill = useCallback(() => {
    const list = listRef.current;
    const row = rowRefs.current[active];
    if (!list || !row) return;
    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    setPill({
      y: rowRect.top - listRect.top + 6,
      h: Math.max(0, rowRect.height - 12),
      ready: true,
    });
  }, [active]);

  const trackPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduce || !live) return;
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
        resetFollow();
        return;
      }
      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const nx = clamp(localX / rect.width, 0, 1);
      const ny = clamp(localY / rect.height, 0, 1);

      // Home sits in the right pocket; pointer pulls the card freely without covering titles.
      const homeX = rect.width * 0.82;
      const homeY = rect.height * 0.5;
      followX.set(clamp((localX - homeX) * 0.55, -56, 48));
      followY.set(clamp(localY - homeY, -150, 150));
      tiltNX.set(nx - 0.5);
      tiltNY.set(ny - 0.5);
    },
    [followX, followY, live, reduce, resetFollow, tiltNX, tiltNY],
  );

  useLayoutEffect(() => {
    if (!live) {
      setPill((prev) => ({ ...prev, ready: false }));
      resetFollow();
      return;
    }
    measurePill();
  }, [live, active, measurePill, resetFollow]);

  useEffect(() => {
    if (!live) return;
    const onResize = () => measurePill();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [live, measurePill]);

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
          ref={stageRef}
          className={`svc-stage${live ? " has-active" : " is-idle"}`}
          role="listbox"
          aria-label="Beyond OS services"
          tabIndex={0}
          onPointerMove={trackPointer}
          onMouseEnter={() => {
            armed.current = true;
            clearLeave();
          }}
          onMouseLeave={() => {
            armed.current = false;
            clearLeave();
            leaveTimer.current = window.setTimeout(() => {
              setLive(false);
              resetFollow();
            }, 80);
          }}
          onFocus={() => {
            armed.current = true;
            clearLeave();
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              armed.current = false;
              setLive(false);
              resetFollow();
            }
          }}
        >
          <div className="svc-list" ref={listRef}>
            <AnimatePresence>
              {live && pill.ready ? (
                <motion.span
                  key="svc-pill"
                  className="svc-pill svc-pill-rail"
                  aria-hidden="true"
                  initial={reduce ? false : { opacity: 0, y: pill.y + 8, height: pill.h }}
                  animate={{ opacity: 1, y: pill.y, height: pill.h }}
                  exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                  transition={reduce ? { duration: 0 } : pillSpring}
                />
              ) : null}
            </AnimatePresence>

            {services.map((service, index) => {
              const selected = live && index === active;
              const item = previews[service.slug];
              return (
                <div
                  key={service.slug}
                  ref={(node) => {
                    rowRefs.current[index] = node;
                  }}
                  className={`svc-row${selected ? " is-live" : live ? " is-dim" : ""}`}
                >
                  <Link
                    id={`svc-opt-${service.slug}`}
                    href={`/services/${service.slug}`}
                    role="option"
                    aria-selected={selected}
                    tabIndex={selected || (!live && index === 0) ? 0 : -1}
                    className={`svc-line${selected ? " is-live" : ""}`}
                    onPointerEnter={(event) => {
                      select(index);
                      trackPointer(event);
                    }}
                    onPointerMove={trackPointer}
                    onFocus={() => select(index)}
                    onClick={(event) => {
                      select(index);
                      const target = event.target as HTMLElement | null;
                      if (!target?.closest("[data-svc-go]")) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <span className="svc-lead">
                      <span className="svc-num">({service.number})</span>
                      <AnimatePresence initial={false} mode="popLayout">
                        {selected ? (
                          <motion.span
                            key={`${service.slug}-meta`}
                            className="svc-meta is-open"
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -4 }}
                            transition={reduce ? { duration: 0 } : metaEase}
                          >
                            <span className="svc-pace">{item.pace}</span>
                            <span className="svc-stack">{item.stack}</span>
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </span>

                    <motion.span
                      className="svc-title"
                      animate={
                        reduce
                          ? undefined
                          : {
                              color: selected ? "#111111" : live ? "#5e5e58" : "#b4b4aa",
                              opacity: selected ? 1 : live ? 0.55 : 1,
                            }
                      }
                      transition={reduce ? { duration: 0 } : morph}
                    >
                      {service.name}
                    </motion.span>

                    <motion.span
                      className="svc-go"
                      data-svc-go
                      aria-hidden="true"
                      initial={false}
                      animate={
                        reduce
                          ? undefined
                          : {
                              opacity: selected ? 1 : 0,
                              scale: selected ? 1 : 0.86,
                            }
                      }
                      transition={
                        reduce ? { duration: 0 } : { ...pillSpring, delay: selected ? 0.02 : 0 }
                      }
                      style={{ pointerEvents: selected ? "auto" : "none" }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              );
            })}
          </div>

          <aside
            className="svc-preview-rail"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${current.name} preview`}
            aria-hidden={!live}
          >
            <AnimatePresence>
              {live ? (
                <PreviewPanel
                  key="svc-preview-shell"
                  slug={current.slug}
                  name={current.name}
                  preview={preview}
                  reduce={reduce}
                  x={springX}
                  y={springY}
                  tiltX={springTiltX}
                  tiltY={springTiltY}
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

      </div>
    </section>
  );
}

function PreviewPanel({
  slug,
  name,
  preview,
  reduce,
  x,
  y,
  tiltX,
  tiltY,
}: {
  slug: ServiceSlug;
  name: string;
  preview: PreviewSpec;
  reduce: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [5.5, -5.5]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-7, 7]);

  return (
    <motion.div
      className={`svc-preview is-${slug}`}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.985 }}
      transition={reduce ? { duration: 0 } : morph}
      style={
        reduce
          ? undefined
          : {
              x,
              y,
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
    >
      <div className={`svc-preview-card is-${slug}`}>
        <LightBand key={`light-${slug}`} reduce={reduce} />
        <ScanBand key={`scan-${slug}-${preview.scan}`} variant={preview.scan} reduce={reduce} />

        <div className="svc-preview-head">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${slug}-kicker`}
              className="mono svc-preview-kicker"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { ...morph, duration: 0.28 }}
            >
              {preview.kicker}
            </motion.span>
          </AnimatePresence>
          <span className="svc-preview-open" aria-hidden="true">
            →
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.h3
            key={`${slug}-title`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={reduce ? { duration: 0 } : { ...morph, duration: 0.36, delay: 0.03 }}
          >
            {preview.title}
          </motion.h3>
        </AnimatePresence>

        <div className="svc-board">
          <div className="svc-days" aria-hidden="true">
            {DAYS.map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="svc-timeline">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${slug}-lanes`}
                className="svc-timeline-swap"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={reduce ? { duration: 0 } : { ...morph, delay: 0.06 }}
              >
                {preview.lanes.map((lane, index) => {
                  const bar = preview.bars[index]!;
                  const accent = index === preview.lanes.length - 1;
                  return (
                    <motion.div
                      key={lane}
                      className={`svc-timeline-row${accent ? " is-accent" : ""}`}
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { ...morph, delay: 0.08 + index * 0.045 }
                      }
                    >
                      <span>{lane}</span>
                      <div className="svc-track">
                        <motion.i
                          initial={reduce ? false : { scaleX: 0.35, opacity: 0.4 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { ...morph, delay: 0.12 + index * 0.05 }
                          }
                          style={{ left: bar.left, width: bar.width }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="svc-preview-stats">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${slug}-stats`}
              className="svc-preview-stats-swap"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { ...morph, delay: 0.1 }}
            >
              {preview.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduce ? { duration: 0 } : { ...morph, delay: 0.14 + index * 0.04 }
                  }
                >
                  <span className="mono">{stat.label}</span>
                  <strong className={stat.accent ? "is-accent" : undefined}>
                    {stat.value}
                  </strong>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
      initial={{ x: "-40%", opacity: 0 }}
      animate={{ x: "170%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
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
        animate={{ top: "108%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      />
    );
  }

  if (variant === "up") {
    return (
      <motion.span
        {...common}
        initial={{ top: "108%", opacity: 0 }}
        animate={{ top: "-18%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      />
    );
  }

  if (variant === "across") {
    return (
      <motion.span
        {...common}
        initial={{ left: "-20%", opacity: 0 }}
        animate={{ left: "108%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      />
    );
  }

  if (variant === "wipe") {
    return (
      <motion.span
        {...common}
        initial={{ opacity: 0, x: "-30%" }}
        animate={{ opacity: [0, 0.95, 0.95, 0], x: "40%" }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      />
    );
  }

  return (
    <motion.span
      {...common}
      initial={{ opacity: 0.1, scale: 0.86 }}
      animate={{ opacity: [0.1, 0.55, 0], scale: [0.86, 1.08, 1.12] }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    />
  );
}
