"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import "./workspace.css";

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
    foot: "Enquiries, conversations and confirmations in one guest workspace. Add an enquiry, then move it forward.",
  },
  oms: {
    href: "/services/oms",
    label: "Explore Restaurant OMS ↗",
    foot: "Evening service, from the floor to the pass. Move each ticket from received to served.",
  },
  hms: {
    href: "/services/hms",
    label: "Explore Hotel HMS ↗",
    foot: "The room calendar and today’s arrivals, side by side. Check a guest in when the room is ready.",
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
  crm: 2,
  oms: 0,
  hms: 0,
  web: 0,
  growth: 0,
};

type Lead = {
  id: string;
  name: string;
  detail: string;
  value: string;
  stage: "new" | "conversation" | "confirmed";
};

const seedLeads: Lead[] = [
  { id: "1", name: "Nino K.", detail: "Private dining · 12 guests", value: "₾1,200", stage: "new" },
  { id: "2", name: "Alex M.", detail: "Weekend stay · 2 nights", value: "₾840", stage: "new" },
  { id: "3", name: "Mariam D.", detail: "Group booking · 8 rooms", value: "₾3,600", stage: "conversation" },
  { id: "4", name: "Daniel R.", detail: "Return visit · suite", value: "₾1,440", stage: "confirmed" },
];

type Ticket = {
  id: string;
  table: string;
  order: string;
  guests: string;
  items: string[];
  status: "received" | "preparing" | "ready" | "served";
};

const seedTickets: Ticket[] = [
  {
    id: "t1",
    table: "Table 04",
    order: "Order #204 · 4 guests",
    guests: "4",
    items: ["2 × Pkhali", "2 × Mtsvadi", "1 × Sparkling water"],
    status: "received",
  },
  {
    id: "t2",
    table: "Table 07",
    order: "Order #205 · 2 guests",
    guests: "2",
    items: ["2 × Badrijani", "2 × Khachapuri", "1 × Sparkling water"],
    status: "preparing",
  },
  {
    id: "t3",
    table: "Table 12",
    order: "Order #206 · 6 guests",
    guests: "6",
    items: ["2 × Khinkali", "2 × Chkmeruli", "1 × Sparkling water"],
    status: "ready",
  },
];

const bookings = [
  { room: "101 · Classic", name: "A. Morgan", start: 0, length: 3 },
  { room: "102 · Classic", name: "N. Giorgi", start: 2, length: 4 },
  { room: "201 · Suite", name: "D. Rivera", start: 1, length: 2 },
  { room: "202 · Suite", name: "M. Davis", start: 3, length: 3 },
  { room: "301 · Terrace", name: "S. Laurent", start: 0, length: 5 },
];

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
  const [leads, setLeads] = useState(seedLeads);
  const [tickets, setTickets] = useState(seedTickets);
  const [occupied, setOccupied] = useState(18);
  const [webStay, setWebStay] = useState(true);
  const [period, setPeriod] = useState(30);

  function selectTab(next: TabId) {
    setTab(next);
    setNavIndex(defaultNav[next]);
  }

  return (
    <div className={`workspace-demo${lockedTab ? " is-locked" : ""}`}>
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
                    {tab === "crm" ? (
                      <CrmPanel
                        leads={leads}
                        setLeads={setLeads}
                      />
                    ) : null}
                    {tab === "oms" ? (
                      <OmsPanel tickets={tickets} setTickets={setTickets} />
                    ) : null}
                    {tab === "hms" ? (
                      <HmsPanel occupied={occupied} onCheckIn={() => setOccupied((n) => Math.min(24, n + 1))} />
                    ) : null}
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
        </Reveal>
      </section>
    </div>
  );
}

function CrmPanel({
  leads,
  setLeads,
}: {
  leads: Lead[];
  setLeads: Dispatch<SetStateAction<Lead[]>>;
}) {
  const stats = useMemo(() => {
    const open = leads.filter((lead) => lead.stage !== "confirmed").length;
    const confirmed = leads.filter((lead) => lead.stage === "confirmed").length;
    const value = leads.reduce((sum, lead) => sum + Number(lead.value.replace(/[^\d]/g, "")), 0);
    return { open, confirmed, value };
  }, [leads]);

  function advance(id: string) {
    setLeads((current) =>
      current.map((lead) => {
        if (lead.id !== id) return lead;
        if (lead.stage === "new") return { ...lead, stage: "conversation" };
        if (lead.stage === "conversation") return { ...lead, stage: "confirmed" };
        return lead;
      }),
    );
  }

  function addEnquiry() {
    const next = leads.length + 1;
    setLeads((current) => [
      {
        id: String(Date.now()),
        name: `Guest ${next}`,
        detail: "New enquiry · sample",
        value: "₾680",
        stage: "new",
      },
      ...current,
    ]);
  }

  const stages = [
    { id: "new" as const, label: "New enquiry" },
    { id: "conversation" as const, label: "In conversation" },
    { id: "confirmed" as const, label: "Confirmed" },
  ];

  return (
    <>
      <div className="app-topline">
        <div>
          <h3>Your guest relationships</h3>
          <p>Every conversation. A clear next step.</p>
        </div>
        <div className="app-tools">
          <span className="pill">All enquiries</span>
          <button className="mini-btn" type="button" onClick={addEnquiry}>
            + Add enquiry
          </button>
        </div>
      </div>
      <div className="kpis">
        <Kpi delay={0.04} label="Open enquiries" value={String(stats.open).padStart(2, "0")} hint="This week" />
        <Kpi delay={0.1} label="Pipeline value" value={`₾${stats.value.toLocaleString()}`} hint="Georgian lari" />
        <Kpi delay={0.16} label="Confirmed" value={String(stats.confirmed).padStart(2, "0")} hint="Ready for the next step" />
      </div>
      <div className="pipeline">
        {stages.map((stage) => {
          const items = leads.filter((lead) => lead.stage === stage.id);
          return (
            <div key={stage.id} className="pipeline-col">
              <div className="col-label">
                <span>{stage.label}</span>
                <span>{items.length}</span>
              </div>
              {items.map((lead, index) => (
                <motion.div
                  layout
                  key={lead.id}
                  className="lead-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3, ease }}
                >
                  <strong>{lead.name}</strong>
                  <p>{lead.detail}</p>
                  <div className="lead-card-bottom">
                    <span>{lead.value}</span>
                    {stage.id !== "confirmed" ? (
                      <button
                        type="button"
                        aria-label={`Move ${lead.name} to ${stage.id === "new" ? "In conversation" : "Confirmed"}`}
                        onClick={() => advance(lead.id)}
                      >
                        →
                      </button>
                    ) : (
                      <span>✓</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

function OmsPanel({
  tickets,
  setTickets,
}: {
  tickets: Ticket[];
  setTickets: Dispatch<SetStateAction<Ticket[]>>;
}) {
  function advance(id: string) {
    setTickets((current) =>
      current.map((ticket) => {
        if (ticket.id !== id) return ticket;
        if (ticket.status === "received") return { ...ticket, status: "preparing" };
        if (ticket.status === "preparing") return { ...ticket, status: "ready" };
        if (ticket.status === "ready") return { ...ticket, status: "served" };
        return ticket;
      }),
    );
  }

  const columns = [
    { id: "received" as const, label: "Received", action: "Start preparing →" },
    { id: "preparing" as const, label: "Preparing", action: "Mark ready →" },
    { id: "ready" as const, label: "Ready", action: "Mark served ✓" },
  ];
  const active = tickets.filter((ticket) => ticket.status !== "served");

  return (
    <>
      <div className="app-topline">
        <div>
          <h3>Evening service</h3>
          <p>Floor to kitchen. Everyone in sync.</p>
        </div>
        <div className="app-tools">
          <span className="pill">
            <i className="dot" /> Kitchen view
          </span>
        </div>
      </div>
      <div className="kpis">
        <Kpi delay={0.04} label="Active orders" value={String(active.length).padStart(2, "0")} hint="On the pass" />
        <Kpi delay={0.1} label="Tables in service" value="08" hint="Dinner floor" />
        <Kpi delay={0.16} label="Service period" value="Dinner" hint="18:00 — 23:00" />
      </div>
      <div className="order-grid">
        {columns.map((column) => {
          const ticket = tickets.find((item) => item.status === column.id);
          return (
            <motion.div
              layout
              key={column.id}
              className="order-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              <span className="pill">{column.label}</span>
              {ticket ? (
                <>
                  <h4>{ticket.table}</h4>
                  <p>{ticket.order}</p>
                  <ul>
                    {ticket.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button className="mini-btn" type="button" onClick={() => advance(ticket.id)}>
                    {column.action}
                  </button>
                </>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function HmsPanel({ occupied, onCheckIn }: { occupied: number; onCheckIn: () => void }) {
  return (
    <>
      <div className="app-topline">
        <div>
          <h3>The property at a glance</h3>
          <p>Monday, 12 October · Tbilisi</p>
        </div>
        <div className="app-tools">
          <button className="mini-btn ghost" type="button">
            View arrivals
          </button>
          <button className="mini-btn" type="button" onClick={onCheckIn}>
            Check in guest
          </button>
        </div>
      </div>
      <div className="kpis">
        <Kpi delay={0.04} label="Occupied rooms" value={`${String(occupied).padStart(2, "0")} / 24`} hint="Of 24 rooms" />
        <Kpi delay={0.1} label="Arriving today" value="06" hint="Front desk view" />
        <Kpi delay={0.16} label="Rooms ready" value="04" hint="Housekeeping handoff" />
      </div>
      <div className="calendar">
        <div className="cal-row">
          {["ROOM", "MON 12", "TUE 13", "WED 14", "THU 15", "FRI 16", "SAT 17", "SUN 18"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.room}
            className="cal-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * index, duration: 0.35, ease }}
          >
            <span>{booking.room}</span>
            {Array.from({ length: 7 }).map((_, cell) => (
              <span key={cell} />
            ))}
            <div
              className="cal-book"
              style={{ ["--start" as string]: booking.start, ["--length" as string]: booking.length }}
            >
              {booking.name}
            </div>
          </motion.div>
        ))}
      </div>
    </>
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
