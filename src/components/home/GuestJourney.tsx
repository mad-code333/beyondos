"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import "./guest-journey.css";

const steps = [
  {
    n: "1",
    title: "Find the property",
    description: "A guest looks up the stay or the table.",
    image: "/media/river.jpg",
    alt: "A hotel window at dusk, looking onto a river and the city.",
    note: "The website answers before anyone at the desk does.",
  },
  {
    n: "2",
    title: "Write once",
    description: "The enquiry stays on the guest.",
    image: "/media/note.jpg",
    alt: "A closed envelope, a pen and a cup on a hotel side table.",
    note: "Who wrote, what they asked, and what happens next.",
  },
  {
    n: "3",
    title: "The night itself",
    description: "The floor and the kitchen see the same service.",
    image: "/media/floor.jpg",
    alt: "A restaurant floor seen from the doorway, candles lit before service.",
    note: "Rooms, tables and tickets, without a second version of the night.",
  },
  {
    n: "4",
    title: "The next visit",
    description: "What they loved is still there.",
    image: "/media/breakfast.jpg",
    alt: "Breakfast on a tray by a hotel window in the morning.",
    note: "The brand and the follow-up bring the same guest back.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function GuestJourney() {
  const reduce = useReducedMotion();

  return (
    <section className="guest-journey wrap" id="journey" aria-label="Guest journey">
      <motion.div
        className="journey-head"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="mono">The day, in four moves</div>
        <h2>
          From the first
          <br />
          search to the
          <br />
          next stay.
        </h2>
      </motion.div>

      <div className="journey-grid">
        {steps.map((step, index) => (
          <motion.article
            key={step.n}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.06 * index }}
          >
            <span className="journey-n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className="journey-photo">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 980px) 48vw, 24vw"
                loading="lazy"
              />
            </div>
            <small>{step.note}</small>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
