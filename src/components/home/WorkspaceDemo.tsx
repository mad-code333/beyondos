"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ConnectedJourney } from "./showcase/ConnectedJourney";
import { HotelCrmPanel } from "./showcase/HotelCrmPanel";
import { HotelHmsPanel } from "./showcase/HotelHmsPanel";
import { RestaurantOmsPanel } from "./showcase/RestaurantOmsPanel";
import "./workspace.css";

const introTiles = [
  { key: "desk", src: "/media/desk.jpg", caption: "Desk" },
  { key: "floor", src: "/media/dining.jpg", caption: "Floor" },
  { key: "stay", src: "/media/suite.jpg", caption: "Stay" },
] as const;

type TabId = "crm" | "oms" | "hms" | "web" | "growth";

const tabs: { id: TabId; label: string }[] = [
  { id: "crm", label: "CRM" },
  { id: "oms", label: "OMS" },
  { id: "hms", label: "HMS" },
  { id: "web", label: "WEB" },
  { id: "growth", label: "GROWTH" },
];

const explore: Record<TabId, { href: string; label: string; foot: string }> = {
  crm: {
    href: "/services/crm",
    label: "Explore CRM ↗",
    foot: "Guest profiles, pipeline and an operations assistant preview — so the desk starts with context.",
  },
  oms: {
    href: "/services/oms",
    label: "Explore Restaurant OMS ↗",
    foot: "Floor map, POS and kitchen display moving through one service — from seating to settlement.",
  },
  hms: {
    href: "/services/hms",
    label: "Explore Hotel HMS ↗",
    foot: "Arrivals, reservations and housekeeping readiness in one front-desk picture of the property.",
  },
  web: {
    href: "/services/web",
    label: "Explore Web Development ↗",
    foot: "A hospitality website that can speak for a stay or a dining room. Switch between the two.",
  },
  growth: {
    href: "/services/growth",
    label: "Explore Digital Growth ↗",
    foot: "Search, content and direct enquiries in one view. Change the window to read the trend.",
  },
};

const nav: Record<TabId, { label: string; active?: boolean }[]> = {
  crm: [
    { label: "Overview" },
    { label: "Guest directory" },
    { label: "Sales pipeline", active: true },
    { label: "Conversations" },
    { label: "Automations" },
  ],
  oms: [
    { label: "Service overview", active: true },
    { label: "Tables & orders" },
    { label: "Kitchen display" },
    { label: "Menu" },
    { label: "Reports" },
  ],
  hms: [
    { label: "Property overview", active: true },
    { label: "Reservations" },
    { label: "Room calendar" },
    { label: "Housekeeping" },
    { label: "Guests" },
  ],
  web: [
    { label: "Design overview", active: true },
    { label: "Pages" },
    { label: "Components" },
    { label: "Content" },
    { label: "Preview" },
  ],
  growth: [
    { label: "Growth overview", active: true },
    { label: "Brand studio" },
    { label: "Campaigns" },
    { label: "Content" },
    { label: "Reporting" },
  ],
};

const icons = ["◈", "▤", "▦", "◎", "⌘"];

const defaultNav: Record<TabId, number> = {
  crm: 0,
  oms: 0,
  hms: 0,
  web: 0,
  growth: 0,
};

const growthPath =
  "M30 140L90 125L150 130L210 105L270 112L330 80L390 95L450 65L510 70L570 45L630 50L690 25";

const ease = [0.22, 1, 0.36, 1] as const;

export function WorkspaceDemo({
  lockedTab,
  pill,
}: {
  lockedTab?: TabId;
  pill?: string;
} = {}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<TabId>(lockedTab ?? "crm");
  const [navIndex, setNavIndex] = useState(defaultNav[lockedTab ?? "crm"]);
  const [webStay, setWebStay] = useState(true);
  const [period, setPeriod] = useState(30);

  function selectTab(next: TabId) {
    setTab(next);
    setNavIndex(defaultNav[next]);
  }

  return (
    <div className={`workspace-demo${lockedTab ? " is-locked" : ""}`}>
      {!lockedTab ? (
        <section className="intro" aria-label="Built for the everyday">
          <div className="wrap">
            <div className="intro-grid">
            <div className="intro-copy">
              <Reveal y={22}>
                <div className="mono">01 / Built for the everyday</div>
              </Reveal>
              <Reveal delay={0.08} y={22}>
                <h2>
                  Your business
                  <br />
                  has enough
                  <br />
                  moving parts.
                  <span>
                    Your technology
                    <br />
                    should bring
                    <br />
                    them together.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.16} y={18}>
                <p className="intro-note">
                  One partner for the systems that run the property and the experiences that welcome
                  the guest — designed to feel considered, not complicated.
                </p>
              </Reveal>
            </div>

            <motion.div
              className="intro-visual"
              aria-hidden="true"
              style={{ width: "100%" }}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, ease }}
            >
              <div className="intro-visual-glow" />
              {introTiles.map((tile, index) => (
                <motion.figure
                  key={tile.key}
                  className={`intro-tile intro-tile-${["a", "b", "c"][index]}`}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.1 + index * 0.08 }}
                >
                  <span className="intro-tile-media">
                    <Image
                      src={tile.src}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 70vw, 360px"
                      className="intro-tile-img"
                    />
                  </span>
                  <span className="intro-tile-veil" />
                  <figcaption className="mono">{tile.caption}</figcaption>
                </motion.figure>
              ))}
              <div className="intro-visual-caption mono">Operations · Experience · Growth</div>
            </motion.div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={`${lockedTab ? "" : "wrap "}demo-section`} id={lockedTab ? undefined : "workspace"}>
        <Reveal>
          <div className="demo-top">
            <span className="ws-kicker">The workspace</span>
            {lockedTab ? (
              <span className="pill">{pill ?? `${explore[tab].label.replace("Explore ", "").replace(" ↗", "")} · Interactive preview`}</span>
            ) : (
              <LayoutGroup>
                <div
                  className="ws-tabs"
                  role="tablist"
                  aria-label="Product demo"
                  onKeyDown={(event) => {
                    const index = tabs.findIndex((item) => item.id === tab);
                    if (index < 0) return;
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      selectTab(tabs[(index + 1) % tabs.length].id);
                    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      selectTab(tabs[(index - 1 + tabs.length) % tabs.length].id);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      selectTab(tabs[0].id);
                    } else if (event.key === "End") {
                      event.preventDefault();
                      selectTab(tabs[tabs.length - 1].id);
                    }
                  }}
                >
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      role="tab"
                      type="button"
                      aria-selected={tab === item.id}
                      tabIndex={tab === item.id ? 0 : -1}
                      onClick={() => selectTab(item.id)}
                    >
                      {tab === item.id ? (
                        <motion.span
                          layoutId="workspace-tab-pill"
                          className="ws-tab-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative z-[1]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            )}
          </div>

          <motion.div
            className="demo-frame"
            initial={reduce ? false : { opacity: 0, y: 28, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 2 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            style={{ transformPerspective: 1600 }}
          >
            <div className="browser-bar">
              <div className="traffic">
                <i />
                <i />
                <i />
              </div>
              <span>workspace.beyondos · {tab}</span>
              <div className="ws-kicker">Beyond OS</div>
            </div>

            <div className="app-layout">
              <aside className="app-sidebar">
                <Link
                  className="wordmark"
                  href={explore[tab].href}
                  aria-label="Beyond OS home"
                >
                  <span className="brand-icon">b</span>
                  beyond
                  <span className="os">OS</span>
                </Link>
                {(nav[tab] ?? []).map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`side-item${index === navIndex ? " active" : ""}`}
                    onClick={() => setNavIndex(index)}
                  >
                    {icons[index]} &nbsp; {item.label}
                  </button>
                ))}
                <div className="side-bottom">
                  <span className="avatar">BG</span>
                  <div>
                    Beyond workspace
                    <br />
                    <small>Hospitality team</small>
                  </div>
                </div>
              </aside>

              <div className="app-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    {tab === "crm" ? <HotelCrmPanel /> : null}
                    {tab === "oms" ? <RestaurantOmsPanel /> : null}
                    {tab === "hms" ? <HotelHmsPanel /> : null}
                    {tab === "web" ? (
                      <WebPanel stay={webStay} onToggle={() => setWebStay((value) => !value)} />
                    ) : null}
                    {tab === "growth" ? (
                      <GrowthPanel
                        period={period}
                        onCycle={() => setPeriod((value) => (value === 7 ? 30 : value === 30 ? 90 : 7))}
                        reduce={Boolean(reduce)}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="demo-foot">
            <p>{explore[tab].foot}</p>
            <Link className="text-link" href={explore[tab].href}>
              {explore[tab].label}
            </Link>
          </div>

          {!lockedTab ? <ConnectedJourney /> : null}
        </Reveal>
      </section>
    </div>
  );
}

function WebPanel({ stay, onToggle }: { stay: boolean; onToggle: () => void }) {
  return (
    <>
      <div className="app-topline">
        <div>
          <h3>A new digital front door</h3>
          <p>Desktop preview · Hospitality website</p>
        </div>
        <button className="mini-btn" type="button" onClick={onToggle}>
          {stay ? "View the restaurant ↗" : "View the stay ↗"}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stay ? "stay" : "restaurant"}
          className="web-demo"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
        >
          <nav>
            <strong>{stay ? "STILL HOUSE" : "TABLE / 07"}</strong>
            <span>{stay ? "Stay · Discover  Contact" : "Menu · Reserve  Contact"}</span>
          </nav>
          <h3>
            {stay ? (
              <>
                Some places.
                <br />
                You just feel.
              </>
            ) : (
              <>
                Good service.
                <br />
                Behind the scenes.
              </>
            )}
          </h3>
          <p>
            {stay
              ? "A mountain stay. Rooms with a sense of place, and a direct path to enquire."
              : "A dining room with a calm floor, a clear menu, and a table worth booking."}
          </p>
          <button className="mini-btn" type="button">
            {stay ? "Explore the rooms →" : "Reserve a table →"}
          </button>
          <div className="arch" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function GrowthPanel({
  period,
  onCycle,
  reduce,
}: {
  period: number;
  onCycle: () => void;
  reduce: boolean;
}) {
  const visits = period === 7 ? "1,180" : period === 30 ? "4,160" : "11,420";
  const enquiries = period === 7 ? "18" : period === 30 ? "62" : "164";

  return (
    <>
      <div className="app-topline">
        <div>
          <h3>A clearer view of growth</h3>
          <p>Search, social and direct · This property</p>
        </div>
        <button className="mini-btn ghost" type="button" onClick={onCycle}>
          Last {period} days ⌄
        </button>
      </div>
      <div className="kpis">
        <Kpi delay={0.04} label="Website visits" value={visits} hint="Organic and direct" />
        <Kpi delay={0.1} label="Qualified enquiries" value={enquiries} hint="Stays and tables" />
        <Kpi delay={0.16} label="Active channels" value="03" hint="Search · Social · Direct" />
      </div>
      <svg
        className="growth-chart"
        viewBox="0 0 700 170"
        role="img"
        aria-label="Website visits over the selected period"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#fff" stopOpacity=".16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M30 35H690" stroke="#ffffff13" />
        <path d="M30 75H690" stroke="#ffffff13" />
        <path d="M30 115H690" stroke="#ffffff13" />
        <path d="M30 155H690" stroke="#ffffff13" />
        <motion.path
          d={`${growthPath}V160H30Z`}
          fill="url(#chartFill)"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
        />
        <motion.path
          className="line"
          d={growthPath}
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        {reduce ? null : <path className="line-glow" d={growthPath} />}
        {reduce ? null : (
          <circle className="growth-dot" r="3.5">
            <animateMotion dur="3.6s" repeatCount="indefinite" path={growthPath} />
          </circle>
        )}
        <text x="30" y="169">
          WEEK 01
        </text>
        <text x="330" y="169">
          WEEK 03
        </text>
        <text x="640" y="169">
          WEEK 04
        </text>
      </svg>
      <div className="chart-stats">
        <span>○ Search & discovery</span>
        <span>○ Campaign engagement</span>
        <span>○ Direct enquiries</span>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: string;
  hint: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="kpi"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease }}
    >
      <span>{label}</span>
      <b>{value}</b>
      <small>{hint}</small>
    </motion.div>
  );
}
