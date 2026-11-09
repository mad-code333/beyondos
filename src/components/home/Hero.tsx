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
    orbitLabel: "Guest relationships & sales",
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

function WorkspacePreview({ slide }: { slide: Slide }) {
  return (
    <div className="hero-workspace" aria-hidden="true">
      <div className="hero-workspace-chrome">
        <div className="hero-workspace-head">
          <span className="hero-workspace-mark" aria-hidden="true">
            ▦
          </span>
          <div className="hero-workspace-title">
            <strong>The Mountain House</strong>
            <small>Illustrative property / Beyond OS</small>
          </div>
          <span className="hero-workspace-badge">Interactive concept</span>
        </div>

        <div className="hero-workspace-tabs">
          {slide.previewTabs.map((tab, index) => (
            <span
              key={tab}
              className="hero-workspace-tab"
              data-active={index === slide.previewActive ? "true" : undefined}
            >
              {tab}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.slug}
            className="hero-workspace-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease }}
          >
            <div className="hero-workspace-panel">
              <div className="hero-workspace-panel-head">
                <span>{slide.name}</span>
                <span>{slide.orbitLabel}</span>
              </div>
              <ul className="hero-workspace-rows">
                {slide.previewRows.map((row) => (
                  <li key={row.label} data-tone={row.tone}>
                    <span>{row.label}</span>
                    <em>{row.meta}</em>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero-workspace-side">
              <div className="hero-workspace-side-card">
                <span className="mono">Today</span>
                <strong>12</strong>
                <small>Arrivals &amp; notes</small>
              </div>
              <div className="hero-workspace-side-card">
                <span className="mono">Connected</span>
                <strong>{slide.number}</strong>
                <small>{slide.name} live view</small>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
          <div
            className="hero-grid"
            style={{ transform: `translate3d(0, ${parallax * 6}%, 0)` }}
          />
          <div className="hero-horizon">
            <svg viewBox="0 0 1440 520" preserveAspectRatio="none" className="hero-horizon-svg">
              <defs>
                <linearGradient id="heroHorizonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(168,150,255,0)" />
                  <stop offset="18%" stopColor="rgba(176,158,255,0.35)" />
                  <stop offset="50%" stopColor="rgba(198,178,255,0.95)" />
                  <stop offset="82%" stopColor="rgba(176,158,255,0.35)" />
                  <stop offset="100%" stopColor="rgba(168,150,255,0)" />
                </linearGradient>
                <linearGradient id="heroHorizonAura" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(98,72,180,0.28)" />
                  <stop offset="42%" stopColor="rgba(72,56,140,0.12)" />
                  <stop offset="100%" stopColor="rgba(40,30,80,0)" />
                </linearGradient>
                <radialGradient id="heroHorizonCore" cx="50%" cy="78%" r="48%">
                  <stop offset="0%" stopColor="rgba(140,110,230,0.34)" />
                  <stop offset="55%" stopColor="rgba(70,50,140,0.12)" />
                  <stop offset="100%" stopColor="rgba(10,8,20,0)" />
                </radialGradient>
              </defs>
              <ellipse cx="720" cy="540" rx="1020" ry="340" fill="#030308" />
              <ellipse cx="720" cy="540" rx="1020" ry="340" fill="url(#heroHorizonAura)" />
              <rect x="0" y="0" width="1440" height="520" fill="url(#heroHorizonCore)" />
              <path
                d="M-80 268 C 200 142, 500 92, 720 92 S 1240 142, 1520 268 L 1520 520 L -80 520 Z"
                fill="rgba(4,4,8,0.78)"
              />
              <path
                d="M-80 274 C 200 152, 500 104, 720 104 S 1240 152, 1520 274"
                fill="none"
                stroke="rgba(196,176,255,0.22)"
                strokeWidth="10"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M-80 268 C 200 142, 500 92, 720 92 S 1240 142, 1520 268"
                fill="none"
                stroke="url(#heroHorizonStroke)"
                strokeWidth="1.55"
                vectorEffect="non-scaling-stroke"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease }}
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
                <path d="M268 28 C 96 120, 78 300, 168 400 S 320 560, 286 618" />
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
          </div>
        </div>

        <div className="wrap hero-workspace-wrap">
          <WorkspacePreview slide={slide} />
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
