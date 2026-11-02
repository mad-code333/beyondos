"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { workProjects } from "@/content/work";
import "./work-mix.css";

const ease = [0.22, 1, 0.36, 1] as const;
const COPIES = 3;
const AUTO_MS = 4800;
const COUNT = workProjects.length;
const START = COUNT;
const LOOP = Array.from({ length: COPIES }, (_, copy) =>
  workProjects.map((project, index) => ({ ...project, loopKey: `${copy}-${project.id}-${index}` })),
).flat();

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function strideOf(rail: HTMLElement) {
  const card = rail.querySelector<HTMLElement>(".work-project");
  if (!card) return 0;
  const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
  return card.getBoundingClientRect().width + gap;
}

export function WorkMix() {
  const reduce = Boolean(useReducedMotion());
  const railRef = useRef<HTMLDivElement>(null);
  const wrapLock = useRef(false);
  const pointer = useRef({ active: false, startX: 0, startScroll: 0, dragged: false });
  const resumeAt = useRef(0);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionPaused, setMotionPaused] = useState(reduce);

  const syncIndex = useCallback((raw: number) => {
    const next = ((raw % COUNT) + COUNT) % COUNT;
    indexRef.current = next;
    setIndex(next);
  }, []);

  const jumpTo = useCallback(
    (slot: number, behavior: ScrollBehavior = "auto") => {
      const rail = railRef.current;
      if (!rail) return;
      const stride = strideOf(rail);
      if (!stride) return;
      wrapLock.current = true;
      syncIndex(slot);
      rail.classList.add("is-jumping");
      rail.scrollTo({ left: slot * stride, behavior });
      window.setTimeout(() => {
        wrapLock.current = false;
        rail.classList.remove("is-jumping");
      }, behavior === "smooth" ? 560 : 48);
    },
    [syncIndex],
  );

  const wrapIfNeeded = useCallback(() => {
    const rail = railRef.current;
    if (!rail || wrapLock.current) return;
    const stride = strideOf(rail);
    if (!stride) return;
    const slot = Math.round(rail.scrollLeft / stride);
    if (slot < COUNT) {
      jumpTo(slot + COUNT);
      return;
    }
    if (slot >= COUNT * 2) {
      jumpTo(slot - COUNT);
      return;
    }
    syncIndex(slot);
  }, [jumpTo, syncIndex]);

  const goBy = useCallback(
    (delta: number) => {
      const rail = railRef.current;
      if (!rail) return;
      resumeAt.current = Date.now() + AUTO_MS;
      const stride = strideOf(rail);
      if (!stride) return;
      const current = Math.round(rail.scrollLeft / stride);
      jumpTo(current + delta, reduce ? "auto" : "smooth");
    },
    [jumpTo, reduce],
  );

  const goTo = useCallback(
    (target: number) => {
      const rail = railRef.current;
      if (!rail) return;
      resumeAt.current = Date.now() + AUTO_MS;
      const stride = strideOf(rail);
      if (!stride) return;
      const current = Math.round(rail.scrollLeft / stride);
      const currentMod = ((current % COUNT) + COUNT) % COUNT;
      jumpTo(current + (target - currentMod), reduce ? "auto" : "smooth");
    },
    [jumpTo, reduce],
  );

  useEffect(() => {
    if (reduce) {
      setMotionPaused(true);
      return;
    }
    const root = document.documentElement;
    const sync = () => setMotionPaused(root.getAttribute("data-motion") === "paused");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, [reduce]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const place = (slot = START) => {
      const stride = strideOf(rail);
      if (!stride) return;
      wrapLock.current = true;
      rail.classList.add("is-jumping");
      rail.scrollLeft = slot * stride;
      syncIndex(slot);
      setReady(true);
      window.setTimeout(() => {
        wrapLock.current = false;
        rail.classList.remove("is-jumping");
      }, 50);
    };

    const settle = () => place(START + indexRef.current);
    place(START);
    syncIndex(0);
    const frame = requestAnimationFrame(() => requestAnimationFrame(settle));
    let lastStride = 0;
    const ro = new ResizeObserver(() => {
      const stride = strideOf(rail);
      if (!stride || Math.abs(stride - lastStride) < 1) return;
      lastStride = stride;
      settle();
    });
    ro.observe(rail);
    const firstCard = rail.querySelector(".work-project");
    if (firstCard) ro.observe(firstCard);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [syncIndex]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    let endTimer = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const stride = strideOf(rail);
        if (!stride) return;
        syncIndex(Math.round(rail.scrollLeft / stride));
      });
      if (wrapLock.current) return;
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(() => wrapIfNeeded(), 160);
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(endTimer);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [syncIndex, wrapIfNeeded]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = [...rail.querySelectorAll(".work-project")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(
            "is-visible",
            entry.intersectionRatio >= 0.55,
          );
          entry.target.classList.toggle(
            "is-peeking",
            entry.intersectionRatio > 0.04 && entry.intersectionRatio < 0.55,
          );
        }
      },
      { root: rail, threshold: [0.04, 0.35, 0.55, 0.8] },
    );
    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = railRef.current?.closest("section");
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0.2, 0.45] },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || motionPaused || !inView || dragging) return;
    const id = window.setInterval(() => {
      if (Date.now() < resumeAt.current) return;
      if (pointer.current.active) return;
      goBy(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [dragging, goBy, inView, motionPaused, reduce]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    pointer.current = {
      active: true,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      dragged: false,
    };
    setDragging(true);
    rail.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current.active) return;
    const rail = railRef.current;
    if (!rail) return;
    const dx = event.clientX - pointer.current.startX;
    if (Math.abs(dx) > 6) pointer.current.dragged = true;
    rail.scrollLeft = pointer.current.startScroll - dx;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current.active) return;
    const rail = railRef.current;
    const dragged = pointer.current.dragged;
    pointer.current.active = false;
    setDragging(false);
    resumeAt.current = Date.now() + AUTO_MS;
    rail?.releasePointerCapture(event.pointerId);
    const stride = rail ? strideOf(rail) : 0;
    if (rail && stride) {
      const next = Math.round(rail.scrollLeft / stride);
      rail.scrollTo({ left: next * stride, behavior: reduce ? "auto" : "smooth" });
    }
    if (dragged) {
      event.preventDefault();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goBy(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBy(-1);
    }
  }

  return (
    <section className="work-mix" id="work">
      <div className="work-mix-glow" aria-hidden="true" />
      <div className="wrap">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="eyebrow">05 / Case studies · Portfolio</div>
        </motion.div>

        <div className="work-mix-head">
          <motion.h2
            className="work-mix-title"
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            <span className="work-mix-title-line">
              <motion.span
                variants={{
                  hidden: { y: "110%" },
                  show: { y: 0, transition: { duration: 0.7, ease, delay: 0.08 } },
                }}
              >
                Directions you can open.
              </motion.span>
            </span>
            <span className="work-mix-title-line">
              <motion.em
                variants={{
                  hidden: { y: "110%" },
                  show: { y: 0, transition: { duration: 0.7, ease, delay: 0.16 } },
                }}
              >
                Outcomes you can read.
              </motion.em>
            </span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease, delay: reduce ? 0 : 0.14 }}
          >
            Portfolio pieces across stays, dining rooms, and the systems behind them — each one open
            to the full direction behind it.
          </motion.p>
        </div>

        <div className="work-carousel">
          <div className="work-carousel-bar">
            <p className="work-carousel-index" aria-live="polite">
              {pad(index + 1)}
              <span aria-hidden="true"> / </span>
              {pad(COUNT)}
            </p>
            <div className="work-carousel-dots" role="tablist" aria-label="Portfolio projects">
              {workProjects.map((project, dotIndex) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={index === dotIndex}
                  aria-label={`Show ${project.title}`}
                  className={`work-carousel-dot${index === dotIndex ? " is-active" : ""}`}
                  onClick={() => goTo(dotIndex)}
                />
              ))}
            </div>
            <div className="work-carousel-arrows">
              <button type="button" aria-label="Previous projects" onClick={() => goBy(-1)}>
                ←
              </button>
              <button type="button" aria-label="Next projects" onClick={() => goBy(1)}>
                →
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            className={`work-rail${ready ? " is-ready" : ""}${dragging ? " is-dragging" : ""}`}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Portfolio case studies"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            {LOOP.map((project, slot) => (
              <article className="work-project" key={project.loopKey}>
                <button
                  className="work-project-hit"
                  type="button"
                  onClick={(event) => {
                    if (pointer.current.dragged) {
                      event.preventDefault();
                    }
                  }}
                >
                  <motion.div
                    className="work-project-media"
                    initial={reduce ? false : { clipPath: "inset(8% 5% 8% 5% round 24px)", scale: 1.04 }}
                    whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, ease, delay: reduce ? 0 : (slot % 3) * 0.06 }}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 760px) 88vw, 32vw"
                      className="work-project-photo"
                    />
                    <span className="work-project-tag">{project.tag}</span>
                    <span className="work-project-caption">
                      <span className="mono">{project.kicker}</span>
                      <strong>{project.caption}</strong>
                    </span>
                  </motion.div>
                  <motion.div
                    className="work-project-copy"
                    initial={reduce ? false : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, margin: "-30px" }}
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.08 } },
                    }}
                  >
                    <motion.div
                      className="work-project-identity"
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                      }}
                    >
                      <h3>{project.title}</h3>
                      <span className="work-project-type">
                        <span className="mono">{project.type}</span>
                        <span className="work-project-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                    </motion.div>
                    <motion.p
                      className="work-project-lead"
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.48, ease } },
                      }}
                    >
                      {project.lead}
                    </motion.p>
                    <motion.p
                      className="work-project-services"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
                      }}
                    >
                      {project.services}
                    </motion.p>
                  </motion.div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
