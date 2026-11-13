/**
 * Pricing is scoped, not tiered by seats: start with one service, connect a
 * few, or run the whole system. Every plan is quoted after Discovery (see the
 * "Ways of working" section), so there are no list prices here.
 */
export type PricingPlan = {
  id: "single" | "connected" | "complete";
  /** Small gold label above the name. */
  scope: string;
  name: string;
  description: string;
  priceLabel: string;
  priceNote: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "single",
    scope: "1 service",
    name: "Start with one",
    description: "The service that hurts most today: CRM, OMS, HMS, a website or growth.",
    priceLabel: "Fixed quote",
    priceNote: "After a 1–2 week Discovery",
    features: [
      "One Beyond OS service, scoped in Discovery",
      "Set up around the tools you already use",
      "Staff training on real work",
      "30 days of support after launch",
    ],
    cta: "Start with one",
    href: "/#contact",
  },
  {
    id: "connected",
    scope: "2–3 services",
    name: "Connected",
    description: "A few services sharing one guest record, so nothing is typed twice.",
    priceLabel: "Fixed quote",
    priceNote: "Delivered in phases, one team",
    features: [
      "One shared guest profile across services",
      "Website enquiries straight into the CRM",
      "One team and one timeline for every phase",
      "Named support channel, including WhatsApp",
      "Monthly check-in after launch",
    ],
    cta: "Plan a connected setup",
    href: "/#contact",
    popular: true,
  },
  {
    id: "complete",
    scope: "All 5 services",
    name: "Complete OS",
    description: "CRM, OMS, HMS, web and growth, running as one system for the property.",
    priceLabel: "Fixed quote",
    priceNote: "With an ongoing Run & Support plan",
    features: [
      "Every service, connected from day one",
      "One booking, one connected guest journey",
      "A dedicated product lead",
      "Priority fixes in high season",
      "Quarterly roadmap review",
    ],
    cta: "Talk about the full system",
    href: "/#contact",
  },
];

/** Short facts shown under the plans. */
export const pricingNotes = [
  "Every plan starts with Discovery",
  "Quotes in GEL, USD or EUR",
  "Run & Support available on every plan",
];
