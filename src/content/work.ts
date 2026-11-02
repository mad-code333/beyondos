export type WorkProject = {
  id: string;
  tag: string;
  kicker: string;
  caption: string;
  title: string;
  type: string;
  lead: string;
  services: string;
  image: string;
  alt: string;
};

export const workProjects: WorkProject[] = [
  {
    id: "still-house",
    tag: "Hospitality / Stays",
    kicker: "Still House · Boutique stay",
    caption: "A slower kind of stay.",
    title: "Still House",
    type: "Website",
    lead: "A digital experience with a sense of place.",
    services: "Website · Guest journey · Hotel HMS",
    image: "/media/suite.jpg",
    alt: "A boutique hotel bedroom in morning light, linen and a chair by the window.",
  },
  {
    id: "table-07",
    tag: "Hospitality / Restaurants",
    kicker: "Table / 07 · Restaurant",
    caption: "Good service. Behind the scenes.",
    title: "Table / 07",
    type: "Restaurant OMS",
    lead: "FLOOR → KITCHEN → GUEST",
    services: "Restaurant OMS · Brand · Digital presence",
    image: "/media/dining.jpg",
    alt: "A restaurant dining room set for service, warm light on empty tables.",
  },
  {
    id: "front-desk",
    tag: "Hospitality / Operations",
    kicker: "Front Desk · Hotel HMS",
    caption: "Ready before the door opens.",
    title: "Front Desk",
    type: "Hotel HMS",
    lead: "Arrivals, rooms, and context in one list.",
    services: "Hotel HMS · CRM · Arrivals",
    image: "/media/desk.jpg",
    alt: "A hotel reception desk in stone and warm lamplight, before the first guest.",
  },
  {
    id: "the-pass",
    tag: "Hospitality / Kitchen",
    kicker: "The Pass · Restaurant OMS",
    caption: "One ticket. One truth.",
    title: "The Pass",
    type: "Restaurant OMS",
    lead: "RECEIVED → PREPARING → READY",
    services: "Restaurant OMS · Service flow · Close",
    image: "/media/kitchen.jpg",
    alt: "The pass between a restaurant kitchen and the dining room, plates ready.",
  },
  {
    id: "river-house",
    tag: "Brand / Digital",
    kicker: "River House · Direct booking",
    caption: "Found. Trusted. Booked direct.",
    title: "River House",
    type: "Website",
    lead: "A site that earns the enquiry.",
    services: "Website · Brand · Digital growth",
    image: "/media/facade.jpg",
    alt: "A hotel entrance at blue hour, one warm doorway on a dark stone facade.",
  },
];
