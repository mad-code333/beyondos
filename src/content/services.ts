export type ServiceSlug = "crm" | "oms" | "hms" | "web" | "growth";

export type Service = {
  slug: ServiceSlug;
  number: string;
  icon: string;
  shortName: string;
  name: string;
  category: string;
  tagline: string;
  heroTitle: string;
  heroLead: string;
  summary: string;
  features: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  demoLabel: string;
  navLabel: string;
};

export const services: Service[] = [
  {
    slug: "crm",
    number: "01",
    icon: "◎",
    shortName: "CRM",
    name: "CRM",
    category: "Customer Relationship Management",
    tagline: "Every relationship. Made personal.",
    heroTitle: "Turn a first hello. Into a lasting relationship.",
    heroLead:
      "Bring guest profiles, enquiries and follow-ups into one clear workspace. Give your team the context to make every conversation feel personal.",
    summary: "Guest relationships, enquiries and follow-ups. All in one place.",
    features: [
      {
        title: "One guest profile",
        body: "Keep contact details, preferences and conversation notes together, so the next interaction starts with context.",
      },
      {
        title: "A clearer pipeline",
        body: "See new enquiries, active conversations and confirmed opportunities without losing the next step.",
      },
      {
        title: "Follow-ups that flow",
        body: "Explore reminders and repeatable workflows that help your team stay in touch at the right moment.",
      },
    ],
    steps: [
      {
        title: "Map the relationship",
        body: "Start with your priorities, people and current workflow.",
      },
      {
        title: "Design the workspace",
        body: "Shape a practical experience and review it together.",
      },
      {
        title: "Connect the next step",
        body: "Agree the next steps, implementation scope and handover.",
      },
    ],
    demoLabel: "Guest relationships & sales",
    navLabel: "Every relationship.",
  },
  {
    slug: "oms",
    number: "02",
    icon: "▤",
    shortName: "Restaurant OMS",
    name: "Restaurant OMS",
    category: "Restaurant Order Management",
    tagline: "Every order. In perfect rhythm.",
    heroTitle: "From the floor to the kitchen. In one calm flow.",
    heroLead:
      "Give every team a shared view of tables, tickets and timing. Clear orders. Thoughtful handoffs. A calmer service.",
    summary: "Tables, orders and kitchen workflows for a calmer service.",
    features: [
      {
        title: "Floor awareness",
        body: "See table status, open tickets and pacing so the room and the pass stay aligned.",
      },
      {
        title: "Kitchen clarity",
        body: "Route orders with timing and modifiers that reduce noise during peak service.",
      },
      {
        title: "Service overview",
        body: "Spot bottlenecks early and keep guests moving without rushing the experience.",
      },
    ],
    steps: [
      {
        title: "Map the service",
        body: "Walk the floor, pass and handover points that define your rhythm.",
      },
      {
        title: "Design the flow",
        body: "Shape screens and states around how your team actually works.",
      },
      {
        title: "Launch & refine",
        body: "Roll out with training, then tune timing and views after real service.",
      },
    ],
    demoLabel: "Restaurant order management",
    navLabel: "Every order.",
  },
  {
    slug: "hms",
    number: "03",
    icon: "▦",
    shortName: "Hotel HMS",
    name: "Hotel HMS",
    category: "Hotel Management System",
    tagline: "Every stay. From enquiry to arrival.",
    heroTitle: "Reservations, rooms and the guest journey. Connected.",
    heroLead:
      "Manage availability, arrivals and in-stay needs in one property workspace built for hospitality teams.",
    summary: "Reservations, room availability and the entire guest journey.",
    features: [
      {
        title: "Availability that holds",
        body: "Keep rooms, rates and blocks clear so the front desk trusts what they see.",
      },
      {
        title: "Arrival readiness",
        body: "Give housekeeping and reception the same view of who is coming and what they need.",
      },
      {
        title: "Guest journey continuity",
        body: "Carry preferences and notes from booking through checkout without spreadsheet gaps.",
      },
    ],
    steps: [
      {
        title: "Map the property",
        body: "Understand inventory, channels and the guest touchpoints that matter most.",
      },
      {
        title: "Design the stay OS",
        body: "Shape reservation, arrival and housekeeping views around your team.",
      },
      {
        title: "Connect & grow",
        body: "Link website, CRM and growth so each stay feeds the next booking.",
      },
    ],
    demoLabel: "Hotel & property management",
    navLabel: "Every stay.",
  },
  {
    slug: "web",
    number: "04",
    icon: "⌘",
    shortName: "Web Development",
    name: "Web Development",
    category: "Websites & Digital Experiences",
    tagline: "Your digital front door.",
    heroTitle: "A website with a sense of place. And a clear next step.",
    heroLead:
      "Distinctive hospitality websites, thoughtful journeys and interfaces that turn curiosity into bookings and enquiries.",
    summary: "Distinctive websites, clear journeys and thoughtful interfaces.",
    features: [
      {
        title: "Brand-led craft",
        body: "Typography, space and imagery that feel like the property — not a template.",
      },
      {
        title: "Journeys that convert",
        body: "Structure rooms, menus and stories so guests always know what to do next.",
      },
      {
        title: "Built to connect",
        body: "Wire forms, booking and CRM so the website starts conversations your team can finish.",
      },
    ],
    steps: [
      {
        title: "Discover the brand",
        body: "Capture voice, audience and the experience guests should feel online.",
      },
      {
        title: "Design the journey",
        body: "Prototype key pages and paths before a single production build.",
      },
      {
        title: "Ship & measure",
        body: "Launch with analytics and iterate on the pages that move enquiries.",
      },
    ],
    demoLabel: "Websites & digital experiences",
    navLabel: "Your digital front door.",
  },
  {
    slug: "growth",
    number: "05",
    icon: "↗",
    shortName: "Digital Growth",
    name: "Digital Growth",
    category: "Growth, Marketing & Branding",
    tagline: "Your next chapter.",
    heroTitle: "Brand, search and campaigns. Tuned for hospitality.",
    heroLead:
      "Build a clearer brand, stronger search presence and campaigns that bring the right guests back again.",
    summary: "Branding, search, content and campaigns for hospitality.",
    features: [
      {
        title: "Brand that holds",
        body: "Positioning, visual system and voice that travel from website to floor.",
      },
      {
        title: "Search & content",
        body: "Pages and stories that help travelers and locals find you for the right reasons.",
      },
      {
        title: "Campaigns with craft",
        body: "Seasonal pushes and always-on channels measured against real enquiries — not vanity metrics.",
      },
    ],
    steps: [
      {
        title: "Audit the signal",
        body: "Review brand, channels and where demand is leaking today.",
      },
      {
        title: "Set the system",
        body: "Align messaging, creative and measurement around your offer.",
      },
      {
        title: "Grow in loops",
        body: "Ship campaigns, read the signal, refine the next chapter.",
      },
    ],
    demoLabel: "Digital growth & branding",
    navLabel: "Your next chapter.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(slug: ServiceSlug, limit = 3): Service[] {
  return services.filter((service) => service.slug !== slug).slice(0, limit);
}
