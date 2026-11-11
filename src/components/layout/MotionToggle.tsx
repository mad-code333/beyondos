"use client";

import { useEffect, useState } from "react";

export function MotionToggle() {
  const [motionOn, setMotionOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("beyondos-motion");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = stored ? stored !== "paused" : !prefersReduce;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
    setReady(true);
  }, []);

  function toggleMotion() {
    const next = !motionOn;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
    window.localStorage.setItem("beyondos-motion", next ? "on" : "paused");
  }

  return (
    <button
      type="button"
      aria-pressed={!motionOn}
      onClick={toggleMotion}
      suppressHydrationWarning
    >
      {ready ? (motionOn ? "Pause motion Ⅱ" : "Play motion ▶") : "Pause motion Ⅱ"}
    </button>
  );
}
