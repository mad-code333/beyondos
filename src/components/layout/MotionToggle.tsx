"use client";

import { useEffect, useState } from "react";

export function MotionToggle() {
  const [motionOn, setMotionOn] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("beyondos-motion");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = stored ? stored !== "paused" : !prefersReduce;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
  }, []);

  function toggleMotion() {
    const next = !motionOn;
    setMotionOn(next);
    document.documentElement.setAttribute("data-motion", next ? "on" : "paused");
    window.localStorage.setItem("beyondos-motion", next ? "on" : "paused");
  }

  return (
    <button type="button" aria-pressed={!motionOn} onClick={toggleMotion}>
      {motionOn ? "Pause motion Ⅱ" : "Play motion ▶"}
    </button>
  );
}
