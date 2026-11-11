"use client";

import { useEffect, useRef } from "react";

type Particle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shade: number;
  phase: number;
  speed: number;
};

type FooterParticlesProps = {
  text?: string;
};

/**
 * Oversized footer wordmark built from thousands of warm amber particles.
 * Samples letterforms via an offscreen canvas, then animates with soft
 * drift, shimmer, and gentle mouse disturbance.
 */
export function FooterParticles({ text = "beyond" }: FooterParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const canvas: HTMLCanvasElement = node;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const sample = document.createElement("canvas");
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    let lastTs = performance.now();

    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
      "Orbitron, sans-serif";

    function targetCount(w: number, h: number) {
      const area = w * h;
      if (w < 560) return Math.min(2800, Math.floor(area / 78));
      if (w < 960) return Math.min(4600, Math.floor(area / 68));
      return Math.min(7200, Math.floor(area / 58));
    }

    function rebuild() {
      if (!ctx || !sampleCtx) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      width = Math.max(1, parent.clientWidth);
      height = Math.max(1, parent.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Oversized wordmark with a soft bottom crop — most of each glyph stays readable.
      const fontSize = Math.min(width * 0.22, height * 0.78);
      sample.width = Math.max(1, Math.floor(width));
      sample.height = Math.max(1, Math.floor(height));
      sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
      sampleCtx.clearRect(0, 0, sample.width, sample.height);
      sampleCtx.fillStyle = "#fff";
      sampleCtx.textAlign = "center";
      sampleCtx.textBaseline = "middle";
      sampleCtx.font = `800 ${fontSize}px ${fontFamily}, Manrope, sans-serif`;

      const midY = height * 0.58;
      sampleCtx.fillText(text, width * 0.5, midY);

      const { data } = sampleCtx.getImageData(0, 0, sample.width, sample.height);
      const want = targetCount(width, height);
      const step = Math.max(2, Math.floor(Math.sqrt((width * height) / (want * 2.4))));
      const candidates: Array<{ x: number; y: number; shade: number }> = [];

      // Prefer a soft vertical lattice so particles read as digital filaments.
      for (let y = 0; y < sample.height; y += step) {
        const xOffset = (y / step) % 2 === 0 ? 0 : step * 0.5;
        for (let x = xOffset; x < sample.width; x += step) {
          const i = (Math.floor(y) * sample.width + Math.floor(x)) * 4;
          if (data[i] < 48) continue;
          const nx = x / width;
          const ny = y / height;
          // Stronger at bottom (warm gold), quieter toward the top.
          const shade = Math.pow(Math.min(1, Math.max(0, (ny - 0.18) / 0.78)), 1.15);
          if (shade < 0.04 && Math.random() > 0.35) continue;
          candidates.push({ x, y, shade });
        }
      }

      // Thin if oversampled; densify with jittered duplicates if sparse.
      while (candidates.length > want) {
        candidates.splice((Math.random() * candidates.length) | 0, 1);
      }
      let guard = 0;
      while (candidates.length < want && candidates.length > 0 && guard < want) {
        const src = candidates[(Math.random() * candidates.length) | 0];
        candidates.push({
          x: src.x + (Math.random() - 0.5) * step * 0.7,
          y: src.y + (Math.random() - 0.5) * step * 0.7,
          shade: src.shade,
        });
        guard += 1;
      }

      particles = candidates.map((c) => {
        const jitter = (Math.random() - 0.5) * 1.2;
        return {
          homeX: c.x,
          homeY: c.y,
          x: c.x + jitter,
          y: c.y + jitter,
          vx: 0,
          vy: 0,
          size: 0.55 + Math.random() * 1.15 + c.shade * 0.35,
          shade: c.shade,
          phase: Math.random() * Math.PI * 2,
          speed: 0.55 + Math.random() * 1.1,
        };
      });
    }

    function paint(now: number, dt: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const paused =
        document.hidden ||
        document.documentElement.getAttribute("data-motion") === "paused" ||
        reduceMotion;

      const t = now * 0.001;
      const mouseRadius = Math.min(160, width * 0.14);
      const mouseRadiusSq = mouseRadius * mouseRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!paused) {
          const ox = Math.sin(t * 0.55 * p.speed + p.phase) * 0.55;
          const oy = Math.cos(t * 0.42 * p.speed + p.phase * 1.3) * 0.7;
          const targetX = p.homeX + ox;
          const targetY = p.homeY + oy;

          p.vx += (targetX - p.x) * 0.085;
          p.vy += (targetY - p.y) * 0.085;

          if (pointerActive) {
            const dx = p.x - pointerX;
            const dy = p.y - pointerY;
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / mouseRadius) * 18;
              p.vx += (dx / dist) * force * dt;
              p.vy += (dy / dist) * force * dt;
            }
          }

          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }

        const twinkle = paused
          ? 1
          : 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 2.1 * p.speed + p.phase));
        const alpha = Math.min(0.95, (0.18 + p.shade * 0.82) * twinkle);
        if (alpha < 0.05) continue;

        // Warm metallic amber → bronze; brighter near the baseline, quieter at the top.
        const r = Math.round(95 + p.shade * 155);
        const g = Math.round(55 + p.shade * 110);
        const b = Math.round(18 + p.shade * 22);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(0.033, (now - lastTs) / 1000);
      lastTs = now;
      paint(now, dt);
      raf = window.requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      pointerActive = true;
    }

    function onPointerLeave() {
      pointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
    }

    const start = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore font readiness failures */
      }
      if (!running) return;
      rebuild();
      paint(performance.now(), 0.016);
      if (!reduceMotion) raf = window.requestAnimationFrame(frame);
    };
    void start();

    const ro = new ResizeObserver(() => {
      rebuild();
      paint(performance.now(), 0.016);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      className="footer-particles-canvas"
      aria-hidden="true"
    />
  );
}
