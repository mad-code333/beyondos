"use client";

import { useEffect, useRef } from "react";

/**
 * Eclipse Horizon — port of the Holdout hero canvas:
 * a 26px dot lattice above a planetary arc, a vertical light beam that
 * sweeps left → right every few seconds (lighting the dots in its column),
 * a trail of "fail" squares left behind the beam, and a soft cursor glow.
 *
 * Performance: the static parts (base dots, glows, planet + rim) are
 * pre-rendered once per resize. Each frame only recomputes the dot columns
 * touched by the beam/trail and the cursor; everything else is blitted.
 * The loop stops while the hero is offscreen or the tab is hidden.
 */

type RGB = readonly [number, number, number];

const BG: RGB = [4, 4, 7];
const RIM: RGB = [157, 140, 255]; // #9D8CFF
const CORE: RGB = [244, 245, 248]; // #F4F5F8
const GLOW1: RGB = [107, 77, 255]; // #6B4DFF
const GLOW2: RGB = [46, 107, 255]; // #2E6BFF
const DOT: RGB = [244, 245, 248];

const SPACING = 26;
const SWEEP_SECONDS = 7;
const FAIL_RATE = 0.046;
const CURVATURE = 1.15;
const BLOOM = 0.6;
const TRAIL = 520;
const BEAM_REACH = 160; // exp(-h²/4232) is ~0 beyond this
const POINTER_REACH = 420; // exp(-d²/28800) is ~0 beyond this

const rgba = (c: RGB, a: number) =>
  `rgba(${c[0]},${c[1]},${c[2]},${a <= 0 ? 0 : a >= 1 ? 1 : a.toFixed(3)})`;

function hash(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function makeLayer(w: number, h: number, dpr: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { canvas, ctx };
}

export function EclipseHorizon() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionPaused = () =>
      reduceMotion || document.documentElement.getAttribute("data-motion") === "paused";

    let W = 1;
    let H = 1;
    let dpr = 1;
    let cx = 0;
    let horizonY = 0;
    let R = 1;
    let planetCy = 0;
    let cols = 0;
    let rows = 0;
    let x0 = 0;

    // Per-dot precomputed data, column-major: [col * rows + row]
    let baseAlpha = new Float32Array(0); // m
    let fade = new Float32Array(0); // l*u
    let weight = new Float32Array(0); // u*p
    let isFail = new Uint8Array(0);

    let dotsLayer: HTMLCanvasElement | null = null;
    let planetLayer: HTMLCanvasElement | null = null;
    let wideRimLayer: HTMLCanvasElement | null = null;
    let glow1: HTMLCanvasElement | null = null;
    let glow2: HTMLCanvasElement | null = null;
    let g1w = 0, g1h = 0, g2w = 0, g2h = 0;

    let raf = 0;
    let visible = true;
    const start = performance.now();
    let px = -9999;
    let py = -9999;
    let pointerIn = 0;
    let pointerMix = 0;

    const arcY = (x: number) => {
      const dx = x - cx;
      return Math.abs(dx) >= R ? H + 10 : planetCy - Math.sqrt(R * R - dx * dx);
    };

    function renderGlow(color: RGB, rx: number, ry: number, alpha: number) {
      // Soft gradient — render at low resolution, it is scaled up when drawn.
      const scale = 0.5;
      const layer = makeLayer(rx * 2, ry * 2, scale);
      const g = layer.ctx;
      g.translate(rx, ry);
      g.scale(1, ry / rx);
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, rx);
      grad.addColorStop(0, rgba(color, alpha));
      grad.addColorStop(0.45, rgba(color, alpha * 0.45));
      grad.addColorStop(1, rgba(color, 0));
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, rx, 0, Math.PI * 2);
      g.fill();
      return layer.canvas;
    }

    function strokeRim(g: CanvasRenderingContext2D, width: number, blur: number, alpha: number) {
      g.save();
      const grad = g.createLinearGradient(cx - W * 0.5, 0, cx + W * 0.5, 0);
      grad.addColorStop(0, rgba(RIM, 0));
      grad.addColorStop(0.2, rgba(RIM, alpha * 0.55));
      grad.addColorStop(0.5, rgba(CORE, alpha));
      grad.addColorStop(0.8, rgba(RIM, alpha * 0.55));
      grad.addColorStop(1, rgba(RIM, 0));
      g.strokeStyle = grad;
      g.lineWidth = width;
      g.shadowColor = rgba(RIM, alpha);
      g.shadowBlur = blur * dpr;
      const half = Math.asin(Math.min(1, (W * 0.55) / R));
      g.beginPath();
      g.arc(cx, planetCy, R, -Math.PI / 2 - half, -Math.PI / 2 + half);
      g.stroke();
      g.restore();
    }

    function rebuild() {
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);

      cx = W / 2;
      // Arc crest sits ~71% down the hero, like the original layout.
      // Phones stack everything in one tall column, so the arc sits near the
      // bottom (behind the status row) instead of cutting through the content.
      horizonY = W <= 900 ? Math.round(Math.max(H * 0.6, H - 64)) : Math.round(H * 0.71);
      R = Math.max(W, 600) * CURVATURE;
      planetCy = horizonY + R;

      cols = Math.ceil(W / SPACING) + 1;
      rows = Math.ceil(horizonY / SPACING);
      x0 = (W - (cols - 1) * SPACING) / 2 + SPACING / 2;

      const n = cols * rows;
      baseAlpha = new Float32Array(n);
      fade = new Float32Array(n);
      weight = new Float32Array(n);
      isFail = new Uint8Array(n);

      for (let c = 0; c < cols; c++) {
        const x = x0 + c * SPACING;
        const edge = arcY(x);
        const u = 1 - (Math.abs(x - cx) / (W * 0.62)) ** 2;
        for (let r = 0; r < rows; r++) {
          const y = r * SPACING + SPACING / 2;
          const i = c * rows + r;
          if (y > edge - 10) continue;
          const l = Math.min(1, Math.max(0, (y - horizonY * 0.08) / (horizonY * 0.9)));
          const near = Math.max(0, 1 - (edge - y) / 260);
          const p = y < horizonY - 40 ? 0.25 + 0.75 * Math.min(1, Math.abs(x - cx) / (W * 0.2)) : 1;
          const m = Math.max(0, l * u) * (0.16 + 0.22 * near) * p;
          if (m <= 0.01) continue;
          baseAlpha[i] = m;
          fade[i] = l * u;
          weight[i] = u * p;
          isFail[i] = hash(c, r) < FAIL_RATE && l * u > 0.15 && p > 0.85 ? 1 : 0;
        }
      }

      // Static dot layer
      const dots = makeLayer(W, H, dpr);
      for (let c = 0; c < cols; c++) {
        const x = x0 + c * SPACING;
        for (let r = 0; r < rows; r++) {
          const a = baseAlpha[c * rows + r];
          if (!a) continue;
          dots.ctx.fillStyle = rgba(DOT, a);
          dots.ctx.beginPath();
          dots.ctx.arc(x, r * SPACING + SPACING / 2, 1, 0, Math.PI * 2);
          dots.ctx.fill();
        }
      }
      dotsLayer = dots.canvas;

      // Planet body + crisp rim
      const planet = makeLayer(W, H, dpr);
      planet.ctx.beginPath();
      planet.ctx.arc(cx, planetCy, R, 0, Math.PI * 2);
      const fill = planet.ctx.createLinearGradient(0, horizonY, 0, horizonY + 220);
      fill.addColorStop(0, rgba(GLOW1, 0.3));
      fill.addColorStop(0.35, rgba(BG, 0.96));
      fill.addColorStop(1, rgba(BG, 1));
      planet.ctx.fillStyle = fill;
      planet.ctx.fill();
      strokeRim(planet.ctx, 1.6, 14, 0.95);
      planetLayer = planet.canvas;

      // Wide breathing bloom (alpha-modulated per frame)
      const wide = makeLayer(W, H, dpr);
      strokeRim(wide.ctx, 6, 40, 0.35);
      wideRimLayer = wide.canvas;

      g1w = W * 0.42;
      g1h = 260;
      g2w = W * 0.3;
      g2h = 200;
      glow1 = renderGlow(GLOW1, g1w, g1h, BLOOM);
      glow2 = renderGlow(GLOW2, g2w, g2h, BLOOM * 0.55);
    }

    function blitDotColumns(fromCol: number, toCol: number) {
      if (!dotsLayer || toCol < fromCol) return;
      // Column c's dots lie in [x - SPACING/2, x + SPACING/2)
      const sx = Math.max(0, x0 + fromCol * SPACING - SPACING / 2);
      const ex = Math.min(W, x0 + toCol * SPACING + SPACING / 2);
      if (ex <= sx) return;
      ctx!.drawImage(dotsLayer, sx * dpr, 0, (ex - sx) * dpr, H * dpr, sx, 0, ex - sx, H);
    }

    function draw(t: number, animated: boolean) {
      const g = ctx!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const sec = t / 1000;
      const breathe = animated ? 0.88 + 0.12 * Math.sin(sec * 1.1) : 1;
      const sway = animated ? Math.sin(sec * 0.25) * W * 0.04 : 0;

      // Glows behind the horizon
      if (glow1 && glow2) {
        g.globalAlpha = breathe;
        g.drawImage(glow1, cx - W * 0.08 + sway - g1w, horizonY - g1h, g1w * 2, g1h * 2);
        g.drawImage(glow2, cx + W * 0.12 - sway - g2w, horizonY + 10 - g2h, g2w * 2, g2h * 2);
        g.globalAlpha = 1;
      }

      // Beam position
      const span = W + 600;
      const beam = ((sec % SWEEP_SECONDS) / SWEEP_SECONDS) * span - 300;

      // Dynamic column ranges: beam + trail, and cursor
      const ranges: [number, number][] = [];
      const colOf = (x: number) => Math.round((x - x0) / SPACING);
      const clampCol = (c: number) => Math.max(0, Math.min(cols - 1, c));
      ranges.push([clampCol(colOf(beam - TRAIL) - 1), clampCol(colOf(beam + BEAM_REACH) + 1)]);
      if (pointerMix > 0.01) {
        ranges.push([clampCol(colOf(px - POINTER_REACH)), clampCol(colOf(px + POINTER_REACH))]);
      }
      ranges.sort((a, b) => a[0] - b[0]);
      const merged: [number, number][] = [];
      for (const rg of ranges) {
        const last = merged[merged.length - 1];
        if (last && rg[0] <= last[1] + 1) last[1] = Math.max(last[1], rg[1]);
        else merged.push([rg[0], rg[1]]);
      }

      // Static columns between dynamic ranges
      let cursor = 0;
      for (const [a, b] of merged) {
        blitDotColumns(cursor, a - 1);
        cursor = b + 1;
      }
      blitDotColumns(cursor, cols - 1);

      // Dynamic columns
      for (const [a, b] of merged) {
        for (let c = a; c <= b; c++) {
          const x = x0 + c * SPACING;
          const h = x - beam;
          const gBeam = Math.exp(-(h * h) / 4232);
          const trail = h < 0 && h > -TRAIL ? 1 + h / TRAIL : 0;
          for (let r = 0; r < rows; r++) {
            const i = c * rows + r;
            const m = baseAlpha[i];
            if (!m) continue;
            const y = r * SPACING + SPACING / 2;

            if (isFail[i] && trail > 0) {
              const a2 = trail * 0.9 * Math.max(0.35, fade[i]);
              g.strokeStyle = rgba(RIM, a2);
              g.lineWidth = 1.2;
              g.strokeRect(x - 3.5, y - 3.5, 7, 7);
              continue;
            }

            let w = 0;
            if (pointerMix > 0.01) {
              const d2 = (x - px) * (x - px) + (y - py) * (y - py);
              w = pointerMix * Math.exp(-d2 / 28800);
            }
            const wt = weight[i];
            const alpha = m + (gBeam * 0.85 + trail * 0.12) * wt + w * 0.7;
            const radius = 1 + gBeam * 0.9 + w * 0.9;
            g.fillStyle = gBeam > 0.25 || w > 0.3 ? rgba(RIM, alpha) : rgba(DOT, alpha);
            g.beginPath();
            g.arc(x, y, radius, 0, Math.PI * 2);
            g.fill();
          }
        }
      }

      // Faint vertical beam light
      if (beam > -200 && beam < W + 200) {
        const band = g.createLinearGradient(beam - 70, 0, beam + 70, 0);
        band.addColorStop(0, rgba(RIM, 0));
        band.addColorStop(0.5, rgba(RIM, 0.07));
        band.addColorStop(1, rgba(RIM, 0));
        g.fillStyle = band;
        g.fillRect(beam - 70, 0, 140, Math.min(H, arcY(beam)));
      }

      // Planet + rim on top
      if (planetLayer) g.drawImage(planetLayer, 0, 0, W, H);
      if (wideRimLayer) {
        g.globalAlpha = breathe;
        g.drawImage(wideRimLayer, 0, 0, W, H);
        g.globalAlpha = 1;
      }
    }

    function frame() {
      raf = 0;
      if (!visible || document.hidden) return;
      if (motionPaused()) {
        draw(SWEEP_SECONDS * 1000 * 0.62, false);
        return;
      }
      pointerMix += (pointerIn - pointerMix) * 0.08;
      draw(performance.now() - start, true);
      raf = requestAnimationFrame(frame);
    }

    function kick() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      px = event.clientX - rect.left;
      py = event.clientY - rect.top;
      pointerIn = px >= 0 && px <= rect.width && py >= 0 && py <= rect.height ? 1 : 0;
    }
    function onPointerLeave() {
      pointerIn = 0;
    }

    rebuild();
    draw(SWEEP_SECONDS * 1000 * 0.62, false);

    const ro = new ResizeObserver(() => {
      rebuild();
      draw(motionPaused() ? SWEEP_SECONDS * 1000 * 0.62 : performance.now() - start, !motionPaused());
    });
    ro.observe(wrap);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) kick();
    });
    io.observe(wrap);

    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);

    // Resume when the site-wide motion toggle flips back on.
    const mo = new MutationObserver(() => kick());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-eclipse" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-eclipse-canvas" />
    </div>
  );
}
