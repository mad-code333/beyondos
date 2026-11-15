"use client";

import { useEffect, useState } from "react";

export function MotionToggle() {
  const [motionOn, setMotionOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Motion is on by default; only an explicit "Pause motion" click (stored) turns it off.
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem("beyondos-motion");
    } catch {}
    const next = stored !== "paused";
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
