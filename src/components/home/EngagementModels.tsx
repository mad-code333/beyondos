"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import "./engagement.css";

const currencies = [
  { id: "GEL", label: "GEL ₾" },
  { id: "USD", label: "USD $" },
  { id: "EUR", label: "EUR €" },
] as const;

type CurrencyId = (typeof currencies)[number]["id"];

const cards = [
  {
    id: "discovery",
    mode: "Fixed scope · 1–2 weeks",
    title: "Discovery",
    body: "Map the operation, agree the first problem worth solving, and leave with a dated plan.",
    features: [
      "Desk / floor / kitchen walkthrough",
      "Tool and WhatsApp audit",
      "Recommended first capability",
      "Written scope and timeline shape",
    ],
    cta: "Book Discovery",
    href: "/#contact",
    highlight: false,
  },
  {
    id: "build",
    mode: "Monthly team",
    title: "Build",
    body: "A named team designs and ships the chosen Beyond OS capability with your staff.",
    features: [
      "Product + engineering for the agreed scope",
      "Staging you can click early",
      "Training on real work",
      "Handover the floor can run",
    ],
    cta: "Talk Build",
    href: "/#contact",
    highlight: true,
  },
  {
    id: "support",
    mode: "Monthly",
    title: "Run & Support",
    body: "We stay with what shipped — fixes, small improvements, and seasonal readiness.",
    features: [
      "Named support channel (incl. WhatsApp)",
      "Priority fixes in high season",
      "Monthly check-in",
      "Optional growth retainer add-on",
    ],
    cta: "Talk Support",
    href: "/#contact",
    highlight: false,
  },
] as const;

export function EngagementModels() {
  const [currency, setCurrency] = useState<CurrencyId>("GEL");

  return (
    <section
      className="engagement-models"
      id="engagement"
      aria-labelledby="engage-heading"
    >
      <div className="wrap">
        <Reveal y={22}>
          <div className="engage-head">
            <div className="engage-copy">
              <p className="engage-eyebrow mono">Ways of working</p>
              <h2 id="engage-heading">
                Three ways in.
                <br />
                <em>One team either way.</em>
              </h2>
              <p className="engage-lead">
                Not ready for all five services? Start with one.
              </p>
            </div>

            <div
              className="currency-toggle"
              role="radiogroup"
              aria-label="Currency"
            >
              {currencies.map((item) => (
                <label key={item.id} className="currency-opt">
                  <input
                    type="radio"
                    name="currency"
                    value={item.id}
                    checked={currency === item.id}
                    onChange={() => setCurrency(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="engage-grid">
          {cards.map((card, index) => (
            <Reveal key={card.id} delay={0.06 + index * 0.06} y={24}>
              <article
                className={`engage-card${card.highlight ? " is-highlight" : ""}`}
              >
                <p className="mono engage-mode">{card.mode}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="engage-price">
                  <span className="price-label">Price on request</span>
                </div>
                <Link className="engage-cta" href={card.href}>
                  {card.cta} <span aria-hidden="true">↗</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EngagementModels;
