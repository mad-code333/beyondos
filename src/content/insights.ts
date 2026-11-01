export type Insight = {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  art: "sheets" | "ring" | "bars";
  href: string;
};

export const insights: Insight[] = [
  {
    id: "guest-journey-before-check-in",
    category: "Guest experience",
    readTime: "6 min read",
    title: "The guest journey starts before check-in.",
    excerpt:
      "A guest decides how a stay will feel long before the key is in their hand. The website, the enquiry and the reply are already part of the room.",
    art: "sheets",
    href: "#contact",
  },
  {
    id: "connected-kitchen",
    category: "Restaurant operations",
    readTime: "5 min read",
    title: "A connected kitchen is a calmer service.",
    excerpt:
      "The best dining rooms in Georgia are full for a reason. The floor, the pass and the guest should be looking at the same service, not three versions of it.",
    art: "ring",
    href: "#contact",
  },
  {
    id: "stronger-brand-growth",
    category: "Brand & digital",
    readTime: "7 min read",
    title: "A clearer brand. A direct path to the booking.",
    excerpt:
      "Hospitality in Georgia is not short of beautiful places. It is short of properties that are easy to find, easy to trust, and easy to book without a third party in the middle.",
    art: "bars",
    href: "#contact",
  },
];
