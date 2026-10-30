"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/ui/Container";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="section-pad border-t border-line" id="contact">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
            Your next chapter
          </p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] md:text-5xl">
            Let&apos;s build something that moves you forward.
          </h2>
          <p className="mt-5 max-w-md text-[15px] text-muted">
            Tell us where you are today. We&apos;ll explore what better could look like for your
            hotel or restaurant.
          </p>
        </div>

        {sent ? (
          <div className="glass p-8">
            <h3 className="text-2xl tracking-[-0.03em]">Message received.</h3>
            <p className="mt-3 text-[14px] text-muted">
              This form is a local prototype. Wire it to email when you are ready to take live
              enquiries.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Business" name="business" placeholder="Hotel, restaurant, group" />
            <Field label="Email" name="email" type="email" placeholder="you@venue.com" />
            <label className="grid gap-2 text-[12px] text-[#bdbdb8]">
              What do you need?
              <textarea
                name="message"
                required
                rows={4}
                placeholder="CRM, OMS, HMS, website, growth — or a mix."
                className="rounded-2xl border border-line bg-[#0c0c0c] px-4 py-3 text-[14px] text-[#f1f1ee] outline-none placeholder:text-[#5c5c5c] focus:border-white/30"
              />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex w-fit rounded-full bg-[#f1f1ee] px-6 py-3 text-[12px] tracking-[0.04em] text-[#080808] transition hover:bg-white"
            >
              Start a conversation ↗
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-[12px] text-[#bdbdb8]">
      {label}
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-full border border-line bg-[#0c0c0c] px-4 py-3 text-[14px] text-[#f1f1ee] outline-none placeholder:text-[#5c5c5c] focus:border-white/30"
      />
    </label>
  );
}
