"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Lead = {
  id: string;
  name: string;
  detail: string;
  value: string;
  stage: "new" | "conversation" | "confirmed";
};

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Nino K.",
    detail: "Private dining · 12 guests",
    value: "₾1,200",
    stage: "new",
  },
  {
    id: "2",
    name: "Alex M.",
    detail: "Weekend stay · 2 nights",
    value: "₾840",
    stage: "new",
  },
  {
    id: "3",
    name: "Mariam D.",
    detail: "Group booking · 8 rooms",
    value: "₾3,600",
    stage: "conversation",
  },
  {
    id: "4",
    name: "Daniel R.",
    detail: "Return visit · suite",
    value: "₾1,440",
    stage: "confirmed",
  },
];

const tabs = [
  { id: "crm", label: "CRM" },
  { id: "oms", label: "OMS" },
  { id: "hms", label: "HMS" },
] as const;

export function WorkspaceDemo() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("crm");
  const [leads, setLeads] = useState(initialLeads);

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

  return (
    <section className="section-pad border-t border-line" id="workspace">
      <Container>
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            01 / Built for the everyday
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-[-0.04em] text-[#f1f1ee] md:text-5xl">
            Your business has enough moving parts.
            <span className="mt-2 block text-[#bdbdb8]">
              Your technology should bring them together.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="glass overflow-hidden p-3 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="tabs inline-flex gap-1 rounded-full border border-line bg-white/[0.01] p-1">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition ${
                      tab === item.id
                        ? "bg-white/10 text-white"
                        : "text-[#8a8a86] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                workspace.beyondos · {tab} · demo environment
              </span>
            </div>

            {tab === "crm" ? (
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-line bg-[#0c0c0c] p-5">
                  <h3 className="text-xl tracking-[-0.03em]">Your guest relationships</h3>
                  <p className="mt-2 text-[13px] text-muted">
                    Every conversation. A clear next step.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <Stat label="Open enquiries" value={String(stats.open).padStart(2, "0")} />
                    <Stat label="Pipeline value" value={`₾${stats.value.toLocaleString()}`} />
                    <Stat label="Confirmed" value={String(stats.confirmed).padStart(2, "0")} />
                  </div>
                  <button
                    type="button"
                    onClick={addEnquiry}
                    className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-[12px] text-[#d8d8d4] transition hover:bg-soft"
                  >
                    + Add enquiry
                  </button>
                  <p className="mt-6 text-[12px] text-muted">
                    Move a lead through the sample pipeline. Add a new enquiry and see how a
                    connected guest workspace could feel.
                  </p>
                  <Button href="/services/crm" className="mt-5">
                    Explore CRM ↗
                  </Button>
                </div>

                <div className="grid gap-3">
                  {(["new", "conversation", "confirmed"] as const).map((stage) => (
                    <div key={stage} className="rounded-2xl border border-line bg-[#0c0c0c] p-4">
                      <div className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[#8a8a86]">
                        {stage === "new"
                          ? "New enquiry"
                          : stage === "conversation"
                            ? "In conversation"
                            : "Confirmed"}
                      </div>
                      <div className="grid gap-2">
                        {leads
                          .filter((lead) => lead.stage === stage)
                          .map((lead) => (
                            <motion.div
                              layout
                              key={lead.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-soft px-3 py-3"
                            >
                              <div>
                                <div className="text-[13px] text-[#f1f1ee]">{lead.name}</div>
                                <div className="text-[11px] text-muted">{lead.detail}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[12px] text-[#d8d8d4]">{lead.value}</span>
                                {stage !== "confirmed" ? (
                                  <button
                                    type="button"
                                    onClick={() => advance(lead.id)}
                                    className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted hover:text-white"
                                  >
                                    →
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-[#8fbf8f]">✓</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-[#0c0c0c] p-8 md:p-12">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]">
                  Interactive concept
                </p>
                <h3 className="mt-3 text-3xl tracking-[-0.04em]">
                  {tab === "oms" ? "Floor · kitchen · guest" : "Rooms · arrivals · readiness"}
                </h3>
                <p className="mt-3 max-w-xl text-[14px] text-muted">
                  {tab === "oms"
                    ? "A restaurant OMS concept for shared table status, ticket timing and calmer handoffs."
                    : "A hotel HMS concept for availability, arrivals and guest context in one property view."}
                </p>
                <Button
                  href={tab === "oms" ? "/services/oms" : "/services/hms"}
                  className="mt-8"
                >
                  Explore {tab.toUpperCase()} ↗
                </Button>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-soft p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] text-[#6f6f6f]">{label}</div>
      <div className="mt-2 text-lg tracking-[-0.03em]">{value}</div>
    </div>
  );
}
