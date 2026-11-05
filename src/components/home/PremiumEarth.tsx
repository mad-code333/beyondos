"use client";

/**
 * Performance-first dotted Earth (PremiumEarth).
 * - No world-atlas / geoContains on the critical path (those froze the page on Vercel).
 * - Land comes from a compact prebuilt bin (~24k pts, ~280KB).
 * - WebGL mounts only near the viewport; RAF pauses when off-screen.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./PremiumEarth.css";

const EARTH_RADIUS = 1;
const DOT_RADIUS = 1.004;
const DOTS_URL = "/media/earth-dots-lite.bin";

const TBILISI = {
  latitude: 41.7151,
  longitude: 44.8271,
} as const;

const GEORGIA_BASE_ROT = {
  x: 0.18,
  y: THREE.MathUtils.degToRad(-TBILISI.longitude),
  z: 0.02,
} as const;

const EARTH_SCALE = 0.66;

/** Module cache — Strict Mode remount must not re-fetch/parse. */
let landCache: Float32Array | null = null;
let landPromise: Promise<Float32Array> | null = null;

function latLonToVector3(latitude: number, longitude: number, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function yieldToMain() {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 64 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

async function loadLandPositions(maxPoints: number): Promise<Float32Array> {
  if (landCache) {
    return landCache.length / 3 > maxPoints
      ? landCache.subarray(0, maxPoints * 3)
      : landCache;
  }
  if (landPromise) return landPromise;

  landPromise = (async () => {
    await yieldToMain();
    const res = await fetch(DOTS_URL);
    if (!res.ok) throw new Error(`dots ${res.status}`);
    const buf = await res.arrayBuffer();
    await yieldToMain();
    const all = new Float32Array(buf);
    landCache = all;
    return all.length / 3 > maxPoints ? all.subarray(0, maxPoints * 3) : all;
  })().catch((err) => {
    landPromise = null;
    throw err;
  });

  return landPromise;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(74, 222, 128, 0.95)");
  gradient.addColorStop(0.25, "rgba(34, 197, 94, 0.45)");
  gradient.addColorStop(0.6, "rgba(22, 163, 74, 0.1)");
  gradient.addColorStop(1, "rgba(22, 163, 74, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

type ContextAttempt = WebGLContextAttributes & {
  powerPreference?: WebGLPowerPreference;
};

function acquireWebGL2(): { canvas: HTMLCanvasElement; context: WebGL2RenderingContext } | null {
  const attempts: ContextAttempt[] = [
    {
      alpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "default",
      failIfMajorPerformanceCaveat: false,
    },
    {
      alpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: false,
    },
  ];

  for (const attrs of attempts) {
    const canvas = document.createElement("canvas");
    canvas.className = "premium-earth-canvas";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    try {
      const context = canvas.getContext("webgl2", attrs);
      if (context && !context.isContextLost()) return { canvas, context };
    } catch {
      /* next */
    }
  }
  return null;
}

function createWebGLRenderer(): { renderer: THREE.WebGLRenderer; canvas: HTMLCanvasElement } | null {
  const acquired = acquireWebGL2();
  if (!acquired) return null;
  const { canvas, context } = acquired;
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: false,
      alpha: true,
      powerPreference: "default",
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false,
    });
    const gl = renderer.getContext();
    if (!gl || gl.isContextLost()) {
      renderer.dispose();
      return null;
    }
    return { renderer, canvas };
  } catch {
    return null;
  }
}

function GlobeFallback() {
  return (
    <div className="earth-globe-fallback earth-globe-fallback--spin" aria-hidden="true">
      <div className="earth-globe-fallback-map">
        <div className="earth-globe-fallback-track">
          <span className="earth-globe-fallback-pin" />
        </div>
      </div>
    </div>
  );
}

type PremiumEarthProps = {
  className?: string;
};

export function PremiumEarth({ className }: PremiumEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [nearView, setNearView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNearView(true);
      },
      { rootMargin: "320px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!nearView) return;
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const created = createWebGLRenderer();
    if (!created) {
      setFailed(true);
      return;
    }
    const { renderer, canvas } = created;

    const glInfo = renderer.getContext().getExtension("WEBGL_debug_renderer_info");
    const rendererName = glInfo
      ? String(renderer.getContext().getParameter(glInfo.UNMASKED_RENDERER_WEBGL) || "")
      : "";
    // Soft / software GPUs only — do not treat every ANGLE driver as soft.
    const softGpu = /vmware|svga|llvmpipe|swiftshader|softpipe/i.test(rendererName);
    const maxDpr = softGpu ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
    const sphereSeg = softGpu ? 24 : 48;
    const maxLandPoints = softGpu ? 14_000 : 24_000;

    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.02, 4.2);
    camera.lookAt(0, 0, 0);

    const rotationGroup = new THREE.Group();
    rotationGroup.scale.setScalar(EARTH_SCALE);
    const geographicGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroup.add(geographicGroup);
    geographicGroup.rotation.x = GEORGIA_BASE_ROT.x;
    geographicGroup.rotation.z = GEORGIA_BASE_ROT.z;
    rotationGroup.rotation.y = GEORGIA_BASE_ROT.y;

    const oceanGeometry = new THREE.SphereGeometry(EARTH_RADIUS, sphereSeg, sphereSeg);
    const oceanMaterial = new THREE.MeshBasicMaterial({ color: 0x050505 });
    geographicGroup.add(new THREE.Mesh(oceanGeometry, oceanMaterial));

    const occluder = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 0.999, softGpu ? 16 : 32, softGpu ? 16 : 32),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }),
    );
    geographicGroup.add(occluder);

    // Cheap rim instead of atmosphere shader.
    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(1.03, softGpu ? 16 : 32, softGpu ? 16 : 32),
      new THREE.MeshBasicMaterial({
        color: 0xa8a8a0,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    );
    geographicGroup.add(rim);

    const pinScale = 1 / EARTH_SCALE;
    const markerGroup = new THREE.Group();
    markerGroup.position.copy(
      latLonToVector3(TBILISI.latitude, TBILISI.longitude, DOT_RADIUS + 0.018),
    );
    markerGroup.scale.setScalar(pinScale);
    markerGroup.renderOrder = 10;
    geographicGroup.add(markerGroup);

    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), markerMat);
    marker.renderOrder = 11;
    markerGroup.add(marker);

    const glowMat = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      opacity: 0.85,
      toneMapped: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(0.22, 0.22, 1);
    glow.renderOrder = 10;
    markerGroup.add(glow);

    const rotationSpeed = (Math.PI * 2) / 50;
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let disposed = false;
    let spinning = true;
    let spinElapsed = 0;
    const markerWorld = new THREE.Vector3();
    const markerNormal = new THREE.Vector3();
    const camDir = new THREE.Vector3();

    function animate() {
      if (disposed) return;
      animationFrame = requestAnimationFrame(animate);
      if (!spinning) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      if (!reducedMotion) {
        spinElapsed += delta;
        rotationGroup.rotation.y = GEORGIA_BASE_ROT.y + spinElapsed * rotationSpeed;
      }

      markerGroup.getWorldPosition(markerWorld);
      markerNormal.copy(markerWorld).normalize();
      camDir.copy(camera.position).sub(markerWorld).normalize();
      const facing = markerNormal.dot(camDir);
      const visible = THREE.MathUtils.smoothstep(facing, -0.02, 0.18);
      markerGroup.visible = visible > 0.05;
      const pulse = reducedMotion
        ? 1
        : 0.88 + 0.12 * (0.5 + 0.5 * Math.sin((clock.elapsedTime * Math.PI * 2) / 1.3));
      glowMat.opacity = 0.85 * visible * pulse;
      const glowPulse = 0.2 + 0.06 * pulse;
      glow.scale.set(glowPulse, glowPulse, 1);

      try {
        renderer.render(scene, camera);
      } catch {
        if (!disposed) setFailed(true);
      }
    }
    animate();

    const visIo = new IntersectionObserver(
      ([entry]) => {
        spinning = !!entry?.isIntersecting && document.visibilityState === "visible";
      },
      { threshold: 0.05 },
    );
    visIo.observe(container);

    const onVisibility = () => {
      const rect = container.getBoundingClientRect();
      spinning =
        document.visibilityState === "visible" &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let landGeometry: THREE.BufferGeometry | null = null;
    let landMaterial: THREE.PointsMaterial | null = null;
    let landPoints: THREE.Points | null = null;

    void (async () => {
      try {
        const positions = await loadLandPositions(maxLandPoints);
        if (disposed || positions.length === 0) return;
        await yieldToMain();
        if (disposed) return;

        landGeometry = new THREE.BufferGeometry();
        landGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        landMaterial = new THREE.PointsMaterial({
          color: 0xecece6,
          size: softGpu ? 0.012 : 0.01,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
          toneMapped: false,
        });
        landPoints = new THREE.Points(landGeometry, landMaterial);
        geographicGroup.add(landPoints);
      } catch (err) {
        console.warn("[PremiumEarth] land load failed", err);
      }
    })();

    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (!disposed) setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    let resizeRaf = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const nextWidth = container.clientWidth;
        const nextHeight = container.clientHeight;
        if (!nextWidth || !nextHeight) return;
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight, false);
        renderer.setPixelRatio(maxDpr);
      });
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeRaf);
      visIo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);

      landGeometry?.dispose();
      landMaterial?.dispose();
      if (landPoints) geographicGroup.remove(landPoints);
      oceanGeometry.dispose();
      oceanMaterial.dispose();
      occluder.geometry.dispose();
      (occluder.material as THREE.Material).dispose();
      rim.geometry.dispose();
      (rim.material as THREE.Material).dispose();
      marker.geometry.dispose();
      markerMat.dispose();
      glowMat.map?.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [nearView]);

  if (failed) {
    return (
      <div
        className={["premium-earth-container", "earth-globe-wrap", className]
          .filter(Boolean)
          .join(" ")}
        aria-label="Earth globe fallback"
      >
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={["premium-earth-container", "earth-globe-wrap", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Continuously rotating illuminated Earth with a marker at Tbilisi, Georgia"
    />
  );
}

export default PremiumEarth;
