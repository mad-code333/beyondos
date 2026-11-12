export type Insight = {
  id: string;
  number: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  href: string;
};

export const insights: Insight[] = [
  {
    id: "guest-journey-before-check-in",
    number: "01",
    category: "Guest experience",
    readTime: "5 min read",
    title: "The guest journey starts before check-in.",
    excerpt:
      "A guest decides how a stay will feel long before the key is in their hand. The website, the enquiry and the reply are already part of the room.",
    href: "#contact",
  },
  {
    id: "connected-kitchen",
    number: "02",
    category: "Restaurant operations",
    readTime: "6 min read",
    title: "A connected kitchen means calmer service.",
    excerpt:
      "The best dining rooms in Georgia are full for a reason. The floor, the pass and the guest should be looking at the same service, not three versions of it.",
    href: "#contact",
  },
  {
    id: "ready-before-the-door",
    number: "03",
    category: "Hotel management",
    readTime: "5 min read",
    title: "Ready before anyone is at the door.",
    excerpt:
      "Arrivals, rooms and context belong in one place. When the front desk knows what is coming, the first minute with the guest feels intentional.",
    href: "#contact",
  },
  {
    id: "stronger-brand-growth",
    number: "04",
    category: "Digital growth",
    readTime: "5 min read",
    title: "A clearer brand. A direct path to the booking.",
    excerpt:
      "Hospitality in Georgia is not short of beautiful places. It is short of properties that are easy to find, easy to trust, and easy to book without a third party in the middle.",
    href: "#contact",
  },
];
