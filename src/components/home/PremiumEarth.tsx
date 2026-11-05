"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesData from "world-atlas/countries-110m.json";
import landData from "world-atlas/land-110m.json";
import "./PremiumEarth.css";

const countriesTopology = countriesData as unknown as Topology<{
  countries: GeometryCollection;
}>;

const landTopology = landData as unknown as Topology<{
  land: GeometryCollection;
}>;

const EARTH_RADIUS = 1;
const DOT_RADIUS = 1.004;

/** Tbilisi, Georgia — WGS84 */
const TBILISI = {
  latitude: 41.7151,
  longitude: 44.8271,
} as const;

const GEORGIA_BASE_ROT = {
  x: 0.18,
  y: THREE.MathUtils.degToRad(-TBILISI.longitude),
  z: 0.02,
} as const;

/** Cached buffers — Strict Mode remounts must not recompute. */
let landBuffers: { positions: Float32Array; colors: Float32Array } | null = null;
let borderPositions: Float32Array | null = null;
let landBuildPromise: Promise<{ positions: Float32Array; colors: Float32Array }> | null =
  null;

/** Visual scale — full sphere fits the stage. */
const EARTH_SCALE = 0.66;

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
      requestIdleCallback(() => resolve(), { timeout: 48 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

function brightnessVariation(lat: number, lon: number) {
  const value = Math.sin(lat * 127.1 + lon * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Rasterize land-110m once — O(1) pixel land tests (never geoContains). */
function rasterizeLandMask(W = 1024, H = 512): ImageData | null {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";

  const collection = feature(landTopology, landTopology.objects.land) as GeoJSON.FeatureCollection;
  for (const f of collection.features) {
    const geom = f.geometry;
    if (!geom) continue;
    const polygons =
      geom.type === "Polygon"
        ? [geom.coordinates]
        : geom.type === "MultiPolygon"
          ? geom.coordinates
          : [];
    for (const polygon of polygons) {
      ctx.beginPath();
      for (const ring of polygon) {
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]!;
          const x = ((lon + 180) / 360) * W;
          const y = ((90 - lat) / 180) * H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
      ctx.fill("evenodd");
    }
  }
  return ctx.getImageData(0, 0, W, H);
}

async function loadLandmaskPng(): Promise<ImageData | null> {
  try {
    const res = await fetch("/media/earth-landmask.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height);
  } catch {
    return null;
  }
}

/**
 * Fast land dots: landmask pixel test + Fibonacci sample.
 * Caps point count so soft GPUs (VMware/ANGLE) stay alive.
 */
async function buildLandBuffersAsync(maxPoints: number) {
  if (landBuffers) return landBuffers;
  if (landBuildPromise) return landBuildPromise;

  landBuildPromise = (async () => {
    await yieldToMain();
    const fromPng = await loadLandmaskPng();
    await yieldToMain();
    const image = fromPng ?? rasterizeLandMask();
    if (!image) {
      landBuffers = { positions: new Float32Array(0), colors: new Float32Array(0) };
      return landBuffers;
    }

    const { data, width: W, height: H } = image;
    const isLand = (lat: number, lon: number) => {
      const x = Math.floor(((lon + 180) / 360) * W) % W;
      const y = Math.max(0, Math.min(H - 1, Math.floor(((90 - lat) / 180) * H)));
      return data[(y * W + x) * 4]! > 100;
    };

    const positions: number[] = [];
    const colors: number[] = [];
    // Oversample candidates; stop once we hit the visual budget.
    const candidates = Math.min(220_000, Math.max(40_000, maxPoints * 4));
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < candidates && positions.length / 3 < maxPoints; i++) {
      const y = 1 - (i / (candidates - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
      const lon = (Math.atan2(z, x) * 180) / Math.PI;
      if (!isLand(lat, lon)) continue;

      const point = latLonToVector3(lat, lon, DOT_RADIUS);
      positions.push(point.x, point.y, point.z);
      const variation = brightnessVariation(lat, lon);
      const brightness = 0.72 + variation * 0.26;
      colors.push(brightness * 0.93, brightness * 0.97, brightness);

      // Yield occasionally so scroll/click stay responsive during first build.
      if (i > 0 && i % 40_000 === 0) await yieldToMain();
    }

    landBuffers = {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
    return landBuffers;
  })().catch((err) => {
    landBuildPromise = null;
    throw err;
  });

  return landBuildPromise;
}

function createLandPointsGeometry(buffers: { positions: Float32Array; colors: Float32Array }) {
  const geometry = new THREE.BufferGeometry();
  // Share cached arrays — no .slice() (avoids multi‑MB GC spikes).
  geometry.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(buffers.colors, 3));
  return geometry;
}

function buildBorderPositions() {
  if (borderPositions) return borderPositions;

  const borderMesh = mesh(
    countriesTopology,
    countriesTopology.objects.countries,
    (a, b) => a !== b,
  );
  const positions: number[] = [];

  function addLine(coordinates: number[][]) {
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lon1, lat1] = coordinates[i]!;
      const [lon2, lat2] = coordinates[i + 1]!;
      if (Math.abs(lon2 - lon1) > 180) continue;
      // Decimate: keep ~every other segment for cheaper lines.
      if (i % 2 === 1) continue;
      const a = latLonToVector3(lat1, lon1, 1.006);
      const b = latLonToVector3(lat2, lon2, 1.006);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  const typed = borderMesh as GeoJSON.MultiLineString | GeoJSON.LineString | null;
  if (typed?.type === "MultiLineString") {
    typed.coordinates.forEach(addLine);
  } else if (typed?.type === "LineString") {
    addLine(typed.coordinates);
  }

  borderPositions = new Float32Array(positions);
  return borderPositions;
}

function createAtmosphere(segments = 48) {
  const geometry = new THREE.SphereGeometry(1.045, segments, segments);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        float intensity = pow(
          0.65 - dot(normalize(vNormal), normalize(vViewPosition)),
          3.0
        );
        gl_FragColor = vec4(0.18, 0.36, 0.56, intensity * 0.28);
      }
    `,
  });
  return new THREE.Mesh(geometry, material);
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

type AcquiredGl = {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
};

function acquireWebGL2(): AcquiredGl | null {
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
      desynchronized: false,
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
      if (context && !context.isContextLost()) {
        return { canvas, context };
      }
    } catch {
      /* try next */
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
  /** Defer WebGL until the stage is near the viewport — stops the page hitch on load. */
  const [nearView, setNearView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNearView(true);
      },
      { rootMargin: "280px 0px", threshold: 0 },
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
    const softGpu = /vmware|svga|llvmpipe|swiftshader|mesa|softpipe|angle/i.test(rendererName);
    const maxDpr = softGpu ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const sphereSeg = softGpu ? 32 : 64;
    const maxLandPoints = softGpu ? 22_000 : 48_000;

    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Skip frames when tab is hidden / offscreen.
    renderer.setAnimationLoop(null);
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
    const oceanMaterial = new THREE.MeshPhongMaterial({
      color: 0x020609,
      shininess: 28,
      specular: 0x172b35,
    });
    geographicGroup.add(new THREE.Mesh(oceanGeometry, oceanMaterial));

    const occluder = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 0.999, softGpu ? 24 : 40, softGpu ? 24 : 40),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }),
    );
    geographicGroup.add(occluder);

    const atmosphere = createAtmosphere(sphereSeg);
    geographicGroup.add(atmosphere);

    // Pin first so Georgia is visible before land finishes.
    const pinScale = 1 / EARTH_SCALE;
    const markerPosition = latLonToVector3(TBILISI.latitude, TBILISI.longitude, DOT_RADIUS + 0.018);
    const markerGroup = new THREE.Group();
    markerGroup.position.copy(markerPosition);
    markerGroup.scale.setScalar(pinScale);
    markerGroup.renderOrder = 10;
    geographicGroup.add(markerGroup);

    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), markerMat);
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);

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

    // Pause RAF when off-screen or tab hidden — major win on Vercel mobile / soft GPU.
    const visIo = new IntersectionObserver(
      ([entry]) => {
        spinning = !!entry?.isIntersecting && document.visibilityState === "visible";
      },
      { threshold: 0.05 },
    );
    visIo.observe(container);

    const onVisibility = () => {
      spinning =
        document.visibilityState === "visible" &&
        container.getBoundingClientRect().bottom > 0 &&
        container.getBoundingClientRect().top < window.innerHeight;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let landGeometry: THREE.BufferGeometry | null = null;
    let landMaterial: THREE.ShaderMaterial | null = null;
    let borderGeometry: THREE.BufferGeometry | null = null;
    let borders: THREE.LineSegments | null = null;
    let landPoints: THREE.Points | null = null;

    void (async () => {
      try {
        // Borders deferred + skipped on soft GPU (countries mesh is costly).
        if (!softGpu) {
          await yieldToMain();
          if (disposed) return;
          borderGeometry = new THREE.BufferGeometry();
          borderGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(buildBorderPositions(), 3),
          );
          borders = new THREE.LineSegments(
            borderGeometry,
            new THREE.LineBasicMaterial({
              color: 0x55717a,
              transparent: true,
              opacity: 0.2,
              depthWrite: false,
            }),
          );
          geographicGroup.add(borders);
        }

        const buffers = await buildLandBuffersAsync(maxLandPoints);
        if (disposed || buffers.positions.length === 0) return;

        landGeometry = createLandPointsGeometry(buffers);
        landMaterial = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          vertexColors: true,
          uniforms: {
            dotSize: { value: softGpu ? 2.2 : 2.6 },
          },
          vertexShader: `
            attribute vec3 color;
            varying vec3 vColor;
            uniform float dotSize;
            void main() {
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = clamp(dotSize * (3.7 / -mvPosition.z), 1.0, 5.0);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              vec2 centered = gl_PointCoord - vec2(0.5);
              float d = length(centered);
              if (d > 0.5) discard;
              float softness = 1.0 - smoothstep(0.22, 0.5, d);
              gl_FragColor = vec4(vColor, softness * 0.95);
            }
          `,
        });
        landPoints = new THREE.Points(landGeometry, landMaterial);
        geographicGroup.add(landPoints);
      } catch (err) {
        console.warn("[PremiumEarth] land build failed", err);
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
      borderGeometry?.dispose();
      if (borders) (borders.material as THREE.Material).dispose();
      if (landPoints) geographicGroup.remove(landPoints);

      oceanGeometry.dispose();
      oceanMaterial.dispose();
      occluder.geometry.dispose();
      (occluder.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      marker.geometry.dispose();
      markerMat.dispose();
      glowMat.map?.dispose();
      glowMat.dispose();

      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
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
