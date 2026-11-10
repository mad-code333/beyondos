"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./showcase.css";

const steps = [
  {
    n: "01",
    title: "Guest checks in",
    body: "Reservation and profile open on the hotel desk.",
  },
  {
    n: "02",
    title: "Preferences shared",
    body: "Stay notes and allergies are visible to the team.",
  },
  {
    n: "03",
    title: "Restaurant takes the order",
    body: "Floor and kitchen move the ticket through service.",
  },
  {
    n: "04",
    title: "Stay context stays clear",
    body: "Each team works from the relevant part of the journey.",
  },
] as const;

export function ConnectedJourney() {
  const reduce = useReducedMotion();
  const [live, setLive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setLive((current) => (current + 1) % steps.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="sx-journey">
      <div className="sx-journey-top">
        <div>
          <h4>One connected hospitality journey</h4>
          <p>
            Hotel and restaurant teams work from the same guest story — presented here as a
            demonstration of how BeyondOS connects operations, not as a live sync claim.
          </p>
        </div>
        <span className="sx-badge is-demo">
          <i /> Conceptual flow
        </span>
      </div>
      <div className="sx-steps">
        {steps.map((step, index) => (
          <motion.div
            key={step.n}
            className={`sx-step${live === index ? " is-live" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            <em>{step.n}</em>
            <strong>{step.title}</strong>
            <span>{step.body}</span>
          </motion.div>
        ))}
      </div>
      <p className="sx-disclaimer">
        Cross-product folio charging is only shown when it is implemented and tested for a property.
      </p>
    </div>
  );
}
