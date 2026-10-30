"use client";

import { useEffect, useState, type PointerEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { services, type Service, type ServiceSlug } from "@/content/services";

const order: ServiceSlug[] = ["crm", "oms", "hms", "web", "growth"];

const slots = [
  { top: "6%", left: "22%" },
  { top: "22%", left: "8%" },
  { top: "44%", left: "0%" },
  { top: "66%", left: "8%" },
  { top: "84%", left: "22%" },
];

type Story = {
  lines: [string, string];
  lead: string;
};

const stories: Record<ServiceSlug, Story> = {
  crm: {
    lines: ["Every relationship.", "Made personal."],
    lead: "Know the guest behind every enquiry. Conversations, preferences and follow-ups, held in one workspace.",
  },
  oms: {
    lines: ["Every order.", "In perfect rhythm."],
    lead: "From the floor to the kitchen, one shared view. Clear orders, quieter handoffs, a calmer service.",
  },
  hms: {
    lines: ["Every stay.", "Considered, together."],
    lead: "Reservations, room readiness and guest context in one property view, from enquiry to arrival.",
  },
  web: {
    lines: ["A sense", "of place."],
    lead: "Websites with the character of the property, and a clear path from curiosity to a booking.",
  },
  growth: {
    lines: ["Your next chapter.", "Seen by the right people."],
    lead: "Brand, search and campaigns shaped for hospitality, so the right guests can find their way to you.",
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const slug = order[index];
  const active = services.find((service) => service.slug === slug)!;
  const story = stories[slug];
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const shiftX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.6 });
  const shiftY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const apply = () => setFinePointer(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((value) => (value + 1) % order.length);
    }, 6400);
    return () => window.clearInterval(timer);
  }, [paused, reduce]);

  function go(direction: 1 | -1) {
    setPaused(true);
    setIndex((value) => (value + direction + order.length) % order.length);
  }

  function select(next: ServiceSlug) {
    setPaused(true);
    setIndex(order.indexOf(next));
  }

  function onStageMove(event: PointerEvent<HTMLDivElement>) {
    if (!finePointer || reduce) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(x * 18);
    pointerY.set(y * 12);
  }

  function onStageLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      aria-label="Beyond OS services"
      className="relative overflow-hidden border-b border-white/10 bg-[#070707] pt-[72px]"
      onKeyDown={(event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest("a, input, textarea")) return;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(255,255,255,0.055),transparent_46%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />

      <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] items-center gap-8 px-5 py-12 md:px-8 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-6 lg:px-10 lg:py-8">
        <Copy
          active={active}
          story={story}
          slug={slug}
          index={index}
          paused={paused}
          reduce={!!reduce}
          onToggle={() => setPaused((value) => !value)}
          onSelect={select}
        />

        <div
          className="relative h-[340px] sm:h-[420px] lg:h-[min(740px,78vh)]"
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 760 860"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M70 40C210 20 250 160 190 280C120 430 230 500 200 660C176 790 300 830 390 850"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.15"
              strokeDasharray="1.4 8"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={
                reduce
                  ? { pathLength: 1 }
                  : { pathLength: 1, strokeDashoffset: [0, -90] }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : { pathLength: { duration: 1.5, ease }, strokeDashoffset: { duration: 22, repeat: Infinity, ease: "linear" } }
              }
            />
          </svg>

          <div className="pointer-events-none absolute left-[28%] top-[12%] hidden h-[72%] w-[64%] lg:block" aria-hidden="true">
            <span className="orbit-ring left-1/2 top-1/2 -ml-[140px] -mt-[140px]" />
            <span className="orbit-ring left-1/2 top-1/2 -ml-[180px] -mt-[180px]" />
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 top-0 lg:left-[30%] lg:right-[2%]"
            style={finePointer && !reduce ? { x: shiftX, y: shiftY } : undefined}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slug}
                className="h-full"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: reduce ? 0 : 0.45, ease }}
              >
                <motion.div
                  className="h-full"
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <Scene slug={slug} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {services.map((service) => {
              const serviceIndex = order.indexOf(service.slug);
              const delta = (serviceIndex - index + order.length) % order.length;
              const slot = slots[[2, 3, 4, 0, 1][delta]];
              const selected = delta === 0;
              return (
                <motion.button
                  key={service.slug}
                  type="button"
                  onClick={() => select(service.slug)}
                  aria-pressed={selected}
                  aria-label={`${service.name}. ${service.demoLabel}`}
                  animate={{ top: slot.top, left: slot.left, opacity: selected ? 1 : 0.42 }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
                  className="pointer-events-auto absolute z-20 flex -translate-y-1/2 items-center gap-3 text-left"
                >
                  <span className="relative grid place-items-center">
                    {selected ? (
                      <motion.span
                        layoutId="service-ring"
                        className="absolute -inset-2 rounded-full border border-white"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
                      />
                    ) : null}
                    <motion.span
                      animate={{ width: selected ? 86 : 48, height: selected ? 86 : 48 }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 26 }}
                      className="grid place-items-center overflow-hidden rounded-full border border-white/15 bg-[#111] shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                    >
                      <Thumb slug={service.slug} />
                    </motion.span>
                    {selected ? (
                      <span className="absolute -bottom-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full border border-white/20 bg-[#161616] px-1 text-[9px] text-[#e8e8e4]">
                        {service.number}
                      </span>
                    ) : null}
                  </span>
                  <span className={selected ? "" : "hidden xl:block"}>
                    <span className={`block tracking-[-0.03em] ${selected ? "text-[22px] text-white" : "text-[13px] text-[#c8c8c4]"}`}>
                      {service.shortName}
                    </span>
                    {selected ? (
                      <span className="mt-0.5 block max-w-[150px] text-[12px] leading-4 text-[#8a8a86]">
                        {service.demoLabel}
                      </span>
                    ) : null}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="absolute bottom-1 right-0 z-30 flex items-center gap-3 lg:bottom-2">
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-[#8a8a86] [writing-mode:vertical-rl] rotate-180 lg:inline">
              Choose your next step
            </span>
            <div className="flex gap-2 lg:flex-col">
              <RoundButton label="Previous service" onClick={() => go(-1)}>
                ↑
              </RoundButton>
              <RoundButton label="Next service" onClick={() => go(1)}>
                ↓
              </RoundButton>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-[10px] uppercase leading-5 tracking-[0.18em] text-[#8a8a86]">
            One connected partner
            <span className="block text-[#5e5e5a]">Five ways forward</span>
          </p>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {services.map((service) => (
              <button
                key={service.slug}
                type="button"
                onClick={() => select(service.slug)}
                aria-pressed={service.slug === slug}
                className={`inline-flex items-center gap-2 text-[13px] transition hover:text-white ${
                  service.slug === slug ? "text-white" : "text-[#9a9a96]"
                }`}
              >
                <span className="text-[12px] text-[#6f6f6f]">{service.icon}</span>
                {service.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Copy({
  active,
  story,
  slug,
  index,
  paused,
  reduce,
  onToggle,
  onSelect,
}: {
  active: Service;
  story: Story;
  slug: ServiceSlug;
  index: number;
  paused: boolean;
  reduce: boolean;
  onToggle: () => void;
  onSelect: (slug: ServiceSlug) => void;
}) {
  return (
    <div className="min-w-0">
      <motion.p
        className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8a8a86]"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
        The connected hospitality toolkit
      </motion.p>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={slug}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#b7b7b2]">
              <span className="h-px w-6 bg-white/30" />
              {active.number} / {active.category}
            </p>
            <h1 className="mt-5 max-w-full text-balance text-[clamp(2.35rem,8vw,4.55rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[#f6f6f3]">
              {story.lines[0]}
              <span className="mt-1 block text-[#9d9d98]">{story.lines[1]}</span>
            </h1>
            <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-[#8f8f8b]">{story.lead}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-8 flex flex-wrap gap-3"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease }}
      >
        <Link
          href={`/services/${slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#f3f3f0] px-5 py-3 text-[13px] font-medium text-[#121212] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
        >
          Explore {active.shortName}
          <Arrow />
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 text-[13px] text-[#f3f3f0] transition duration-300 hover:-translate-y-0.5 hover:border-white/45"
        >
          Let&apos;s talk
          <Arrow />
        </Link>
      </motion.div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#6e6e6a]">
        Built in Georgia · Designed around you
      </p>

      <div className="mt-8 flex w-full min-w-0 gap-3 overflow-x-auto pb-1 lg:hidden">
        {services.map((service) => {
          const selected = service.slug === slug;
          return (
            <button
              key={service.slug}
              type="button"
              onClick={() => onSelect(service.slug)}
              aria-pressed={selected}
              className="flex w-[76px] shrink-0 flex-col items-center gap-2 text-center"
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-full border bg-[#111] ${
                  selected ? "border-white" : "border-white/15 opacity-50"
                }`}
              >
                <Thumb slug={service.slug} />
              </span>
              <span className={`text-[11px] leading-4 ${selected ? "text-white" : "text-[#8a8a86]"}`}>
                {service.shortName}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="w-6 text-[12px] tracking-[0.12em] text-[#deded8]">{active.number}</span>
        <span className="relative h-px w-28 bg-white/15">
          <motion.span
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white"
            animate={{ left: `${(index / (order.length - 1)) * 100}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}
          />
        </span>
        <button
          type="button"
          aria-label={paused ? "Play service rotation" : "Pause service rotation"}
          onClick={onToggle}
          className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-[9px] text-[#deded8] transition hover:border-white/50"
        >
          {paused ? "▶" : "Ⅱ"}
        </button>
      </div>
    </div>
  );
}

function Scene({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case "hms":
      return <Building />;
    case "oms":
      return <Table />;
    case "web":
      return <SiteFrames />;
    case "growth":
      return <Bars />;
    case "crm":
      return <CrmOrbit />;
    default: {
      const exhaustive: never = slug;
      return exhaustive;
    }
  }
}

function Building() {
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hms-roof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.16)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
        </linearGradient>
        <linearGradient id="hms-wall-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id="hms-wall-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>
      </defs>
      <polygon points="150,150 330,70 540,160 360,240" fill="url(#hms-roof)" stroke="rgba(255,255,255,0.45)" />
      <polygon points="150,150 360,240 360,460 150,370" fill="url(#hms-wall-l)" stroke="rgba(255,255,255,0.32)" />
      <polygon points="360,240 540,160 540,380 360,460" fill="url(#hms-wall-r)" stroke="rgba(255,255,255,0.22)" />
      <g transform="matrix(2.05, 0.88, 0, 2.15, 168, 168)" fill="none" stroke="rgba(255,255,255,0.38)">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 3 }).map((__, col) => (
            <rect key={`l${row}${col}`} x={6 + col * 26} y={8 + row * 20} width="14" height="11" rx="0.6" />
          )),
        )}
        <rect x="32" y="48" width="14" height="11" fill="rgba(255,255,255,0.55)" stroke="none" />
      </g>
      <g transform="matrix(1.7, -0.75, 0, 2.05, 372, 196)" fill="none" stroke="rgba(255,255,255,0.28)">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 3 }).map((__, col) => (
            <rect key={`r${row}${col}`} x={6 + col * 26} y={8 + row * 20} width="14" height="11" />
          )),
        )}
      </g>
      <g>
        <rect x="168" y="250" width="168" height="92" rx="16" fill="rgba(18,18,18,0.72)" stroke="rgba(255,255,255,0.28)" />
        <text x="188" y="278" fill="#eee" fontSize="13" letterSpacing="2">
          ROOM / 201
        </text>
        <line x1="188" y1="294" x2="310" y2="294" stroke="rgba(255,255,255,0.25)" />
        <line x1="188" y1="308" x2="286" y2="308" stroke="rgba(255,255,255,0.14)" />
        <rect x="188" y="318" width="78" height="12" rx="3" fill="rgba(255,255,255,0.12)" />
      </g>
    </svg>
  );
}

function Table() {
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" aria-hidden="true">
      <polygon points="90,230 300,130 560,240 350,345" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.4)" />
      <polygon points="90,230 350,345 350,385 90,270" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.22)" />
      <polygon points="350,345 560,240 560,280 350,385" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.16)" />
      {[
        [190, 200],
        [300, 175],
        [250, 270],
        [370, 245],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <ellipse cx={cx} cy={cy} rx="54" ry="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.45)" />
          <ellipse cx={cx} cy={cy + 8} rx="54" ry="18" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.12)" />
          <ellipse cx={cx - 8} cy={cy - 4} rx="18" ry="7" fill="rgba(255,255,255,0.18)" />
        </g>
      ))}
      <g>
        <rect x="430" y="78" width="150" height="118" rx="16" fill="rgba(16,16,16,0.7)" stroke="rgba(255,255,255,0.3)" />
        <text x="450" y="108" fill="#eee" fontSize="13" letterSpacing="1.5">
          TABLE / 04
        </text>
        <line x1="450" y1="124" x2="548" y2="124" stroke="rgba(255,255,255,0.25)" />
        <line x1="450" y1="140" x2="530" y2="140" stroke="rgba(255,255,255,0.16)" />
        <line x1="450" y1="154" x2="510" y2="154" stroke="rgba(255,255,255,0.1)" />
        <rect x="450" y="168" width="90" height="12" rx="3" fill="rgba(255,255,255,0.12)" />
      </g>
    </svg>
  );
}

function SiteFrames() {
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" aria-hidden="true">
      <g transform="rotate(-8 340 260)">
        <rect x="150" y="70" width="390" height="250" rx="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" />
        <rect x="130" y="110" width="400" height="270" rx="18" fill="rgba(12,12,12,0.82)" stroke="rgba(255,255,255,0.38)" />
        <text x="160" y="150" fill="#8a8a86" fontSize="11" letterSpacing="2">
          STILL HOUSE
        </text>
        <text x="160" y="210" fill="#f4f4f1" fontSize="34">
          A sense
        </text>
        <text x="160" y="250" fill="#b7b7b2" fontSize="34">
          of place.
        </text>
        <rect x="168" y="280" width="110" height="28" rx="14" fill="rgba(255,255,255,0.12)" />
        <path d="M400 150 v150 a46 70 0 0 1 92 0 v-40" stroke="rgba(255,255,255,0.35)" fill="none" />
      </g>
    </svg>
  );
}

function Bars() {
  const heights = [90, 140, 190, 250];
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" aria-hidden="true">
      <polygon points="80,360 280,280 560,390 360,470" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" />
      {heights.map((height, index) => {
        const x = 140 + index * 78;
        const y = 330 - height * 0.55;
        return (
          <g key={height}>
            <polygon
              points={`${x},${y} ${x + 46},${y - 18} ${x + 46},${y - 18 + height} ${x},${y + height}`}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.4)"
            />
            <polygon
              points={`${x + 46},${y - 18} ${x + 78},${y + 4} ${x + 78},${y + 4 + height} ${x + 46},${y - 18 + height}`}
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.22)"
            />
            <polygon
              points={`${x},${y} ${x + 46},${y - 18} ${x + 78},${y + 4} ${x + 32},${y + 22}`}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.35)"
            />
          </g>
        );
      })}
      <path d="M150 340 C 240 300, 340 220, 470 120" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
      <path d="M452 112 l28 2 -14 24" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CrmOrbit() {
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" aria-hidden="true">
      <ellipse cx="340" cy="260" rx="210" ry="120" stroke="rgba(255,255,255,0.12)" fill="none" />
      <ellipse cx="340" cy="260" rx="140" ry="78" stroke="rgba(255,255,255,0.08)" fill="none" />
      <rect x="250" y="175" width="160" height="150" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="330" cy="230" r="28" stroke="rgba(255,255,255,0.55)" fill="none" />
      <path d="M292 300c8-22 22-32 38-32s30 10 38 32" stroke="rgba(255,255,255,0.45)" fill="none" />
      <g>
        <rect x="430" y="80" width="160" height="78" rx="14" fill="rgba(14,14,14,0.75)" stroke="rgba(255,255,255,0.28)" />
        <text x="448" y="110" fill="#cfcfcb" fontSize="11" letterSpacing="1">
          NEW ENQUIRY
        </text>
        <line x1="448" y1="126" x2="560" y2="126" stroke="rgba(255,255,255,0.2)" />
      </g>
      <g>
        <rect x="90" y="150" width="150" height="70" rx="14" fill="rgba(14,14,14,0.7)" stroke="rgba(255,255,255,0.22)" />
        <text x="108" y="190" fill="#bdbdb8" fontSize="12">
          GUEST PROFILE
        </text>
      </g>
      <g>
        <rect x="120" y="330" width="150" height="70" rx="14" fill="rgba(14,14,14,0.7)" stroke="rgba(255,255,255,0.22)" />
        <text x="138" y="370" fill="#bdbdb8" fontSize="12">
          NEXT STEP
        </text>
      </g>
    </svg>
  );
}

function Thumb({ slug }: { slug: ServiceSlug }) {
  const common = "h-8 w-8 text-white/80";
  switch (slug) {
    case "hms":
      return (
        <svg viewBox="0 0 32 32" className={common} fill="none" aria-hidden="true">
          <path d="M6 26V13l10-6 10 6v13" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 26v-6h8v6M10 16h3M16 16h3M10 20h3" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "oms":
      return (
        <svg viewBox="0 0 32 32" className={common} fill="none" aria-hidden="true">
          <path d="M6 14l10-5 10 5-10 5-10-5z" stroke="currentColor" />
          <circle cx="12" cy="15" r="2" stroke="currentColor" />
          <circle cx="20" cy="15" r="2" stroke="currentColor" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 32 32" className={common} fill="none" aria-hidden="true">
          <rect x="5" y="8" width="22" height="16" rx="2" stroke="currentColor" />
          <path d="M5 12h22M18 16v6" stroke="currentColor" />
        </svg>
      );
    case "growth":
      return (
        <svg viewBox="0 0 32 32" className={common} fill="none" aria-hidden="true">
          <path d="M6 24V16M12 24V12M18 24V14M24 24V8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 32 32" className={common} fill="none" aria-hidden="true">
          <circle cx="16" cy="12" r="4" stroke="currentColor" />
          <path d="M8 24c1.5-3 4-5 8-5s6.5 2 8 5" stroke="currentColor" />
        </svg>
      );
    default: {
      const exhaustive: never = slug;
      return exhaustive;
    }
  }
}

function RoundButton({
  children,
  label,
  onClick,
}: {
  children: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-[15px] text-[#e4e4e0] transition hover:border-white/60 hover:text-white"
    >
      {children}
    </button>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5 10.5 3.5M5.5 3.5h5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
