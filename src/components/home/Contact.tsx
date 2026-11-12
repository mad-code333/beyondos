"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./closing.css";

const ease = [0.22, 1, 0.36, 1] as const;

const headingLines = [
  { text: "Let's build", em: false },
  { text: "something that", em: false },
  { text: "moves you forward.", em: true },
] as const;

const innerReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease, when: "beforeChildren" },
  },
} as const;

const lineReveal = {
  hidden: { y: "110%" },
  show: (delay: number) => ({
    y: 0,
    transition: { duration: 0.7, ease, delay },
  }),
} as const;

export function Contact() {
  const reduce = Boolean(useReducedMotion());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setSent(false);
    }

    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function openDialog() {
    setSent(false);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="closing" id="contact">
      <div className="closing-glow" aria-hidden="true" />
      <div className="wrap">
        <motion.div
          className="closing-inner"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={innerReveal}
        >
          <div className="eyebrow">Ready when you are</div>

          <h2 className="closing-heading">
            {headingLines.map((line, index) => {
              const Tag = line.em ? motion.em : motion.span;
              return (
                <span className="closing-heading-line" key={line.text}>
                  <Tag custom={reduce ? 0 : 0.1 + index * 0.08} variants={lineReveal}>
                    {line.text}
                  </Tag>
                </span>
              );
            })}
          </h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.28 }}
          >
            Tell us where you are today. Let&apos;s explore what better could look like for your
            business.
          </motion.p>

          <motion.div
            className="closing-actions"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.36 }}
          >
            <button className="closing-btn" type="button" onClick={openDialog}>
              Start a conversation
              <span aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h9.5M8.5 4.5 13 8l-4.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </motion.div>

          <motion.small
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.44 }}
          >
            Better operations. Stronger digital presence. One connected partner.
          </motion.small>
        </motion.div>
      </div>

      <dialog className="closing-dialog" ref={dialogRef} aria-labelledby="conversation-title">
        <div className="closing-dialog-inner">
          <div className="closing-dialog-head">
            <div>
              <h2 id="conversation-title">Your next chapter starts here.</h2>
              <p>A short brief is enough. The property, what runs today, and what should feel better.</p>
            </div>
            <button className="closing-dialog-close" type="button" onClick={closeDialog} aria-label="Close dialog">
              ×
            </button>
          </div>

          {sent ? (
            <div className="closing-form-done">
              <h3>Message received.</h3>
              <p>
                This form is a local prototype. Wire it to email when you are ready to take live
                enquiries.
              </p>
            </div>
          ) : (
            <form className="closing-form" onSubmit={onSubmit}>
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
                <select name="interest" defaultValue="crm">
                  <option value="crm">CRM</option>
                  <option value="oms">Restaurant OMS</option>
                  <option value="hms">Hotel HMS</option>
                  <option value="web">Web Development</option>
                  <option value="growth">Digital Growth</option>
                  <option value="connected">A connected solution</option>
                </select>
              </label>
              <label>
                A little about your project
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Rooms, covers, the tools you use today, and what should feel better."
                />
              </label>
              <button className="closing-btn" type="submit">
                Send enquiry
                <span aria-hidden="true">↗︎</span>
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
