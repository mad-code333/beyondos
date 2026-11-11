export type BillingCycle = "monthly" | "yearly";

export type PricingPlan = {
  id: "hobby" | "pro" | "expert";
  name: string;
  description: string;
  monthly: number | null;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

export const BILLING_DISCOUNT = 0.15;

export const pricingPlans: PricingPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    description: "Perfect for personal use and small projects.",
    monthly: null,
    features: [
      "1 project included",
      "Basic features to get started",
      "Community support",
    ],
    cta: "Get started",
    href: "/#contact",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Great for professionals who want more flexibility and control.",
    monthly: 49,
    features: [
      "Unlimited projects",
      "Advanced features unlocked",
      "Priority email support",
      "Team collaboration tools",
      "Regular updates included",
    ],
    cta: "Get started",
    href: "/#contact",
    popular: true,
  },
  {
    id: "expert",
    name: "Expert",
    description: "Built for teams and businesses that need performance at scale.",
    monthly: 129,
    features: [
      "Unlimited projects and users",
      "Full feature access",
      "Dedicated account manager",
      "Priority support (chat & email)",
      "Early access to new features",
    ],
    cta: "Get started",
    href: "/#contact",
  },
];

export function planPrice(plan: PricingPlan, cycle: BillingCycle): number | null {
  if (plan.monthly == null) return null;
  if (cycle === "monthly") return plan.monthly;
  return Math.round(plan.monthly * (1 - BILLING_DISCOUNT));
}

export function formatPlanPrice(plan: PricingPlan, cycle: BillingCycle): string {
  const value = planPrice(plan, cycle);
  if (value == null) return "Free";
  return String(value);
}
