"use client";

import { useEffect, useRef } from "react";

/**
 * Holdout "Eclipse Horizon" particle field (homepage canvas):
 * ~26px cool-white lattice clipped to a wide planetary ellipse,
 * brighter near the horizon arc, soft edge falloff,
 * slow sideways drift + subtle twinkle.
 */
export function EclipseHorizon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 26;
    const DOT_R = 1.05;
    /** One lattice cell every ~18s — readable sideways drift like Holdout. */
    const DRIFT_PX_PER_SEC = GAP / 18;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let rx = 1;
    let ry = 1;
    let cols = 0;
    let rows = 0;
    let xOrigin = 0;
    let yOrigin = 0;
    let raf = 0;
    let running = true;
    let start = performance.now();

    function hash(ix: number, iy: number) {
      const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
      return n - Math.floor(n);
    }

    function rebuild() {
      if (!canvas || !ctx) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      width = Math.max(1, parent.clientWidth);
      height = Math.max(1, parent.clientHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = width * 0.5;
      cy = height * 1.02;
      rx = width * 0.98;
      ry = height * 1.05;

      cols = Math.ceil((rx * 2) / GAP) + 8;
      rows = Math.ceil((ry * 2) / GAP) + 4;
      xOrigin = cx - Math.floor(cols / 2) * GAP;
      yOrigin = cy - Math.floor(rows / 2) * GAP;
    }

    function paint(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const paused =
        document.hidden ||
        document.documentElement.getAttribute("data-motion") === "paused" ||
        reduceMotion;

      const drift = paused ? 0 : ((now - start) / 1000) * DRIFT_PX_PER_SEC;
      const driftMod = ((drift % GAP) + GAP) % GAP;

      const haze = ctx.createRadialGradient(
        width * 0.5,
        height * 0.78,
        0,
        width * 0.5,
        height * 0.78,
        Math.max(width, height) * 0.55,
      );
      haze.addColorStop(0, "rgba(170, 135, 255, 0.16)");
      haze.addColorStop(0.4, "rgba(100, 70, 200, 0.07)");
      haze.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      for (let iy = 0; iy <= rows; iy++) {
        const y = yOrigin + iy * GAP;
        for (let ix = 0; ix <= cols; ix++) {
          const x = xOrigin + ix * GAP + driftMod;

          const nx = (x - cx) / rx;
          const ny = (y - cy) / ry;
          const r2 = nx * nx + ny * ny;
          if (r2 > 1.02 || ny > 0.02) continue;

          const dist = Math.sqrt(Math.max(r2, 0));
          const softEdge = Math.pow(Math.max(0, 1 - dist), 0.5);
          const horizonBoost = Math.exp(-Math.pow((ny + 0.1) / 0.32, 2));
          const altitude = Math.min(1, Math.max(0, (-ny - 0.02) / 0.75));
          const topFade = 0.55 + 0.45 * (1 - Math.pow(altitude, 1.6));
          const base = Math.min(1, softEdge * 1.2) * (0.55 + horizonBoost * 0.7) * topFade;
          if (base < 0.1) continue;

          const h = hash(ix, iy);
          const twinkle = paused
            ? 1
            : 0.82 + 0.18 * (0.5 + 0.5 * Math.sin(now * 0.0011 * (0.45 + h * 1.4) + h * Math.PI * 2));
          const alpha = Math.min(0.8, base * twinkle * 0.95);
          if (alpha < 0.05) continue;

          const glow = 0.55 + base * 0.45;
          const r = Math.round(210 + 45 * glow);
          const g = Math.round(200 + 55 * glow);
          const b = 255;

          if (h > 0.935 && base > 0.35) {
            const s = 2.4;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x - s / 2, y - s / 2, s, s);
          } else {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    function frame(now: number) {
      if (!running) return;
      paint(now);
      raf = window.requestAnimationFrame(frame);
    }

    rebuild();
    paint(performance.now());
    if (!reduceMotion) raf = window.requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      rebuild();
      paint(performance.now());
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-eclipse-canvas" aria-hidden="true" />;
}
