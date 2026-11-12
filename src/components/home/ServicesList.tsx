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
import { ServicePreviewBody } from "./ServicePreviewBodies";
import "./services-toolkit.css";

type PreviewSpec = {
  pace: string;
  stack: string;
  kicker: string;
  title: string;
};

const previews: Record<ServiceSlug, PreviewSpec> = {
  crm: {
    pace: "4–8 weeks",
    stack: "Profiles · Pipeline · Follow-ups",
    kicker: "Guest workspace · wk 1–4",
    title: "From first hello to a guest you know.",
  },
  oms: {
    pace: "6–10 weeks",
    stack: "Tables · Tickets · The pass",
    kicker: "Service board · live night",
    title: "Floor and pass, moving as one.",
  },
  hms: {
    pace: "8–14 weeks",
    stack: "Rooms · Arrivals · Departure",
    kicker: "Property view · today",
    title: "Ready before anyone is at the door.",
  },
  web: {
    pace: "6–12 weeks",
    stack: "Design · Build · Enquiry path",
    kicker: "Site build · wk 1–8",
    title: "A front door that earns the next step.",
  },
  growth: {
    pace: "Ongoing",
    stack: "Brand · Search · Campaigns",
    kicker: "Growth plan · this month",
    title: "Found by the right guest. Booked direct.",
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
      // Right bound stays small so the card never drifts over the ↑ ↓ controls.
      followX.set(clamp((localX - homeX) * 0.3, -20, 6));
      // Small vertical drift only — the card stays parked beside the list.
      followY.set(clamp((localY - homeY) * 0.25, -36, 36));
      tiltNX.set(nx - 0.5);
      tiltNY.set(ny - 0.5);
    },
    [followX, followY, live, reduce, resetFollow, tiltNX, tiltNY],
  );

  useLayoutEffect(() => {
    if (!live) {
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
          data-active={live ? active : undefined}
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
  // Resting pose is a slight lean (matches the reference); pointer adds to it.
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [7, -3]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-14, 2]);

  return (
    <motion.div
      className={`svc-preview is-${slug}`}
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={
        reduce
          ? { rotate: -2 }
          : {
              x,
              y,
              rotate: -2,
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
    >
      <div className={`svc-preview-card is-${slug}`}>
        {/* Keyed remount (no exit queue) so rapid switching always lands on the active service. */}
        <motion.div
          key={slug}
          className="svc-preview-swap"
          initial={reduce ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="svc-preview-head">
            <motion.span
              className="mono svc-preview-kicker"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {preview.kicker}
            </motion.span>
            <span className="svc-preview-open" aria-hidden="true">
              →
            </span>
          </div>

          <motion.h3
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
          >
            {preview.title}
          </motion.h3>

          <ServicePreviewBody slug={slug} reduce={reduce} />
        </motion.div>
        {/* Caption lives inside the card so the pill can never cut through it. */}
        <p className="mono svc-preview-foot">Live preview · {name}</p>
      </div>
    </motion.div>
  );
}
