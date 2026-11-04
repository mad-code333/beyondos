"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import "./cursor-ring.css";

function canUseFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function CursorRing() {
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const hovering = useRef(false);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!canUseFinePointer()) return;
    setActive(true);
    document.documentElement.classList.add("has-cursor-ring");
    return () => {
      document.documentElement.classList.remove("has-cursor-ring");
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    function tick() {
      const node = ringRef.current;
      if (!node) return;
      current.current.x += (target.current.x - current.current.x) * 0.28;
      current.current.y += (target.current.y - current.current.y) * 0.28;
      node.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        current.current.x = e.clientX;
        current.current.y = e.clientY;
        const node = ringRef.current;
        if (node) {
          node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
        setVisible(true);
      }
    }

    function onOver(e: MouseEvent) {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select, label, .earth-globe-wrap",
      );
      const next = !!interactive;
      if (next !== hovering.current) {
        hovering.current = next;
        setHover(next);
      }
    }

    function onDown() {
      setPressed(true);
    }

    function onUp() {
      setPressed(false);
    }

    function onLeaveDoc() {
      visibleRef.current = false;
      setVisible(false);
      setHover(false);
      setPressed(false);
      hovering.current = false;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ringRef}
      className={cn(
        "cursor-ring",
        visible && "is-on",
        hover && "is-hover",
        pressed && "is-click",
      )}
      aria-hidden="true"
    >
      <span className="cursor-ring-dot" />
    </div>
  );
}
