"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import "./work-mix.css";

const ease = [0.22, 1, 0.36, 1] as const;

const rows = [
  {
    label: "Hotels",
    title: "The stay, held in one place",
    body: "Enquiries, preferences, arrivals and room status belong together. The front desk should not have to rebuild the guest from five different tools.",
    points: [
      "One guest profile, from the first hello",
      "Arrivals and housekeeping on the same list",
      "A website that leads to a real booking",
    ],
    focus: "CRM · Hotel HMS · Web",
  },
  {
    label: "Restaurants",
    title: "The room and the kitchen, in step",
    body: "Service is a sequence: received, preparing, ready, served. When the whole team can see that sequence, the night gets quieter without getting slower.",
    points: [
      "Tickets the pass can trust",
      "Tables, notes and covers on the order",
      "A close of service that does not take the morning",
    ],
    focus: "Restaurant OMS · Brand",
  },
  {
    label: "Growth",
    title: "Found by the right guest",
    body: "A beautiful property still loses bookings to a weak site or a scattered brand. Search, content and the website should point to the same promise, and then to a direct enquiry.",
    points: [
      "A name a guest can remember",
      "Pages that explain the stay or the table",
      "Campaigns measured by enquiries, not vanity reach",
    ],
    focus: "Digital growth · Web",
  },
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
};

export function WorkMix() {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);

  return (
    <section className="section work-mix" id="work">
      <div className="wrap">
        <motion.div
          className="eyebrow"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
        >
          05 / Directions, drawn in full
        </motion.div>

        <motion.div
          className="section-head"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.06 }}
        >
          <h2>
            How the work
            <br />
            <em>comes together.</em>
          </h2>
          <p>The practice behind hotels, restaurants and growth — held in one place.</p>
        </motion.div>

        <div className="portfolio-rows">
          {rows.map((row, index) => (
            <motion.article
              key={row.label}
              className="portfolio-row"
              custom={reduce ? 0 : 0.08 + index * 0.08}
              variants={fadeUp}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
            >
              <span>{row.label}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </div>
              <div>
                <ul>
                  {row.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <small className="practice-focus">{row.focus}</small>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
