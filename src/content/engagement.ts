export type EngagementPlan = {
  id: "starter" | "growth" | "custom";
  name: string;
  description: string;
  priceLabel: string;
  priceNote: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

export const engagementPlans: EngagementPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description:
      "Perfect for one clear problem — CRM follow-ups, a focused website, or OMS for a single room.",
    priceLabel: "Scoped",
    priceNote: "Fixed after discovery",
    features: [
      "Discovery workshop with your desk or floor lead",
      "One Beyond OS capability scoped and launched",
      "Team training on real work, not slides",
      "30 days of support after go-live",
    ],
    cta: "Get started",
    href: "/contact?interest=starter",
  },
  {
    id: "growth",
    name: "Growth",
    description:
      "Great for hotels or restaurants connecting two systems — HMS + CRM, or Web + Growth.",
    priceLabel: "From ₾8,500",
    priceNote: "/ month · sample",
    features: [
      "Everything in Starter, for a defined bundle",
      "Integrations between the chosen tools",
      "WhatsApp / enquiry path wired to CRM",
      "Monthly check-in for the first quarter",
    ],
    cta: "Get started",
    href: "/contact?interest=growth",
    popular: true,
  },
  {
    id: "custom",
    name: "Custom",
    description:
      "Built for groups, multi-property, or workflows no off-the-shelf tool fits.",
    priceLabel: "On request",
    priceNote: "After discovery",
    features: [
      "Custom software or deep integrations",
      "Phased rollout across properties",
      "Security review and role design",
      "Named partner contact",
    ],
    cta: "Get started",
    href: "/contact?interest=custom",
  },
];
