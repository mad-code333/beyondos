"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { services, type Service } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const ROW = 88;

const previews: Record<
  Service["slug"],
  { lane: string; tags: string; blurb: string; image: string; alt: string }
> = {
  crm: {
    lane: "The desk",
    tags: "Profiles · enquiries · follow-ups",
    blurb: "Guest profiles, enquiries and follow-ups, held in one place.",
    image: "/media/desk.jpg",
    alt: "Front desk workspace",
  },
  oms: {
    lane: "The floor",
    tags: "Tables · tickets · the pass",
    blurb: "Tables, orders and the kitchen, on one picture of service.",
    image: "/media/dining.jpg",
    alt: "Restaurant dining room",
  },
  hms: {
    lane: "The stay",
    tags: "Rooms · arrivals · departure",
    blurb: "Rooms, arrivals and readiness on one board for the property.",
    image: "/media/suite.jpg",
    alt: "Hotel suite",
  },
  web: {
    lane: "The front door",
    tags: "Pages · enquiry · booking",
    blurb: "Websites with a sense of place, and a clear path to enquire or book.",
    image: "/media/facade.jpg",
    alt: "Property facade at night",
  },
  growth: {
    lane: "The next guest",
    tags: "Brand · search · campaigns",
    blurb: "Brand, search and campaigns that bring the right guests back.",
    image: "/media/river.jpg",
    alt: "Landscape for brand and growth",
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
  const barH = useSpring(ROW - 12, { stiffness: 420, damping: 40, mass: 0.75 });
  const cardY = useSpring(0, { stiffness: 280, damping: 30, mass: 0.85 });
  const cardScale = useMotionValue(0.86);
  const barOpacity = useSpring(0, { stiffness: 380, damping: 34, mass: 0.7 });
  const cardOpacity = useSpring(0, { stiffness: 300, damping: 30, mass: 0.75 });
  const inset = useSpring(50, { stiffness: 340, damping: 32, mass: 0.7 });
  const clipPath = useTransform(inset, (value) => `inset(0px ${value}% round 16px)`);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = services[active];
  const preview = previews[current.slug];

  function measure(index: number) {
    const row = rowRefs.current[index];
    const list = listRef.current;
    if (!row || !list) return null;

    const top = row.offsetTop + (row.offsetHeight - (ROW - 12)) / 2;
    const height = ROW - 12;
    const cardHeight = cardRef.current?.offsetHeight ?? 220;
    const listHeight = list.offsetHeight;
    const centered = row.offsetTop + (row.offsetHeight - cardHeight) / 2;
    const nextCard = Math.min(Math.max(0, centered), Math.max(0, listHeight - cardHeight));

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
                Five practices.
                <span className="mt-1 block text-[#b5b5b0]">One property view.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-6 text-muted md:text-right">
              CRM, restaurant orders, hotel operations, websites and growth — built to move with the
              same guest.
            </p>
          </div>
        </Reveal>

        <div
          className="svc-board relative mt-10 overflow-visible rounded-[32px] border border-white/10 bg-[linear-gradient(165deg,#161616,#0c0c0c_55%,#090909)] px-[14px] pb-3 pt-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_28px_70px_rgba(0,0,0,0.53)] md:mt-12 md:pb-4 md:pt-16"
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
          <p className="pointer-events-none absolute right-5 top-5 text-[10px] uppercase tracking-[0.14em] text-[#6f6f6b] sm:right-7 sm:top-6 sm:text-[11px] sm:tracking-[0.12em]">
            Hover or use the arrow keys
          </p>

          <div ref={listRef} className="relative w-full">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-0 rounded-[16px] border border-white/[0.14] bg-[linear-gradient(#222,#151515)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_40px_-18px_rgba(0,0,0,0.65)]"
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
              const item = previews[service.slug];
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
                  className="relative z-10 grid h-[76px] grid-cols-[minmax(120px,1fr)_auto_minmax(56px,1fr)] items-center px-2 text-[#bdbdb6] transition-colors duration-300 sm:h-[88px] sm:grid-cols-[minmax(180px,1fr)_auto_minmax(72px,1fr)] sm:px-4 md:px-5"
                  style={{
                    color: selected ? "#f4f4f0" : undefined,
                    transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.1, 1)",
                  }}
                >
                  <span className="flex min-w-0 items-center gap-3 sm:gap-4 md:gap-5">
                    <span
                      className="shrink-0 text-[12px] tracking-[0.04em] transition-opacity duration-300"
                      style={{ opacity: selected ? 0.9 : 0.45 }}
                    >
                      ({service.number})
                    </span>
                    <span
                      className="hidden min-w-0 flex-col gap-0.5 transition-[opacity,transform] duration-300 sm:flex"
                      style={{
                        opacity: selected ? 1 : 0,
                        transform: selected ? "none" : "translateY(6px)",
                        transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.1, 1)",
                      }}
                    >
                      <span className="truncate text-[11px] uppercase tracking-[0.06em] text-[#d8d8d2]">
                        {item.lane}
                      </span>
                      <span className="truncate text-[11px] uppercase tracking-[0.06em] text-[#d8d8d2]/60">
                        {item.tags}
                      </span>
                    </span>
                  </span>

                  <span
                    className="justify-self-center text-center text-[28px] font-medium tracking-[-0.04em] transition-transform duration-500 sm:text-[36px] md:text-[44px]"
                    style={{
                      transform: selected ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "center",
                      transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.1, 1)",
                    }}
                  >
                    {service.name}
                  </span>

                  <span className="justify-self-end">
                    <motion.span
                      aria-hidden
                      animate={
                        selected
                          ? {
                              rotate: 0,
                              x: 2,
                              backgroundColor: "#f4f4f0",
                              color: "#111111",
                              borderColor: "rgba(255,255,255,0)",
                            }
                          : {
                              rotate: -45,
                              x: 0,
                              backgroundColor: "rgba(255,255,255,0)",
                              color: "#cfcfc8",
                              borderColor: "rgba(255,255,255,0.16)",
                            }
                      }
                      transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border sm:h-8 sm:w-8"
                    >
                      <Arrow />
                    </motion.span>
                  </span>
                </Link>
              );
            })}

            <motion.aside
              ref={cardRef}
              aria-hidden
              className="pointer-events-none absolute -right-2 top-0 z-20 hidden w-[200px] overflow-hidden rounded-[22px] border border-white/10 bg-[#121212] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] lg:-right-6 lg:block lg:w-[220px]"
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
                name={current.name}
                preview={preview}
              />
            </motion.aside>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PreviewCard({
  name,
  preview,
}: {
  name: string;
  preview: (typeof previews)[Service["slug"]];
}) {
  return (
    <div className="relative h-[220px] w-full">
      <Image
        src={preview.image}
        alt={preview.alt}
        fill
        sizes="220px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 grid gap-1 bg-gradient-to-t from-black/90 to-transparent px-3.5 pb-3.5 pt-12 text-[13px] leading-[1.35] text-[#f4f4f0]">
        <strong className="text-[15px] tracking-[-0.03em]">{name}</strong>
        <span className="text-[#cfcfc8]">{preview.blurb}</span>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
