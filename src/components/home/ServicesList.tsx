"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { services, type Service } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const previews: Record<
  Service["slug"],
  { kicker: string; title: string; stats: [string, string][] }
> = {
  crm: {
    kicker: "Guest workspace",
    title: "From a first hello to a confirmed stay.",
    stats: [
      ["Open", "03"],
      ["Pipeline", "₾7,080"],
      ["Next", "Today"],
    ],
  },
  oms: {
    kicker: "Service floor",
    title: "Tables, tickets and the pass in one rhythm.",
    stats: [
      ["Covers", "42"],
      ["Open", "06"],
      ["Pace", "Calm"],
    ],
  },
  hms: {
    kicker: "Property desk",
    title: "Rooms, arrivals and readiness on one board.",
    stats: [
      ["Arrivals", "11"],
      ["Ready", "08"],
      ["Stay", "3 nts"],
    ],
  },
  web: {
    kicker: "Still House",
    title: "A site with a sense of place, and a next step.",
    stats: [
      ["Pages", "12"],
      ["Path", "Book"],
      ["Direct", "On"],
    ],
  },
  growth: {
    kicker: "Demand",
    title: "Brand, search and campaigns for the right guests.",
    stats: [
      ["Reach", "86%"],
      ["Direct", "+41%"],
      ["Brand", "Live"],
    ],
  },
};

const ease = [0.2, 0.7, 0.1, 1] as const;

export function ServicesList() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const armed = useRef(false);
  const holdLayout = useRef(0);
  const lastIndex = useRef(0);
  const reduce = Boolean(mounted && reduceMotion);

  const barY = useSpring(0, { stiffness: 420, damping: 38, mass: 0.75 });
  const barH = useSpring(96, { stiffness: 420, damping: 40, mass: 0.75 });
  const cardY = useSpring(0, { stiffness: 280, damping: 30, mass: 0.85 });
  const cardScale = useMotionValue(0.86);
  const barOpacity = useSpring(0, { stiffness: 380, damping: 34, mass: 0.7 });
  const cardOpacity = useSpring(0, { stiffness: 300, damping: 30, mass: 0.75 });
  const inset = useSpring(50, { stiffness: 340, damping: 32, mass: 0.7 });
  const clipPath = useTransform(inset, (value) => `inset(0px ${value}% round 14px)`);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = services[active];
  const preview = previews[current.slug];

  function measure(index: number) {
    const row = rowRefs.current[index];
    const list = listRef.current;
    if (!row || !list) return null;

    const top = row.offsetTop;
    const height = row.offsetHeight;
    const cardHeight = cardRef.current?.offsetHeight ?? 0;
    const listHeight = list.offsetHeight;
    const centered = top + (height - cardHeight) / 2;
    const nextCard = cardHeight
      ? Math.min(Math.max(0, centered), Math.max(0, listHeight - cardHeight))
      : top;

    return { top, height, nextCard };
  }

  function place(index: number, behavior: "enter" | "move" | "resize" | "idle") {
    const next = measure(index);
    if (!next) return;

    if (behavior === "resize") {
      if (performance.now() < holdLayout.current) return;
      barY.jump(next.top);
      barH.jump(next.height);
      cardY.jump(next.nextCard);
      return;
    }

    if (behavior === "idle") {
      if (reduce) {
        barOpacity.jump(0);
        cardOpacity.jump(0);
        inset.jump(50);
        cardScale.jump(0.86);
        return;
      }
      barOpacity.set(0);
      cardOpacity.set(0);
      inset.set(50);
      animate(cardScale, 0.86, { duration: 0.35, ease });
      return;
    }

    holdLayout.current = performance.now() + 160;

    const jump = behavior === "enter" || !!reduce;
    if (jump) {
      barY.jump(next.top);
      barH.jump(next.height);
      cardY.jump(next.nextCard);
    } else {
      barY.set(next.top);
      barH.set(next.height);
      cardY.set(next.nextCard);
    }

    if (reduce) {
      barOpacity.jump(1);
      cardOpacity.jump(1);
      cardScale.jump(1);
      inset.jump(0);
      return;
    }

    // Tessvik reopen: collapse to center, then spring open with the sliding bar.
    inset.jump(50);
    inset.set(0);
    barOpacity.set(1);
    cardOpacity.set(1);
    animate(cardScale, [0.86, 1], { duration: 0.5, ease });
  }

  useLayoutEffect(() => {
    if (!live) {
      place(active, "idle");
      return;
    }
    const behavior = lastIndex.current === active ? "enter" : "move";
    place(active, behavior);
    lastIndex.current = active;
    // Springs are stable; placement is keyed to the active row + live state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, live, reduce]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onResize = () => place(active, live ? "resize" : "idle");
    const observer = new ResizeObserver(onResize);
    observer.observe(list);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, live, reduce]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!armed.current) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setLive(true);
      setActive((value) => {
        const next = (value + direction + services.length) % services.length;
        setCardKey((key) => key + 1);
        return next;
      });
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function select(index: number) {
    setLive(true);
    setActive((currentIndex) => {
      if (index !== currentIndex) setCardKey((value) => value + 1);
      return index;
    });
  }

  return (
    <section className="section-pad border-t border-line" id="services">
      <Container className="max-w-[1320px]">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
                — 02 / The Beyond toolkit
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-medium tracking-[-0.045em] md:text-6xl">
                The right tools.
                <span className="mt-1 block text-[#b5b5b0]">The bigger picture.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-6 text-muted md:text-right">
              Software to run your operation. Digital experiences to represent it. Growth to take
              it further.
            </p>
          </div>
        </Reveal>

        <div
          className="relative mt-14 lg:pr-[320px]"
          onMouseEnter={() => {
            armed.current = true;
          }}
          onMouseLeave={() => {
            armed.current = false;
            setLive(false);
          }}
          onFocus={() => {
            armed.current = true;
            setLive(true);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              armed.current = false;
              setLive(false);
            }
          }}
        >
          <div ref={listRef} className="relative border-t border-white/10">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 rounded-[14px] bg-[#161616] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]"
              style={{
                y: barY,
                height: barH,
                opacity: barOpacity,
                clipPath,
                willChange: "transform, opacity",
              }}
            />
            {services.map((service, index) => {
              const selected = live && index === active;
              return (
                <Link
                  key={service.slug}
                  ref={(node) => {
                    rowRefs.current[index] = node;
                  }}
                  href={`/services/${service.slug}`}
                  onPointerEnter={() => select(index)}
                  onFocus={() => select(index)}
                  onClick={() => select(index)}
                  aria-current={selected ? "true" : undefined}
                  className="group relative z-10 grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/10 px-3 py-7 sm:px-6 md:grid-cols-[72px_minmax(220px,0.9fr)_minmax(280px,1.35fr)_88px] md:gap-10 md:px-8 md:py-8"
                >
                  <span
                    className="text-[12px] tracking-[0.14em] transition-colors duration-300"
                    style={{
                      color: selected ? "#f4f4f1" : "#6d6d69",
                      transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.1, 1)",
                    }}
                  >
                    {service.number}
                  </span>
                  <span>
                    <span className="block text-[26px] tracking-[-0.04em] text-[#f4f4f1] md:text-[32px]">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[#6f6f6b]">
                      {service.category}
                    </span>
                  </span>
                  <span className="hidden text-[14px] leading-6 text-[#8d8d88] md:block">
                    {service.summary}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={
                      selected
                        ? { rotate: 0, backgroundColor: "#f4f4f1", color: "#111111" }
                        : { rotate: -45, backgroundColor: "rgba(255,255,255,0)", color: "#d8d8d4" }
                    }
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
                    className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-white/15"
                  >
                    <Arrow />
                  </motion.span>
                </Link>
              );
            })}
          </div>

          <motion.aside
            ref={cardRef}
            aria-hidden
            className="pointer-events-none mt-6 hidden w-[280px] lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:block"
            style={{
              y: cardY,
              opacity: cardOpacity,
              scale: cardScale,
              rotateX: reduce ? 0 : 8,
              rotateY: reduce ? 0 : -14,
              rotateZ: reduce ? 0 : -2,
              transformPerspective: 900,
              transformOrigin: "50% 50%",
              willChange: "transform, opacity",
            }}
          >
            <PreviewCard
              key={live ? `${current.slug}-${cardKey}` : current.slug}
              preview={preview}
              footer={`${current.number} · ${current.shortName}`}
            />
          </motion.aside>
        </div>
      </Container>
      <style>{`
        @keyframes svc-type { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
        @keyframes svc-scan { from { transform: translateY(0); opacity: 1 } to { transform: translateY(240px); opacity: 0 } }
        .svc-type { animation: svc-type .42s steps(7, end) both }
        .svc-scan { animation: svc-scan .5s cubic-bezier(.7, 0, .2, 1) both }
        @media (prefers-reduced-motion: reduce) {
          .svc-type, .svc-scan { animation: none }
        }
      `}</style>
    </section>
  );
}

function PreviewCard({
  preview,
  footer,
}: {
  preview: (typeof previews)[Service["slug"]];
  footer: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-white/12 bg-[linear-gradient(160deg,rgba(34,35,40,0.94),rgba(12,12,14,0.96))] p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_32%)]"
      />
      <div
        aria-hidden
        className="svc-scan pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white/25 to-transparent"
      />
      <p
        className="svc-type relative text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]"
        style={{ animationDelay: "0.02s" }}
      >
        {preview.kicker}
      </p>
      <p
        className="svc-type relative mt-3 text-[18px] leading-6 tracking-[-0.03em] text-[#f4f4f1]"
        style={{ animationDelay: "0.07s" }}
      >
        {preview.title}
      </p>
      <div className="relative mt-4 space-y-2">
        <span className="svc-type block h-2 w-full rounded-full bg-white/10" style={{ animationDelay: "0.12s" }} />
        <span className="svc-type block h-2 w-4/5 rounded-full bg-white/10" style={{ animationDelay: "0.17s" }} />
        <span className="svc-type block h-2 w-3/5 rounded-full bg-white/15" style={{ animationDelay: "0.22s" }} />
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {preview.stats.map(([label, value], index) => (
          <div
            key={label}
            className="svc-type rounded-xl border border-white/10 bg-black/30 px-2 py-2"
            style={{ animationDelay: `${0.22 + index * 0.05}s` }}
          >
            <div className="text-[9px] uppercase tracking-[0.12em] text-[#6f6f6b]">{label}</div>
            <div className="mt-1 text-[13px] text-[#f4f4f1]">{value}</div>
          </div>
        ))}
      </div>
      <p
        className="svc-type relative mt-4 text-[10px] uppercase tracking-[0.14em] text-[#6f6f6b]"
        style={{ animationDelay: "0.38s" }}
      >
        {footer}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
