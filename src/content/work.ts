export type WorkItem = {
  id: string;
  kind: "case" | "concept";
  eyebrow: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  metric?: { label: string; value: string };
  accent: string;
};

export const workItems: WorkItem[] = [
  {
    id: "still-house",
    kind: "case",
    eyebrow: "Concept study / Hospitality",
    title: "Still House · Boutique stays",
    subtitle: "A slower kind of stay.",
    summary: "A digital experience with a sense of place — from discovery to arrival.",
    tags: ["Website concept", "Guest journey", "HMS"],
    metric: { label: "Journey", value: "Enquiry → arrival" },
    accent: "from-[#2a2620] to-[#12110f]",
  },
  {
    id: "table-07",
    kind: "case",
    eyebrow: "Concept study / Restaurants",
    title: "Table / 07 · Restaurant workspace",
    subtitle: "Good service. Behind the scenes.",
    summary: "Floor → kitchen → guest — a service that moves as one.",
    tags: ["Restaurant OMS", "Brand direction", "Digital presence"],
    metric: { label: "Flow", value: "Floor → kitchen" },
    accent: "from-[#1e2420] to-[#0f1210]",
  },
  {
    id: "guest-pipeline",
    kind: "concept",
    eyebrow: "Selected work / CRM",
    title: "Connected guest pipeline",
    subtitle: "Enquiries that never go cold.",
    summary: "A hospitality CRM concept that keeps every conversation one step from confirmed.",
    tags: ["CRM", "Pipeline", "Follow-ups"],
    accent: "from-[#222428] to-[#101114]",
  },
  {
    id: "property-os",
    kind: "concept",
    eyebrow: "Selected work / HMS",
    title: "Property operations desk",
    subtitle: "Rooms, arrivals, readiness.",
    summary: "A hotel workspace concept for availability, housekeeping and guest context.",
    tags: ["HMS", "Operations", "Front desk"],
    accent: "from-[#242028] to-[#121014]",
  },
];
