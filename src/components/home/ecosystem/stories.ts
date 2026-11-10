export type EcosystemStoryId = "georgia" | "supply" | "os";

export type StoryStage = {
  id: string;
  title: string;
  caption: string;
};

export type EcosystemStory = {
  id: EcosystemStoryId;
  index: "01" | "02" | "03";
  title: string;
  category: string;
  phase: string;
  body: string;
  href: string;
  cta: string;
  external: boolean;
  headline: string;
  description: string;
  result: string;
  stages: readonly StoryStage[];
  accent: string;
  accentSoft: string;
};

export const ECOSYSTEM_STORIES: readonly EcosystemStory[] = [
  {
    id: "georgia",
    index: "01",
    title: "Beyond Georgia",
    category: "Demand",
    phase: "01 / Demand",
    body: "A Georgia-only travel platform for stays, tours, transfers and dining, so the right guests find your property with clear intent.",
    href: "https://www.beyondgeorgia.com/",
    cta: "Visit Beyond Georgia",
    external: true,
    headline: "The right guest finds your property.",
    description: "A traveler explores Georgia and reaches your property with a stay in mind.",
    result: "Your team receives a stay enquiry with dates and guest details.",
    stages: [
      { id: "discover", title: "Discover Georgia", caption: "Explore a stay across the country." },
      { id: "enquire", title: "Send an inquiry", caption: "WhatsApp, dates & guests." },
      { id: "reach", title: "Reach the property", caption: "Intent received." },
    ],
    accent: "#d4b87a",
    accentSoft: "rgba(212, 184, 122, 0.22)",
  },
  {
    id: "supply",
    index: "02",
    title: "Beyond Supply",
    category: "Cost",
    phase: "02 / Supply",
    body: "B2B ecommerce for hotels and restaurants — food, linen, amenities and equipment — so procurement is calmer than five vendor chats.",
    href: "/beyondsupply",
    cta: "Explore Beyond Supply",
    external: false,
    headline: "The property stays stocked.",
    description: "The team brings everyday purchasing into one order across categories.",
    result: "Food, linen, amenities and equipment arrive ready for service.",
    stages: [
      { id: "list", title: "List what's needed", caption: "Food · linen · amenities." },
      { id: "order", title: "Place one order", caption: "Unified procurement." },
      { id: "receive", title: "Receive supplies", caption: "Stock ready." },
    ],
    accent: "#a78bfa",
    accentSoft: "rgba(167, 139, 250, 0.22)",
  },
  {
    id: "os",
    index: "03",
    title: "Beyond OS",
    category: "Operations",
    phase: "03 / Operations",
    body: "HMS, OMS, CRM, websites and digital growth — the systems that run the desk, the pass and the direct booking path.",
    href: "/#services",
    cta: "Explore Beyond OS",
    external: false,
    headline: "The desk sees the whole stay.",
    description: "A reservation, guest message and team task come together in the workspace.",
    result: "The front desk can prepare for check-in from one guest record.",
    stages: [
      { id: "gather", title: "Gather stay details", caption: "Bookings, messages, tasks." },
      { id: "connect", title: "Connect the record", caption: "HMS, OMS and CRM." },
      { id: "ready", title: "Prepare check-in", caption: "Guest context ready." },
    ],
    accent: "#c4d0dc",
    accentSoft: "rgba(196, 208, 220, 0.22)",
  },
] as const;

export function getStory(id: EcosystemStoryId): EcosystemStory {
  return ECOSYSTEM_STORIES.find((story) => story.id === id) ?? ECOSYSTEM_STORIES[0];
}
