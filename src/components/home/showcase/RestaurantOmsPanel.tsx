"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./showcase.css";

const ease = [0.22, 1, 0.36, 1] as const;

type TableStatus = "available" | "occupied" | "ordering" | "preparing" | "ready" | "billing";

type FloorTable = { id: string; label: string; status: TableStatus };

const menu = {
  Starters: [
    { name: "Pkhali trio", price: 18 },
    { name: "Badrijani", price: 16 },
  ],
  Mains: [
    { name: "Mtsvadi", price: 32 },
    { name: "Chkmeruli", price: 36 },
    { name: "Khinkali (6)", price: 22 },
  ],
  Drinks: [
    { name: "Sparkling water", price: 6 },
    { name: "Saperavi glass", price: 14 },
  ],
} as const;

type Cat = keyof typeof menu;

const bars = [42, 58, 51, 73, 66, 88, 79];
const sellers = [
  { name: "Khinkali", sold: "46" },
  { name: "Mtsvadi", sold: "31" },
  { name: "Chkmeruli", sold: "24" },
];

export function RestaurantOmsPanel() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState<Cat>("Mains");
  const [tables, setTables] = useState<FloorTable[]>([
    { id: "t1", label: "T04", status: "available" },
    { id: "t2", label: "T07", status: "occupied" },
    { id: "t3", label: "T09", status: "preparing" },
    { id: "t4", label: "T12", status: "ready" },
    { id: "t5", label: "T14", status: "available" },
    { id: "t6", label: "T18", status: "billing" },
    { id: "t7", label: "T21", status: "available" },
    { id: "t8", label: "T24", status: "ordering" },
  ]);
  const [orderItems, setOrderItems] = useState<{ name: string; price: number; qty: number }[]>([
    { name: "Khinkali (6)", price: 22, qty: 2 },
  ]);
  const [kds, setKds] = useState([
    { id: "k1", table: "T09", order: "#204", items: ["2 × Mtsvadi", "1 × Pkhali"], status: "Preparing", active: false },
    { id: "k2", table: "T12", order: "#205", items: ["2 × Khinkali", "Chkmeruli"], status: "Ready", active: false },
    { id: "k3", table: "T07", order: "#206", items: ["Badrijani", "Water"], status: "New", active: false },
  ]);
  const [phase, setPhase] = useState(0);

  const totals = useMemo(() => {
    const sub = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(sub * 0.18);
    return { sub, tax, total: sub + tax };
  }, [orderItems]);

  useEffect(() => {
    if (reduce) {
      setPhase(4);
      return;
    }
    const timers = [
      window.setTimeout(() => {
        setPhase(1);
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "occupied" } : table)),
        );
      }, 900),
      window.setTimeout(() => {
        setPhase(2);
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "ordering" } : table)),
        );
        setOrderItems([
          { name: "Khinkali (6)", price: 22, qty: 2 },
          { name: "Mtsvadi", price: 32, qty: 1 },
          { name: "Sparkling water", price: 6, qty: 2 },
        ]);
      }, 2000),
      window.setTimeout(() => {
        setPhase(3);
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "preparing" } : table)),
        );
        setKds((current) => [
          {
            id: "k0",
            table: "T04",
            order: "#207",
            items: ["2 × Khinkali", "1 × Mtsvadi", "2 × Water"],
            status: "New",
            active: true,
          },
          ...current.map((card) => ({ ...card, active: false })),
        ]);
      }, 3200),
      window.setTimeout(() => {
        setPhase(4);
        setKds((current) =>
          current.map((card) =>
            card.id === "k0" ? { ...card, status: "Preparing", active: true } : { ...card, active: false },
          ),
        );
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "preparing" } : table)),
        );
      }, 4500),
      window.setTimeout(() => {
        setKds((current) =>
          current.map((card) =>
            card.id === "k0" ? { ...card, status: "Ready", active: true } : card,
          ),
        );
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "ready" } : table)),
        );
      }, 6000),
      window.setTimeout(() => {
        setTables((current) =>
          current.map((table) => (table.id === "t1" ? { ...table, status: "billing" } : table)),
        );
        setKds((current) =>
          current.map((card) =>
            card.id === "k0" ? { ...card, status: "Served", active: false } : card,
          ),
        );
      }, 7500),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduce]);

  function addItem(name: string, price: number) {
    setOrderItems((current) => {
      const existing = current.find((item) => item.name === name);
      if (existing) {
        return current.map((item) =>
          item.name === name ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...current, { name, price, qty: 1 }];
    });
  }

  const occupied = tables.filter((t) => t.status !== "available").length;
  const available = tables.length - occupied;

  return (
    <div className="sx">
      <div className="sx-topline">
        <div>
          <h3>From the first order to the final payment</h3>
          <p>Floor · POS · kitchen — demonstration data</p>
        </div>
        <span className="sx-badge is-demo">
          <i /> Demo preview
        </span>
      </div>

      <div className="sx-kpis">
        <Kpi label="Revenue today" value="₾4,280" hint="Dinner service" delay={0.04} accent />
        <Kpi label="Active orders" value="06" hint="On the pass" delay={0.08} />
        <Kpi label="Occupied" value={String(occupied).padStart(2, "0")} hint={`${available} available`} delay={0.12} />
        <Kpi label="Avg order" value="₾86" hint="This service" delay={0.16} />
      </div>

      <div className="sx-split">
        <motion.div
          className="sx-card"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="sx-card-head">
            <strong>Floor map</strong>
            <span>Live table status</span>
          </div>
          <div className="sx-floor" aria-label="Restaurant table map">
            {tables.map((table) => (
              <div key={table.id} className="sx-table-node" data-status={table.status}>
                <strong>{table.label}</strong>
                <span>{table.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="sx-card"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 2 ? 1 : 0.55, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="sx-card-head">
            <strong>POS · Table 04</strong>
            <span>Still House dining</span>
          </div>
          <div className="sx-pos" style={{ gridTemplateColumns: "1fr" }}>
            <div>
              <div className="sx-menu-cats">
                {(Object.keys(menu) as Cat[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`sx-chip${cat === key ? " is-active" : ""}`}
                    onClick={() => setCat(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="sx-menu-list">
                {menu[cat].map((item) => {
                  const added = orderItems.some((row) => row.name === item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      className={`sx-menu-item${added ? " is-added" : ""}`}
                      onClick={() => addItem(item.name, item.price)}
                    >
                      <span>{item.name}</span>
                      <span>₾{item.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sx-ticket">
              <h5>Order summary</h5>
              <ul>
                {orderItems.map((item) => (
                  <li key={item.name}>
                    <span>
                      {item.qty} × {item.name}
                    </span>
                    <span>₾{item.qty * item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="sx-ticket-total">
                <span>Subtotal · ₾{totals.sub}</span>
                <span>Tax · ₾{totals.tax}</span>
                <b>Total · ₾{totals.total}</b>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="sx-card"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 3 ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="sx-card-head">
          <strong>Kitchen display</strong>
          <span>Ticket flow</span>
        </div>
        <div className="sx-kds">
          {kds.slice(0, 3).map((card) => (
            <div key={card.id} className={`sx-kds-card${card.active ? " is-active" : ""}`}>
              <header>
                <span>{card.order}</span>
                <span className={`sx-status ${card.status === "Ready" ? "is-ok" : card.status === "New" ? "is-accent" : "is-warn"}`}>
                  {card.status}
                </span>
              </header>
              <h5>{card.table}</h5>
              <ul>
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sx-card"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.1 }}
      >
        <div className="sx-card-head">
          <strong>Service reporting</strong>
          <span>Sample week</span>
        </div>
        <div className="sx-report">
          <div>
            <div className="sx-bars" aria-hidden="true">
              {bars.map((height, index) => (
                <div key={index} className="sx-bar" style={{ height: `${height}%` }} />
              ))}
            </div>
            <p className="sx-disclaimer">Revenue trend · demonstration chart</p>
          </div>
          <div className="sx-sellers">
            <div className="sx-card-head" style={{ marginBottom: 4 }}>
              <strong>Best sellers</strong>
            </div>
            {sellers.map((row) => (
              <div key={row.name} className="sx-seller">
                <span>{row.name}</span>
                <span>{row.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  delay = 0,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      className={`sx-kpi${accent ? " is-accent" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease }}
    >
      <span>{label}</span>
      <b>{value}</b>
      <small>{hint}</small>
    </motion.div>
  );
}
