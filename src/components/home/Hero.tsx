"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./hero.css";

type Slide = {
  slug: "crm" | "oms" | "hms" | "web" | "growth";
  number: string;
  category: string;
  name: string;
  title: string;
  titleEm: string;
  lead: string;
  orbitLabel: string;
  thumb: string;
  alt: string;
  icon: string;
};

const slides: Slide[] = [
  {
    slug: "crm",
    number: "01",
    category: "Customer Relationship Management",
    name: "CRM",
    title: "Every relationship.",
    titleEm: "Made personal.",
    lead: "Know the guest behind every enquiry. Bring conversations, preferences and follow-ups into one thoughtful workspace.",
    orbitLabel: "Guest relationships & sales",
    thumb: "/media/desk.jpg",
    alt: "A hotel reception desk in stone and warm lamplight.",
    icon: "◎",
  },
  {
    slug: "oms",
    number: "02",
    category: "Restaurant Order Management",
    name: "Restaurant OMS",
    title: "Every order.",
    titleEm: "In perfect rhythm.",
    lead: "From the floor to the kitchen, give every team a shared view. Clear orders. Thoughtful handoffs. A calmer service.",
    orbitLabel: "Restaurant order management",
    thumb: "/media/dining.jpg",
    alt: "A restaurant dining room set for service.",
    icon: "▤",
  },
  {
    slug: "hms",
    number: "03",
    category: "Hotel Management System",
    name: "Hotel HMS",
    title: "Every stay.",
    titleEm: "Considered, together.",
    lead: "See the whole property in one place. Connect reservations, room readiness and guest context around a better stay.",
    orbitLabel: "Hotel & property management",
    thumb: "/media/suite.jpg",
    alt: "A boutique hotel bedroom in morning light.",
    icon: "▦",
  },
  {
    slug: "web",
    number: "04",
    category: "Websites & Digital Experiences",
    name: "Web Development",
    title: "First impressions.",
    titleEm: "Made to last.",
    lead: "A digital front door with a sense of place. Distinctive websites that turn discovery into a clear next step.",
    orbitLabel: "Websites & digital experiences",
    thumb: "/media/facade.jpg",
    alt: "A hotel entrance at blue hour.",
    icon: "⌘",
  },
  {
    slug: "growth",
    number: "05",
    category: "Growth, Marketing & Branding",
    name: "Digital Growth",
    title: "Your next chapter.",
    titleEm: "Seen by the right people.",
    lead: "Bring branding, content and campaigns into focus. Build a presence that feels like you — and a clearer path to growth.",
    orbitLabel: "Digital growth & branding",
    thumb: "/media/table.jpg",
    alt: "A set table for two, a candle and a glass.",
    icon: "↗",
  },
];

const CYCLE_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

function orbitPosition(index: number, active: number) {
  const raw = (index - active + slides.length) % slides.length;
  return raw > 2 ? raw - slides.length : raw;
}

function isOrbitWrap(from: number, to: number) {
  return (from <= -2 && to >= 2) || (from >= 2 && to <= -2);
}

function CopyBody({ slide, href }: { slide: Slide; href: string }) {
  return (
    <>
      <span className="hero-welcome">
        Welcome to Beyond OS · {slide.number} / {slide.category}
      </span>
      <h1>
        {slide.title}
        <br />
        <em>{slide.titleEm}</em>
      </h1>
      <p>{slide.lead}</p>
      <Link className="hero-explore-link" href={href}>
        Explore {slide.name} <span aria-hidden="true">→</span>
      </Link>
      <div className="hero-actions">
        <Link className="hero-btn hero-cta-primary" href={href}>
          Explore {slide.name} <span>↗</span>
        </Link>
        <Link className="hero-btn hero-cta-secondary" href="/#contact">
          Let&apos;s talk <span>↗</span>
        </Link>
      </div>
    </>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const orbitPrev = useRef(slides.map((_, index) => orbitPosition(index, 0)));
  const [parallax, setParallax] = useState(0);
  const slide = slides[active];
  const href = `/services/${slide.slug}`;

  const select = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onScroll() {
      if (!node) return;
      const { top, height } = node.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / Math.max(height, 1)));
      setParallax(progress);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      const motionOff = document.documentElement.getAttribute("data-motion") === "paused";
      if (motionOff) return;
      setActive((current) => (current + 1) % slides.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduce, active]);

  useEffect(() => {
    orbitPrev.current = slides.map((_, index) => orbitPosition(index, active));
  }, [active]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        select(active + 1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        select(active - 1);
      }
    }
    const node = heroRef.current;
    node?.addEventListener("keydown", onKey);
    return () => node?.removeEventListener("keydown", onKey);
  }, [active, select]);

  return (
    <>
      <section
        ref={heroRef}
        className="hero-immersive"
        aria-label="Explore Beyond OS services"
        tabIndex={-1}
      >
        <div className="hero-photo" aria-hidden="true">
          <div
            className="hero-photo-shift"
            style={{ transform: `translate3d(0, ${parallax * 8}%, 0)` }}
          >
            <Image
              src="/media/lobby.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-photo-img"
            />
          </div>
          <span className="hero-photo-veil" />
          <span className="hero-photo-grain" />
        </div>

        <div
          className="hero-beyond-mark"
          aria-hidden="true"
          style={{ transform: `translate3d(0, ${parallax * 18}%, 0)` }}
        >
          BEYOND
        </div>

        <div className="hero-top mono">
          <span>
            <i className="dot" /> THE CONNECTED HOSPITALITY TOOLKIT
          </span>
          <span>BUILT IN GEORGIA / DESIGNED AROUND YOU</span>
        </div>

        <div className="wrap hero-stage">
          <div className="hero-copy">
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.slug}
                className="hero-copy-stack"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease }}
              >
                <CopyBody slide={slide} href={href} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hero-orbit" aria-label="Choose a service">
            <div className="hero-orbit-ring" aria-hidden="true">
              <svg viewBox="0 0 520 620" preserveAspectRatio="xMidYMid meet">
                <path d="M390 20C90 90 70 520 390 600" />
              </svg>
            </div>

            {slides.map((item, index) => {
              const position = orbitPosition(index, active);
              const selected = index === active;
              const skip = isOrbitWrap(orbitPrev.current[index], position);
              return (
                <button
                  key={item.slug}
                  className="hero-orbit-item"
                  type="button"
                  data-position={position}
                  data-skip={skip ? "true" : undefined}
                  aria-pressed={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-label={selected ? `Explore ${item.name}` : `Show ${item.name}`}
                  onClick={() => {
                    if (selected) router.push(`/services/${item.slug}`);
                    else select(index);
                  }}
                >
                  <span className="hero-orbit-thumb">
                    <Image
                      src={item.thumb}
                      alt=""
                      fill
                      sizes="120px"
                      className="hero-orbit-thumb-img"
                    />
                    <span className="hero-orbit-thumb-veil" />
                    <span className="hero-orbit-index">{item.number}</span>
                  </span>
                  <span className="hero-orbit-label">
                    <strong>{item.name}</strong>
                    <small>{item.orbitLabel}</small>
                  </span>
                </button>
              );
            })}

            <div className="hero-featured">
              <Link className="hero-featured-media" href={href} aria-label={`Explore ${slide.name}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={slide.slug}
                    className="hero-featured-shift"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    <Image
                      src={slide.thumb}
                      alt=""
                      fill
                      sizes="220px"
                      className="hero-featured-img"
                    />
                  </motion.div>
                </AnimatePresence>
              </Link>
              <Link className="hero-featured-copy" href={href}>
                <span className="mono">Featured</span>
                <strong>{slide.name}</strong>
                <small>{slide.orbitLabel}</small>
              </Link>
              <div className="hero-featured-nav">
                <button type="button" aria-label="Previous service" onClick={() => select(active - 1)}>
                  ↑
                </button>
                <button type="button" aria-label="Next service" onClick={() => select(active + 1)}>
                  ↓
                </button>
              </div>
            </div>

            <div className="hero-orbit-note mono">CHOOSE YOUR NEXT STEP</div>
          </div>
        </div>

        <div className="hero-bottom wrap">
          <div className="hero-status">
            <span>{slide.number}</span>
            <i />
            <span>05</span>
            <button
              type="button"
              aria-pressed={paused}
              aria-label={paused ? "Play service rotation" : "Pause service rotation"}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          </div>
          <a className="hero-scroll mono" href="#property">
            SCROLL TO DISCOVER <span>↓</span>
          </a>
          <div className="hero-bottom-spacer" aria-hidden="true" />
        </div>
        <span className="sr-only" aria-live="polite">
          Showing {slide.name}
        </span>
      </section>

      <div className="scope-strip">
        <div className="wrap scope-inner">
          <span className="mono">
            ONE CONNECTED PARTNER.
            <br />
            FIVE WAYS FORWARD.
          </span>
          {slides.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              aria-current={item.slug === slide.slug ? "true" : undefined}
            >
              <b>{item.icon}</b>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
