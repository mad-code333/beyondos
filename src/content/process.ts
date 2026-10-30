export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  outcome: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    body: "We map your operation, understand your audience and agree on the problem worth solving.",
    outcome: "A shared brief and clear priorities.",
  },
  {
    number: "02",
    title: "Design",
    body: "We shape journeys, interfaces and workflows your team can feel before anything ships.",
    outcome: "Prototypes, direction and aligned scope.",
  },
  {
    number: "03",
    title: "Build & connect",
    body: "We implement the software, website or growth system and connect it to the rest of your stack.",
    outcome: "Working tools in your real environment.",
  },
  {
    number: "04",
    title: "Refine & grow",
    body: "We stay close after launch — tuning flows, measuring signal and planning the next chapter.",
    outcome: "A partner for the long run.",
  },
];
