export type ServiceSlug = "crm" | "oms" | "hms" | "web" | "growth";

export type Service = {
  slug: ServiceSlug;
  number: string;
  icon: string;
  shortName: string;
  name: string;
  category: string;
  code: string;
  tagline: string;
  heroLine: string;
  heroEm: string;
  heroTitle: string;
  heroLead: string;
  heroImage: string;
  heroAlt: string;
  conceptLine: string;
  conceptEm: string;
  workspacePill: string;
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
    code: "CRM",
    tagline: "Every relationship, remembered.",
    heroLine: "Turn a first hello",
    heroEm: "into a guest you know.",
    heroTitle: "Turn a first hello into a guest you know.",
    heroLead:
      "Profiles, enquiries and follow-ups in one workspace, so the next conversation starts with what was already said.",
    heroImage: "/media/desk.jpg",
    heroAlt: "A hotel reception desk in stone and warm lamplight, before the first guest.",
    conceptLine: "Every relationship",
    conceptEm: "remembered.",
    workspacePill: "CRM · Interactive preview",
    summary: "Guest profiles, enquiries and follow-ups, held in one place.",
    features: [
      {
        title: "One guest profile",
        body: "Contact details, preferences and the last conversation, together, so the next reply starts with context.",
      },
      {
        title: "A clearer pipeline",
        body: "New enquiries, open conversations and confirmed stays, with the next step still attached.",
      },
      {
        title: "Follow-ups that land",
        body: "A reminder when a promise was made, so Tuesday’s note is still there on Friday.",
      },
    ],
    steps: [
      {
        title: "Map the relationship",
        body: "We start with how enquiries arrive, who answers, and where a promise gets lost between the inbox and the desk.",
      },
      {
        title: "Design the workspace",
        body: "Profiles, pipeline and follow-ups, laid out the way your team already talks about a guest.",
      },
      {
        title: "Connect the next step",
        body: "The website, the reservation and the profile share the same facts, so a guest never has to repeat them.",
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
    code: "OMS",
    tagline: "Every order, in sync.",
    heroLine: "From the first order",
    heroEm: "to the last plate.",
    heroTitle: "From the first order to the last plate.",
    heroLead:
      "A shared view of the floor, the ticket and the pass, so the room and the kitchen move through service together.",
    heroImage: "/media/kitchen.jpg",
    heroAlt: "The pass between a restaurant kitchen and the dining room, plates ready.",
    conceptLine: "Every order",
    conceptEm: "in sync.",
    workspacePill: "Restaurant OMS · Interactive preview",
    summary: "Tables, orders and the kitchen, on one picture of service.",
    features: [
      {
        title: "A live service view",
        body: "Tables and open orders in one picture the floor and the kitchen can both read.",
      },
      {
        title: "A handoff the pass can trust",
        body: "Each ticket moves from received to preparing to ready, with the table, the covers and the note still on it.",
      },
      {
        title: "A close that holds",
        body: "The shift is already summarised when service ends, so the morning is not spent reconstructing the night.",
      },
    ],
    steps: [
      {
        title: "Map the service",
        body: "We sit with a real service: how an order is taken, where it is shouted, and what the pass still has to ask.",
      },
      {
        title: "Configure the floor",
        body: "Tables, courses and the notes that change a dish, set up so the ticket matches the room.",
      },
      {
        title: "Rehearse the handoff",
        body: "Floor and kitchen run the same states — received, preparing, ready, served — before a full night depends on it.",
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
    code: "HMS",
    tagline: "Every stay, connected.",
    heroLine: "More room for the guest.",
    heroEm: "Less for the workaround.",
    heroTitle: "More room for the guest. Less for the workaround.",
    heroLead:
      "Reservations, room readiness and the guest’s notes in one workspace, so the desk is ready before anyone is at the door.",
    heroImage: "/media/suite.jpg",
    heroAlt: "A boutique hotel bedroom in morning light, linen and a chair by the window.",
    conceptLine: "Every stay",
    conceptEm: "connected.",
    workspacePill: "Hotel HMS · Interactive preview",
    summary: "Reservations, rooms and the guest journey, from enquiry to departure.",
    features: [
      {
        title: "One reservation view",
        body: "Availability and upcoming stays on a calendar the front desk can use during a check-in, not only after it.",
      },
      {
        title: "The guest, already known",
        body: "Arrival time, preferences and the note from the first message, waiting at the desk.",
      },
      {
        title: "Rooms, ready to receive",
        body: "Housekeeping and the front desk share one list of what is ready and what is not.",
      },
    ],
    steps: [
      {
        title: "Understand the property",
        body: "Rooms, arrivals and the tools already in use — channel manager, payments, the inbox the desk actually checks.",
      },
      {
        title: "Shape the guest journey",
        body: "From the enquiry to the room: what the guest shared, and who on the team needs to see it.",
      },
      {
        title: "Prepare the team",
        body: "Front desk and housekeeping leave with the same arrivals list, and a way to run the day without us in the room.",
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
    code: "</>",
    tagline: "A front door, worth staying for.",
    heroLine: "Make the first impression",
    heroEm: "worth the stay.",
    heroTitle: "Make the first impression worth the stay.",
    heroLead:
      "Websites for hotels, restaurants and hospitality brands. From the first scroll to the enquiry, the page should help a guest take the next step.",
    heroImage: "/media/facade.jpg",
    heroAlt: "A hotel entrance at blue hour, one warm doorway on a dark stone facade.",
    conceptLine: "A front door",
    conceptEm: "worth staying for.",
    workspacePill: "Web Development · Interactive preview",
    summary: "Websites with a sense of place, and a clear path to enquire or book.",
    features: [
      {
        title: "A site that feels like the place",
        body: "Typography, photography and language that belong to the property, not a template with the name swapped in.",
      },
      {
        title: "A path to the booking",
        body: "Rooms, menus and the character of the stay, with a deliberate route to enquire or book direct.",
      },
      {
        title: "Built to stay current",
        body: "Pages your team can update after launch — rooms, menus, offers — without a developer for every change.",
      },
    ],
    steps: [
      {
        title: "Define the story",
        body: "What a guest should understand in one visit: the place, who it is for, and the next step you want them to take.",
      },
      {
        title: "Design the experience",
        body: "Pages you can click through before they are built, judged against the room or the table a guest will actually find.",
      },
      {
        title: "Develop and refine",
        body: "A site your team can keep current, connected to the enquiry or booking path you already use.",
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
    code: "↗",
    tagline: "The right guest, a clear reason.",
    heroLine: "Be found by the right guest.",
    heroEm: "Give them a way to book.",
    heroTitle: "Be found by the right guest. Give them a way to book.",
    heroLead:
      "Brand, search, content and campaigns with one promise, and a path from that promise to a direct enquiry.",
    heroImage: "/media/table.jpg",
    heroAlt: "A set table for two, a candle and a glass, the guest's side of the evening.",
    conceptLine: "The right guest",
    conceptEm: "a clear reason.",
    workspacePill: "Digital Growth · Interactive preview",
    summary: "Brand, search, content and campaigns for the guest you want.",
    features: [
      {
        title: "A name that holds",
        body: "Positioning and a visual identity that carry from the first search result through to the confirmation.",
      },
      {
        title: "One growth plan",
        body: "Search, content and campaigns chosen for the guest you want, not for reach on its own.",
      },
      {
        title: "Numbers that decide",
        body: "Enquiries, direct bookings and the channels that produced them — the figures that change next month’s plan.",
      },
    ],
    steps: [
      {
        title: "Find the opportunity",
        body: "Who the property is for, what a guest should expect, and which channels deserve the budget.",
      },
      {
        title: "Launch with focus",
        body: "Brand, site and campaigns telling one story, with a path from the visit to a real enquiry.",
      },
      {
        title: "Learn and improve",
        body: "We watch enquiries and direct bookings, then put the next effort where those actually came from.",
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
