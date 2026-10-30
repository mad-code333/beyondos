"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { services, type ServiceSlug } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Preview = {
  duration: string;
  tags: string;
  kicker: string;
  title: string;
  caption: string;
  accent: string;
  kind: "pipeline" | "floor" | "property" | "web" | "growth";
  stats: { label: string; value: string; hot?: boolean }[];
};

const ACCENT = "#f0b429";

const previews: Record<ServiceSlug, Preview> = {
  crm: {
    duration: "Guest pipeline",
    tags: "Profiles · Enquiries · Follow-ups",
    kicker: "Relationship desk · day one",
    title: "From a first hello to a confirmed stay.",
    caption: "Live preview · CRM",
    accent: ACCENT,
    kind: "pipeline",
    stats: [
      { label: "Open", value: "03" },
      { label: "Pipeline", value: "₾7,080" },
      { label: "Close rate", value: "62%", hot: true },
    ],
  },
  oms: {
    duration: "Service floor",
    tags: "Tables · Tickets · Pass",
    kicker: "Floor & pass · live service",
    title: "Tables, tickets and the pass in one calm flow.",
    caption: "Live preview · Restaurant OMS",
    accent: "#7ec8a3",
    kind: "floor",
    stats: [
      { label: "Covers", value: "42" },
      { label: "Open", value: "06" },
      { label: "Pace", value: "Calm", hot: true },
    ],
  },
  hms: {
    duration: "Property desk",
    tags: "Rooms · Arrivals · Stay",
    kicker: "Stay board · tonight",
    title: "Rooms, arrivals and readiness on one board.",
    caption: "Live preview · Hotel HMS",
    accent: "#8fb4e8",
    kind: "property",
    stats: [
      { label: "Arrivals", value: "11" },
      { label: "Ready", value: "08" },
      { label: "Occ.", value: "84%", hot: true },
    ],
  },
  web: {
    duration: "8–14 weeks",
    tags: "Brand · Journeys · Booking",
    kicker: "beyond.app / book · 90 days",
    title: "A site with a sense of place, and a next step.",
    caption: "Live preview · Web Development",
    accent: ACCENT,
    kind: "web",
    stats: [
      { label: "Direct", value: "+41%", hot: true },
      { label: "Enquiries", value: "128" },
      { label: "TTI", value: "1.1s" },
    ],
  },
  growth: {
    duration: "Ongoing",
    tags: "Brand · Search · Campaigns",
    kicker: "Campaign desk · this week",
    title: "Brand, search and campaigns for the right guests.",
    caption: "Live preview · Digital Growth",
    accent: ACCENT,
    kind: "growth",
    stats: [
      { label: "Reach", value: "86%" },
      { label: "Direct", value: "+41%", hot: true },
      { label: "Brand", value: "Live" },
    ],
  },
};

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring" as const, stiffness: 420, damping: 36 };

export function ServicesIndex() {
  const [active, setActive] = useState(0);
  const [cardTop, setCardTop] = useState(8);
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const current = services[active];
  const preview = previews[current.slug];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => (value + 1) % services.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => (value - 1 + services.length) % services.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useLayoutEffect(() => {
    function measure() {
      const item = itemRefs.current[active];
      if (!item) return;
      setCardTop(item.offsetTop + Math.max(0, (item.offsetHeight - 320) / 2));
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <main>
      <section className="border-b border-line bg-[#080808]">
        <Container className="pb-12 pt-14 md:pb-16 md:pt-20">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            — The Beyond toolkit
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_minmax(240px,380px)] lg:items-end lg:gap-16">
            <h1 className="text-[64px] font-medium leading-[0.95] tracking-[-0.05em] text-[#f4f4f1] md:text-[96px] lg:text-[112px]">
              Services
            </h1>
            <div className="max-w-sm lg:justify-self-end lg:pb-3">
              <p className="text-[15px] leading-6 text-[#9a9a95]">
                Software to run your operation. Digital experiences to represent it. Growth to take
                it further. Pick a starting point.
              </p>
              <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-[#6f6f6b]">
                {String(services.length).padStart(2, "0")} services — one connected system
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#f0efe9] text-[#111]">
        <Container className="relative max-w-[1180px] py-16 pb-36 md:py-20 md:pb-44">
          <div className="mb-10 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6a6a66] md:mb-14">
            <p>({String(services.length).padStart(2, "0")}) — What we ship</p>
            <p className="hidden sm:block">Hover or tab through ↑ ↓ to move</p>
          </div>

          <div className="relative mx-auto max-w-[860px] lg:mx-0 lg:max-w-none lg:pr-[320px]">
            <ul ref={listRef} className="relative flex flex-col">
              {services.map((service, index) => {
                const selected = index === active;
                const itemPreview = previews[service.slug];

                return (
                  <li
                    key={service.slug}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    className="relative"
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={cn(
                        "group relative z-10 grid min-h-[84px] grid-cols-[auto_1fr_auto] items-center gap-x-3 px-4 py-5 sm:min-h-[100px] sm:gap-x-5 sm:px-6 md:min-h-[108px] md:px-7",
                        selected ? "text-white" : "text-[#111]/50 hover:text-[#111]",
                      )}
                      aria-current={selected ? "true" : undefined}
                    >
                      {selected ? (
                        <motion.span
                          layoutId={reduce ? undefined : "services-capsule"}
                          className="absolute inset-x-0 inset-y-1.5 -z-10 rounded-full bg-[#111] shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:inset-y-2"
                          transition={reduce ? { duration: 0 } : spring}
                        />
                      ) : null}

                      <span className="flex min-w-[3.25rem] flex-col justify-center sm:min-w-[4.5rem]">
                        <span
                          className={cn(
                            "font-mono text-[12px] tracking-[0.08em] transition-colors duration-300 sm:text-[13px]",
                            selected ? "text-[#f0b429]" : "text-[#9a9a95]",
                          )}
                        >
                          ({service.number})
                        </span>
                        <AnimatePresence initial={false}>
                          {selected ? (
                            <motion.span
                              key={`${service.slug}-duration`}
                              initial={reduce ? false : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={reduce ? undefined : { opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease }}
                              className="mt-1 overflow-hidden font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-white/55 sm:text-[10px]"
                            >
                              {itemPreview.duration}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>

                      <span className="min-w-0">
                        <AnimatePresence initial={false}>
                          {selected ? (
                            <motion.span
                              key={`${service.slug}-tags`}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={reduce ? undefined : { opacity: 0, y: -6 }}
                              transition={{ duration: 0.22, ease }}
                              className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 sm:text-[10px]"
                            >
                              {itemPreview.tags}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                        <span
                          className={cn(
                            "block text-[30px] font-medium leading-[0.95] tracking-[-0.045em] transition-[color,transform] duration-300 sm:text-[42px] md:text-[52px]",
                            selected && "translate-x-0.5 text-white",
                          )}
                        >
                          {service.name}
                        </span>
                      </span>

                      <motion.span
                        aria-hidden="true"
                        animate={
                          selected
                            ? { x: 3, y: -3, opacity: 1 }
                            : { x: 0, y: 0, opacity: 0.45 }
                        }
                        transition={{ duration: 0.25, ease }}
                        className="text-[18px] sm:text-[20px]"
                      >
                        ↗
                      </motion.span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="pointer-events-none absolute right-0 top-0 hidden h-full w-[300px] lg:block"
              aria-hidden="true"
            >
              <motion.div
                className="absolute right-0 w-[300px]"
                animate={{ top: Math.max(0, cardTop) }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.slug}
                    initial={reduce ? false : { opacity: 0, y: 28, rotateX: 8, rotateY: -10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -18, rotateX: -4, scale: 0.97 }}
                    transition={{ duration: 0.4, ease }}
                    style={{ perspective: 1200 }}
                  >
                    <TiltCard reduce={!!reduce}>
                      <PreviewCard preview={preview} slug={current.slug} />
                    </TiltCard>
                    <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a86]">
                      {preview.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-[860px] lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease }}
              >
                <PreviewCard preview={preview} slug={current.slug} />
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a86]">
                  {preview.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-[640px] flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-[#f4f4f1] shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:flex-row sm:items-center sm:gap-5 sm:rounded-full sm:px-5 sm:py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f4f4f1] text-[13px] font-semibold text-[#111]">
            b
          </span>
          <p className="flex-1 text-[13px] leading-5 text-[#c8c8c3]">
            Every engagement starts with a conversation about how your operation actually runs.
          </p>
          <Button href="/#contact" className="shrink-0 !px-4 !py-2.5 text-[12px]">
            Let&apos;s talk
          </Button>
        </div>
      </div>
    </main>
  );
}

function TiltCard({ children, reduce }: { children: ReactNode; reduce: boolean }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 220, damping: 24 });
  const glare = useMotionTemplate`radial-gradient(420px circle at ${useTransform(x, (v) => `${v * 100}%`)} ${useTransform(y, (v) => `${v * 100}%`)}, rgba(255,255,255,0.14), transparent 42%)`;

  return (
    <motion.div
      className="relative"
      style={
        reduce
          ? { rotate: 2.5 }
          : {
              rotateX,
              rotateY,
              rotate: 2.5,
              transformStyle: "preserve-3d",
            }
      }
      onMouseMove={
        reduce
          ? undefined
          : (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              x.set((event.clientX - rect.left) / rect.width);
              y.set((event.clientY - rect.top) / rect.height);
            }
      }
      onMouseLeave={
        reduce
          ? undefined
          : () => {
              x.set(0.5);
              y.set(0.5);
            }
      }
    >
      {children}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px] mix-blend-soft-light"
          style={{ background: glare }}
        />
      ) : null}
    </motion.div>
  );
}

function PreviewCard({ preview, slug }: { preview: Preview; slug: ServiceSlug }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] p-4 text-[#f4f4f1] shadow-[0_36px_90px_rgba(0,0,0,0.32)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]">{preview.kicker}</p>
      <p className="mt-3 text-[17px] leading-6 tracking-[-0.03em] text-[#f4f4f1]">{preview.title}</p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] p-3">
        {preview.kind === "pipeline" ? <PipelineVisual accent={preview.accent} /> : null}
        {preview.kind === "floor" ? <FloorVisual accent={preview.accent} /> : null}
        {preview.kind === "property" ? <PropertyVisual accent={preview.accent} /> : null}
        {preview.kind === "web" ? <WebVisual accent={preview.accent} /> : null}
        {preview.kind === "growth" ? <GrowthVisual accent={preview.accent} /> : null}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {preview.stats.map((stat, index) => (
          <motion.div
            key={`${slug}-${stat.label}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.05, duration: 0.28, ease }}
            className="rounded-xl border border-white/10 bg-black/30 px-2 py-2"
          >
            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f6f6b]">
              {stat.label}
            </div>
            <div
              className="mt-1 text-[12px]"
              style={{ color: stat.hot ? preview.accent : "#f4f4f1" }}
            >
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PipelineVisual({ accent }: { accent: string }) {
  const rows = [
    { label: "New", width: "38%" },
    { label: "Talking", width: "58%" },
    { label: "Proposal", width: "46%" },
    { label: "Confirmed", width: "28%", hot: true },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-[#6f6f6b]">
        {["M", "T", "W", "T", "F", "M", "T", "W", "T", "F"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={row.label} className="grid grid-cols-[64px_1fr] items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7a7a76]">
              {row.label}
            </span>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: row.hot ? accent : "rgba(255,255,255,0.18)" }}
                initial={{ width: 0 }}
                animate={{ width: row.width }}
                transition={{ delay: 0.12 + index * 0.07, duration: 0.55, ease }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloorVisual({ accent }: { accent: string }) {
  const tables = [
    { id: "04", state: "Seated" },
    { id: "07", state: "Fire" },
    { id: "11", state: "Clear" },
    { id: "12", state: "Seated" },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6b]">
        <span>Floor map</span>
        <span style={{ color: accent }}>● service</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 + index * 0.06, duration: 0.28, ease }}
            className="rounded-xl border border-white/10 bg-[#111] px-2.5 py-2"
          >
            <div className="text-[11px] text-[#f4f4f1]">Table {table.id}</div>
            <div
              className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em]"
              style={{ color: table.state === "Fire" ? accent : "#8a8a86" }}
            >
              {table.state}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {["Starter · 2", "Main · 4", "Wine pairing"].map((row, index) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 + index * 0.05, duration: 0.25, ease }}
            className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5 text-[11px] text-[#c8c8c3]"
          >
            {row}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PropertyVisual({ accent }: { accent: string }) {
  const rooms = [
    { id: "201", label: "Arrival 15:00", ready: true },
    { id: "214", label: "Late checkout", ready: false },
    { id: "308", label: "Ready", ready: true },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6b]">
        <span>Tonight</span>
        <span style={{ color: accent }}>8 ready</span>
      </div>
      <div className="space-y-2">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.07, duration: 0.28, ease }}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111] px-3 py-2.5"
          >
            <div>
              <div className="text-[12px] text-[#f4f4f1]">Room {room.id}</div>
              <div className="mt-0.5 text-[10px] text-[#8a8a86]">{room.label}</div>
            </div>
            <span
              className="rounded-full px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em]"
              style={{
                color: room.ready ? accent : "#8a8a86",
                background: room.ready ? `${accent}22` : "rgba(255,255,255,0.04)",
              }}
            >
              {room.ready ? "Ready" : "Busy"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WebVisual({ accent }: { accent: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f6f6b]">
          book.direct / stay
        </span>
      </div>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="text-[22px] font-medium tracking-[-0.04em]" style={{ color: accent }}>
            4.8%
          </div>
          <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f6f6b]">
            book conversion · 90 days
          </div>
        </div>
        <div className="font-mono text-[9px]" style={{ color: accent }}>
          ↑ from 3.1%
        </div>
      </div>
      <svg viewBox="0 0 240 72" className="h-[72px] w-full" aria-hidden="true">
        <motion.path
          d="M0 58 C 24 56, 36 44, 54 40 S 90 52, 110 36 S 150 18, 174 24 S 210 40, 240 14"
          fill="none"
          stroke={accent}
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, ease }}
        />
        <motion.path
          d="M0 58 C 24 56, 36 44, 54 40 S 90 52, 110 36 S 150 18, 174 24 S 210 40, 240 14 L 240 72 L 0 72 Z"
          fill={accent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.14 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
      </svg>
      <div className="mt-2 space-y-1">
        {[
          ["Rooms page", "+18% path"],
          ["Direct book", "Shipped"],
        ].map(([left, right], index) => (
          <motion.div
            key={left}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.06, duration: 0.25, ease }}
            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2 py-1.5 text-[10px] text-[#c8c8c3]"
          >
            <span>{left}</span>
            <span className="font-mono text-[9px]" style={{ color: accent }}>
              {right}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GrowthVisual({ accent }: { accent: string }) {
  const steps = [
    { label: "Brand", width: "100%" },
    { label: "Search", width: "78%" },
    { label: "Campaign", width: "54%" },
    { label: "Direct", width: "36%", hot: true },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6b]">
        <span>Deploy #218 · growth</span>
        <span style={{ color: accent }}>production</span>
      </div>
      <div className="space-y-2.5">
        {steps.map((step, index) => (
          <div key={step.label}>
            <div className="mb-1 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-[#7a7a76]">
              <span>{step.label}</span>
              <span>{step.width}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: step.hot ? accent : "rgba(255,255,255,0.2)" }}
                initial={{ width: 0 }}
                animate={{ width: step.width }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.55, ease }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
