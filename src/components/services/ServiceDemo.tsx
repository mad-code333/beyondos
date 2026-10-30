"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/content/services";

type Lead = {
  id: string;
  name: string;
  detail: string;
  value: string;
  stage: "new" | "conversation" | "confirmed";
};

const seed: Lead[] = [
  { id: "1", name: "Nino K.", detail: "Private dining · 12 guests", value: "₾1,200", stage: "new" },
  { id: "2", name: "Alex M.", detail: "Weekend stay · 2 nights", value: "₾840", stage: "new" },
  { id: "3", name: "Mariam D.", detail: "Group booking · 8 rooms", value: "₾3,600", stage: "conversation" },
  { id: "4", name: "Daniel R.", detail: "Return visit · suite", value: "₾1,440", stage: "confirmed" },
];

export function ServiceDemo({ service }: { service: Service }) {
  if (service.slug === "crm") return <CrmDemo />;
  if (service.slug === "oms") return <FlowDemo title="Table / 04" rows={["Starter · 2", "Main · 4", "Wine pairing", "Fire dessert"]} />;
  if (service.slug === "hms") return <FlowDemo title="Room / 201" rows={["Arrival 15:00", "King · sea view", "Late checkout", "Housekeeping ready"]} />;
  if (service.slug === "web") return <FlowDemo title="Still House" rows={["Rooms", "The stay", "Book direct", "Guest notes"]} />;
  return <FlowDemo title="Growth desk" rows={["Search", "Brand system", "Campaign", "Direct bookings"]} />;
}

function CrmDemo() {
  const [leads, setLeads] = useState(seed);
  const value = useMemo(
    () => leads.reduce((sum, lead) => sum + Number(lead.value.replace(/[^\d]/g, "")), 0),
    [leads],
  );

  function advance(id: string) {
    setLeads((current) =>
      current.map((lead) => {
        if (lead.id !== id || lead.stage === "confirmed") return lead;
        return { ...lead, stage: lead.stage === "new" ? "conversation" : "confirmed" };
      }),
    );
  }

  return (
    <div className="glass p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
        <span>Your guest relationships</span>
        <span>₾{value.toLocaleString()}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {(["new", "conversation", "confirmed"] as const).map((stage) => (
          <div key={stage} className="rounded-2xl border border-line bg-[#0c0c0c] p-3">
            <div className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
              {stage === "new" ? "New enquiry" : stage === "conversation" ? "In conversation" : "Confirmed"}
            </div>
            {leads
              .filter((lead) => lead.stage === stage)
              .map((lead) => (
                <div key={lead.id} className="mb-2 rounded-xl border border-line px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px]">{lead.name}</span>
                    <span className="text-[12px] text-muted">{lead.value}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{lead.detail}</div>
                  {stage !== "confirmed" ? (
                    <button
                      type="button"
                      onClick={() => advance(lead.id)}
                      className="mt-2 text-[11px] text-[#bdbdb8] hover:text-white"
                    >
                      Move forward →
                    </button>
                  ) : null}
                </div>
              ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#6f6f6f]">
        Interactive design concept · sample data
      </p>
    </div>
  );
}

function FlowDemo({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="glass p-6 md:p-8">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]">{title}</div>
      <div className="mt-6 grid gap-3">
        {rows.map((row, index) => (
          <div
            key={row}
            className="flex items-center justify-between rounded-2xl border border-line bg-[#0c0c0c] px-4 py-4"
          >
            <span>{row}</span>
            <span className="text-[11px] text-[#6f6f6f]">0{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
