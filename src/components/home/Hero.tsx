"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EclipseHorizon } from "./EclipseHorizon";
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
  previewTabs: string[];
  previewActive: number;
  previewRows: { label: string; meta: string; tone?: "ok" | "warn" | "soft" }[];
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
    orbitLabel: "Guest relationships & messaging",
    thumb: "/media/desk.jpg",
    alt: "A hotel reception desk in stone and warm lamplight.",
    icon: "◎",
    previewTabs: ["Reservations", "Guest CRM", "Operations", "Direct booking"],
    previewActive: 1,
    previewRows: [
      { label: "Nino K. · suite enquiry", meta: "Follow-up due", tone: "warn" },
      { label: "David R. · returning guest", meta: "Confirmed", tone: "ok" },
      { label: "Ana M. · dining request", meta: "In conversation", tone: "soft" },
    ],
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
    previewTabs: ["Floor", "Kitchen", "Orders", "Close"],
    previewActive: 1,
    previewRows: [
      { label: "T12 · 2× tasting · note: no shellfish", meta: "Preparing", tone: "warn" },
      { label: "T04 · mains fired", meta: "Ready", tone: "ok" },
      { label: "T09 · dessert course", meta: "Received", tone: "soft" },
    ],
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
    previewTabs: ["Reservations", "Rooms", "Arrivals", "Housekeeping"],
    previewActive: 0,
    previewRows: [
      { label: "Suite 12 · arrival 15:00", meta: "Ready", tone: "ok" },
      { label: "Room 07 · late checkout", meta: "Cleaning", tone: "warn" },
      { label: "Cottage 3 · 2 nights", meta: "Confirmed", tone: "soft" },
    ],
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
    previewTabs: ["Pages", "Rooms", "Enquiry", "Preview"],
    previewActive: 3,
    previewRows: [
      { label: "Homepage · hero & stays", meta: "Live", tone: "ok" },
      { label: "Direct booking path", meta: "In review", tone: "warn" },
      { label: "Seasonal offer page", meta: "Draft", tone: "soft" },
    ],
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
    previewTabs: ["Brand", "Search", "Campaigns", "Enquiries"],
    previewActive: 3,
    previewRows: [
      { label: "Direct enquiries · this week", meta: "+18%", tone: "ok" },
      { label: "Search visibility · stays", meta: "Steady", tone: "soft" },
      { label: "Campaign · autumn cottage", meta: "Live", tone: "warn" },
    ],
  },
];

const CYCLE_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

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
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="hero-atmosphere-base" />
          <div
            className="hero-atmosphere-glow"
            style={{ transform: `translate3d(0, ${parallax * 4}%, 0)` }}
          />
          <div className="hero-atmosphere-glow-side" />
          <div className="hero-grid" aria-hidden="true">
            <EclipseHorizon />
            <div className="hero-grid-veil" />
          </div>
          <div className="hero-horizon">
            <svg
              viewBox="0 -80 1440 640"
              preserveAspectRatio="xMidYMid slice"
              className="hero-horizon-svg"
            >
              <defs>
                {/* Ends dark → center bright lilac, smooth like Holdout */}
                <linearGradient id="heroHorizonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(70,45,130,0)" />
                  <stop offset="8%" stopColor="rgba(90,60,160,0.15)" />
                  <stop offset="22%" stopColor="rgba(130,95,210,0.4)" />
                  <stop offset="38%" stopColor="rgba(195,170,255,0.85)" />
                  <stop offset="50%" stopColor="rgba(236,228,255,1)" />
                  <stop offset="62%" stopColor="rgba(195,170,255,0.85)" />
                  <stop offset="78%" stopColor="rgba(130,95,210,0.4)" />
                  <stop offset="92%" stopColor="rgba(90,60,160,0.15)" />
                  <stop offset="100%" stopColor="rgba(70,45,130,0)" />
                </linearGradient>
                <linearGradient id="heroHorizonBloomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(100,70,180,0)" />
                  <stop offset="12%" stopColor="rgba(110,80,200,0.08)" />
                  <stop offset="32%" stopColor="rgba(150,115,235,0.28)" />
                  <stop offset="50%" stopColor="rgba(200,175,255,0.5)" />
                  <stop offset="68%" stopColor="rgba(150,115,235,0.28)" />
                  <stop offset="88%" stopColor="rgba(110,80,200,0.08)" />
                  <stop offset="100%" stopColor="rgba(100,70,180,0)" />
                </linearGradient>
                <radialGradient id="heroHorizonHaze" cx="50%" cy="55%" r="52%">
                  <stop offset="0%" stopColor="rgba(200,170,255,0.42)" />
                  <stop offset="28%" stopColor="rgba(140,105,220,0.22)" />
                  <stop offset="60%" stopColor="rgba(80,55,150,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                <linearGradient id="heroBelowFade" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(2,2,6,0)" />
                  <stop offset="12%" stopColor="rgba(2,2,6,0.45)" />
                  <stop offset="40%" stopColor="rgba(2,2,6,0.88)" />
                  <stop offset="100%" stopColor="rgba(2,2,6,1)" />
                </linearGradient>
                <filter id="heroSoftBloom" x="-18%" y="-420%" width="136%" height="940%">
                  <feGaussianBlur stdDeviation="11" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                  </feMerge>
                </filter>
                <filter id="heroLineSoft" x="-8%" y="-260%" width="116%" height="620%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <ellipse cx="720" cy="210" rx="900" ry="200" fill="url(#heroHorizonHaze)" />

              <path
                d="M-140 400 C 220 260, 460 205, 720 205 S 1220 260, 1580 400 L 1580 680 L -140 680 Z"
                fill="url(#heroBelowFade)"
              />

              <path
                className="hero-horizon-bloom"
                d="M-140 400 C 220 260, 460 205, 720 205 S 1220 260, 1580 400"
                fill="none"
                stroke="url(#heroHorizonBloomGrad)"
                strokeWidth="56"
                vectorEffect="non-scaling-stroke"
                filter="url(#heroSoftBloom)"
              />
              <path
                className="hero-horizon-line"
                d="M-140 400 C 220 260, 460 205, 720 205 S 1220 260, 1580 400"
                fill="none"
                stroke="url(#heroHorizonStroke)"
                strokeWidth="1.55"
                vectorEffect="non-scaling-stroke"
                filter="url(#heroLineSoft)"
              />
            </svg>
            <span className="hero-geo mono">
              Tbilisi, Georgia · 41.7151° N, 44.8271° E
            </span>
          </div>
        </div>

        <div
          className="hero-beyond-mark"
          aria-hidden="true"
          style={{ transform: `translate3d(0, ${parallax * 14}%, 0)` }}
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.slug}
                className="hero-copy-stack"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease }}
              >
                <CopyBody slide={slide} href={href} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="hero-orbit"
            aria-label="Choose a service"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setPaused(false);
              }
            }}
          >
            <div className="hero-orbit-ring" aria-hidden="true">
              <svg viewBox="0 0 420 640" preserveAspectRatio="xMidYMid meet">
                <path
                  className="hero-orbit-path"
                  d="M310 18 C 70 130, 28 310, 110 430 S 290 560, 318 628"
                />
              </svg>
            </div>

            {slides.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.slug}
                  className="hero-orbit-item"
                  type="button"
                  data-index={index}
                  aria-pressed={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-label={selected ? `Explore ${item.name}` : `Show ${item.name}`}
                  onMouseEnter={() => select(index)}
                  onFocus={() => select(index)}
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

            <Link href="/#workspace" className="hero-orbit-callout">
              <span className="hero-orbit-callout-kicker">
                One booking. A connected journey.
              </span>
              <strong>
                See how it could work <span aria-hidden="true">↗</span>
              </strong>
            </Link>
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
          <a className="hero-scroll mono" href="#workspace">
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
