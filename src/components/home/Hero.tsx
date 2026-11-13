"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { EclipseHorizon } from "./EclipseHorizon";
import { HeroWorkspace, type TabId } from "./HeroWorkspace";
import "./hero.css";

type Slide = {
  slug: "crm" | "oms" | "hms" | "web" | "growth";
  number: string;
  name: string;
  orbitLabel: string;
  thumb: string;
};

const slides: Slide[] = [
  { slug: "crm", number: "01", name: "CRM", orbitLabel: "Guest relationships & messaging", thumb: "/media/desk.jpg" },
  { slug: "oms", number: "02", name: "Restaurant OMS", orbitLabel: "Restaurant order management", thumb: "/media/dining.jpg" },
  { slug: "hms", number: "03", name: "Hotel HMS", orbitLabel: "Hotel & property management", thumb: "/media/suite.jpg" },
  { slug: "web", number: "04", name: "Web Development", orbitLabel: "Websites & digital experiences", thumb: "/media/facade.jpg" },
  { slug: "growth", number: "05", name: "Digital Growth", orbitLabel: "Digital growth & branding", thumb: "/media/table.jpg" },
];

const CYCLE_MS = 5500;

/** Which Mountain House tab each service lights up. */
const TAB_FOR: Record<Slide["slug"], TabId> = {
  crm: "crm",
  oms: "operations",
  hms: "reservations",
  web: "booking",
  growth: "booking",
};
/** Clicking a panel tab highlights this service. */
const SERVICE_FOR: Record<TabId, number> = {
  crm: 0,
  operations: 1,
  reservations: 2,
  booking: 3,
};
/** Canvas space kept under the arc crest for the planet glow (px). */
const ARC_PAD = 360;

/** Drawn arrow — iOS renders the ↗ character as a colour emoji. */
function ArrowUpRight() {
  return (
    <svg className="hero-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M3 9L9 3M4 3h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLParagraphElement>(null);
  // Was the pressed item already active when the press began? Focus (and hover)
  // select an item before its click fires, so `selected` alone can't tell
  // "first tap selects" from "tap on the active item opens it".
  const pressedActive = useRef<boolean | null>(null);

  const select = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  // The arc crest sits just under the "Tbilisi" label; the canvas is sized to match.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const label = arcRef.current;
    if (!hero || !label) return;
    const measure = () => {
      const y = label.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 14;
      hero.style.setProperty("--arc-y", `${Math.round(y)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  // Phones: the services become a swipeable chip row — keep the active chip in view.
  // (On desktop the row is display: contents, so it never scrolls.)
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth + 1) return;
    const chip = list.children[active] as HTMLElement | undefined;
    if (!chip) return;
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      const motionOff = document.documentElement.getAttribute("data-motion") === "paused";
      if (motionOff) return;
      setActive((current) => (current + 1) % slides.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduce, active]);

  return (
    <section ref={heroRef} className="hero" aria-label="Beyond OS">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-atmosphere-base" />
        <div className="hero-grid">
          <EclipseHorizon bottomOffset={ARC_PAD} />
        </div>
      </div>

      <div className="wrap hero-inner">
        <div className="hero-top mono">
          <span>
            <i className="dot" /> Built in Georgia. Designed for hospitality.
          </span>
          <span>Local roots / Global thinking</span>
        </div>

        <div className="hero-stage">
          <div className="hero-copy">
            <h1>
              <span>Your hospitality.</span>
              <em>Connected.</em>
            </h1>
            <p className="hero-lead">
              Software, websites and digital growth for hotels, cottages and restaurants. One
              partner to connect the way you run and grow.
            </p>
            <div className="hero-actions">
              <Link className="hero-cta" href="#services">
                Try the product concept
                <span className="hero-cta-icon">
                  <ArrowUpRight />
                </span>
              </Link>
              <Link className="hero-link" href="/#contact">
                Request a demo <ArrowUpRight />
              </Link>
            </div>
            <p className="hero-tagline mono">Your business. One connected system.</p>
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

            <div className="hero-orbit-list" ref={listRef}>
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
                    // Hover-select for mice only; touch selects on tap.
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") select(index);
                    }}
                    onPointerDown={(event) => {
                      // A mouse has already selected on hover, so its click opens.
                      pressedActive.current = event.pointerType === "mouse" ? true : selected;
                    }}
                    onFocus={() => select(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                        event.preventDefault();
                        select(index + 1);
                      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        select(index - 1);
                      }
                    }}
                    onClick={() => {
                      // Keyboard activation has no pointerdown: fall back to `selected`.
                      const open = pressedActive.current ?? selected;
                      pressedActive.current = null;
                      if (open) router.push(`/services/${item.slug}`);
                      else select(index);
                    }}
                  >
                    <span className="hero-orbit-thumb">
                      <Image src={item.thumb} alt="" fill sizes="120px" className="hero-orbit-thumb-img" />
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

            <Link href={`/services/${slides[active].slug}`} className="hero-orbit-callout">
              <span className="hero-orbit-callout-kicker">One booking. A connected journey.</span>
              <strong>
                See {slides[active].name} <ArrowUpRight />
              </strong>
            </Link>

            <div className="hero-status mono">
              <span>{slides[active].number}</span>
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
          </div>
        </div>

        <p ref={arcRef} className="hero-arc-label mono">
          Tbilisi, Georgia <span>41.7151° N / 44.8271° E</span>
        </p>

        {/* The panel follows the highlighted service; hovering it pauses autoplay. */}
        <div
          className="hero-panel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <HeroWorkspace
            tab={TAB_FOR[slides[active].slug]}
            onTabChange={(next) => select(SERVICE_FOR[next])}
          />
        </div>

        <span className="sr-only" aria-live="polite">
          Showing {slides[active].name}
        </span>
      </div>
    </section>
  );
}
