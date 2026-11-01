"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { getRelatedServices, type Service } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";
import { WorkspaceDemo } from "@/components/home/WorkspaceDemo";
import "./service-page.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function ServiceView({ service }: { service: Service }) {
  const related = getRelatedServices(service.slug);
  const reduce = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : ["-6%", "6%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1]);

  return (
    <main className="service-page">
      <section className="service-hero wrap">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <Link className="back-link mono" href="/#services">
            ← All services
          </Link>
          <div className="eyebrow mono">{service.category}</div>
          <div className="service-hero-grid">
            <div>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.06, ease }}
              >
                {service.heroLine}
                <br />
                <em>{service.heroEm}</em>
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.14, ease }}
              >
                {service.heroLead}
              </motion.p>
              <motion.div
                className="hero-actions"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease }}
              >
                <Link className="svc-btn" href="/#contact">
                  Let&apos;s talk <span>↗</span>
                </Link>
                <Link className="svc-btn outline" href="#workspace">
                  See the workspace <span>↓</span>
                </Link>
              </motion.div>
            </div>
            <motion.div
              ref={photoRef}
              className="service-hero-photo"
              initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease }}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              <motion.div
                className="hero-photo-motion"
                style={{ y: photoY, scale: photoScale }}
              >
                <Image
                  src={service.heroImage}
                  alt={service.heroAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  priority
                />
              </motion.div>
              <span className="photo-label mono">BEYOND / {service.code}</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="service-section" id="concept">
        <div className="wrap">
          <Reveal className="section-head center-head">
            <div>
              <div className="eyebrow mono">Built for the day</div>
              <h2>
                {service.conceptLine},
                <br />
                <em>{service.conceptEm}</em>
              </h2>
            </div>
            <p>Specific to this work, and to the team who will run it.</p>
          </Reveal>
          <div className="feature-grid">
            {service.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.08}>
                <article className="feature-card">
                  <span className="mono">0{index + 1}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="service-section" id="workspace">
        <div className="wrap">
          <WorkspaceDemo
            key={service.slug}
            lockedTab={service.slug}
            pill={service.workspacePill}
          />
        </div>
      </section>

      <section className="service-section">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow mono">Built with you</div>
              <h2>
                Built with the team
                <br />
                <em>who will run it.</em>
              </h2>
            </div>
          </Reveal>
          <ShipList steps={service.steps} />
        </div>
      </section>

      <section className="service-section">
        <div className="wrap">
          <div className="eyebrow mono">The rest of the toolkit</div>
          <div className="next-services">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.06}>
                <Link className="service-row" href={`/services/${item.slug}`}>
                  <span className="num">0{index + 1}</span>
                  <div>
                    <h3>{item.name}</h3>
                  </div>
                  <p>{item.summary}</p>
                  <span className="circle-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ShipList({ steps }: { steps: Service["steps"] }) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="ship-list">
      {steps.map((step, index) => {
        const isOpen = open === index;
        return (
          <button
            key={step.title}
            className={`ship-row${isOpen ? " active" : ""}`}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpen(index)}
          >
            <span className="ship-num mono">0{index + 1}</span>
            <strong>{step.title}</strong>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.span
                  key="copy"
                  className="ship-copy"
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {step.body}
                </motion.span>
              ) : null}
            </AnimatePresence>
            <i className="ship-toggle" aria-hidden="true">
              {isOpen ? "−" : "+"}
            </i>
          </button>
        );
      })}
    </div>
  );
}
