"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide "should motion be reduced?" — a drop-in for framer-motion's
 * `useReducedMotion`, with two differences:
 *
 * 1. It follows the site's own "Pause motion" button (`<html data-motion>`),
 *    not the OS reduced-motion flag, so the whole site behaves the same way.
 * 2. It is hydration-safe: the server and the first client render both see
 *    `false`, then it updates. framer's hook returns `true` on the first client
 *    render when the OS flag is on, which made the server HTML mismatch.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.getAttribute("data-motion") === "paused";
const getServerSnapshot = () => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
