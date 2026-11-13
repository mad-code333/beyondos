"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import "./contact-enquiry.css";

const interestOptions = [
  { value: "starter", label: "Starter — one clear problem / Discovery" },
  { value: "growth", label: "Growth — connected systems / consultation" },
  { value: "custom", label: "Custom — multi-property / bespoke project" },
  { value: "crm", label: "CRM — guest relationships" },
  { value: "oms", label: "OMS — restaurant orders" },
  { value: "hms", label: "HMS — hotel management" },
  { value: "web", label: "Web — direct booking site" },
  { value: "connected", label: "A connected solution" },
] as const;

const copyByInterest: Record<string, { title: string; lead: string; placeholder: string }> = {
  starter: {
    title: "Start with Discovery.",
    lead: "One clear problem. A short workshop. A fixed scope after we walk the desk or floor with you.",
    placeholder: "What is the one problem you want scoped first?",
  },
  growth: {
    title: "Talk through a Growth bundle.",
    lead: "Two systems, one guest path. Tell us which tools should talk — HMS + CRM, Web + Growth, or another pair.",
    placeholder: "Which two systems should connect first?",
  },
  custom: {
    title: "Enquire about a custom project.",
    lead: "Groups, multi-property rollouts, or workflows no off-the-shelf tool fits. We start with discovery, then a phased plan.",
    placeholder: "What should the custom build unlock across properties?",
  },
};

type ContactEnquiryProps = {
  interest?: string;
};

export function ContactEnquiry({ interest = "starter" }: ContactEnquiryProps) {
  const [sent, setSent] = useState(false);
  const initialInterest = interestOptions.some((option) => option.value === interest)
    ? interest
    : "starter";

  const copy = useMemo(
    () =>
      copyByInterest[initialInterest] ?? {
        title: "Tell us what is slowing your property down.",
        lead: "Share the business type, what you need, and how we should start — Discovery, Growth, or Custom.",
        placeholder: "Rooms, covers, the tools you use today, and what should feel better.",
      },
    [initialInterest],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="contact-enquiry" aria-labelledby="contact-enquiry-title">
      <div className="contact-enquiry-copy">
        <p className="mono">Book a demo</p>
        <h1 id="contact-enquiry-title">{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>

      {sent ? (
        <div className="contact-enquiry-done">
          <h2>Message received.</h2>
          <p>
            This form is a local prototype. Wire it to email when you are ready to take live
            enquiries.
          </p>
          <Link href="/#engagement">Back to ways of working</Link>
        </div>
      ) : (
        <form className="contact-enquiry-form" onSubmit={onSubmit}>
          <label>
            Your name
            <input required name="name" autoComplete="name" placeholder="Nino Beridze" />
          </label>
          <label>
            Work email
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nino@yourhotel.ge"
            />
          </label>
          <label>
            Business name
            <input required name="business" placeholder="Still House, Table / 07, or your property" />
          </label>
          <label>
            What are you interested in?
            <select name="interest" defaultValue={initialInterest}>
              {interestOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            A little about your project
            <textarea name="message" rows={4} placeholder={copy.placeholder} />
          </label>
          <button className="contact-enquiry-submit" type="submit">
            Send enquiry <span aria-hidden="true">↗︎</span>
          </button>
        </form>
      )}
    </section>
  );
}
