export type Insight = {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  art: "glow" | "bars" | "orbit";
};

export const insights: Insight[] = [
  {
    id: "crm-or-shelf",
    category: "Software",
    date: "14 Oct 2026",
    title: "Custom CRM or off-the-shelf? How to decide in 2026",
    excerpt:
      "Licence fees, workarounds and integrations add up. Here is the framework we use with clients.",
    art: "glow",
  },
  {
    id: "modern-hms",
    category: "Hospitality",
    date: "30 Sept 2026",
    title: "What a modern hotel management system should do for you",
    excerpt:
      "Reservations are table stakes. The real gains come from housekeeping, POS and guest data in one place.",
    art: "bars",
  },
  {
    id: "direct-bookings",
    category: "Growth",
    date: "12 Sept 2026",
    title: "Direct bookings: how hotels win back margin from OTAs",
    excerpt:
      "A fast site, a frictionless booking engine and a reason to book direct. The playbook, step by step.",
    art: "orbit",
  },
];
