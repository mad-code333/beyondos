"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import { geoContains } from "d3-geo";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesData from "world-atlas/countries-50m.json";
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

const TBILISI = {
  latitude: 41.7151,
  longitude: 44.8271,
};

/** Cached land / border buffers — Strict Mode remounts must not recompute. */
let landBuffers: { positions: Float32Array; colors: Float32Array } | null = null;
let borderPositions: Float32Array | null = null;
let landBuildPromise: Promise<{ positions: Float32Array; colors: Float32Array }> | null = null;

/** +Z front, +Y north, positive lon toward +X */
function latLonToVector3(latitude: number, longitude: number, radius = EARTH_RADIUS) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);

  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}

function brightnessVariation(lat: number, lon: number) {
  const value = Math.sin(lat * 127.1 + lon * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function yieldToMain() {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 32 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Land dots use land-110m (single landmass) for geoContains so the main thread
 * is not frozen for minutes. Borders still come from countries-50m.
 * Work is chunked so the 75s spin keeps running while dots build.
 */
async function buildLandBuffersAsync() {
  if (landBuffers) return landBuffers;
  if (landBuildPromise) return landBuildPromise;

  landBuildPromise = (async () => {
    const landFeature = feature(landTopology, landTopology.objects.land) as
      | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
      | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

    const landGeom =
      landFeature.type === "FeatureCollection"
        ? ({
            type: "MultiPolygon",
            coordinates: landFeature.features.flatMap((f) =>
              f.geometry.type === "Polygon"
                ? [f.geometry.coordinates]
                : f.geometry.coordinates,
            ),
          } as GeoJSON.MultiPolygon)
        : landFeature.geometry;

    const positions: number[] = [];
    const colors: number[] = [];
    const spacing = 0.6;
    let row = 0;

    for (let latitude = -89.5; latitude <= 89.5; latitude += spacing) {
      for (let longitude = -180; longitude < 180; longitude += spacing) {
        if (!geoContains(landGeom, [longitude, latitude])) continue;

        const point = latLonToVector3(latitude, longitude, DOT_RADIUS);
        positions.push(point.x, point.y, point.z);

        const variation = brightnessVariation(latitude, longitude);
        const brightness = 0.68 + variation * 0.28;
        colors.push(brightness * 0.91, brightness * 0.97, brightness);
      }

      row += 1;
      // Keep requestAnimationFrame alive while sampling.
      if (row % 4 === 0) await yieldToMain();
    }

    landBuffers = {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
    return landBuffers;
  })();

  return landBuildPromise;
}

function createLandPointsGeometry(buffers: { positions: Float32Array; colors: Float32Array }) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(buffers.positions.slice(), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(buffers.colors.slice(), 3));
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

function createCountryBordersGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(buildBorderPositions().slice(), 3),
  );
  return geometry;
}

function createAtmosphere(segments = 96) {
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
        vec3 atmosphereColor = vec3(0.18, 0.36, 0.56);
        gl_FragColor = vec4(atmosphereColor, intensity * 0.32);
      }
    `,
  });

  return new THREE.Mesh(geometry, material);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 194, 91, 0.95)");
  gradient.addColorStop(0.12, "rgba(255, 181, 65, 0.45)");
  gradient.addColorStop(0.4, "rgba(255, 169, 45, 0.12)");
  gradient.addColorStop(1, "rgba(255, 169, 45, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

type ContextAttempt = WebGLContextAttributes & {
  powerPreference?: WebGLPowerPreference;
};

type AcquiredGl = {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
};

/**
 * Create WebGL2 ourselves, then hand the context to Three.
 * Fresh canvas per attempt — a failed getContext can poison that canvas on
 * VMware/ANGLE. Never lets THREE allocate the context (avoids console.error).
 */
function acquireWebGL2(): AcquiredGl | null {
  // Keep attempts few — each failed getContext hammers a fragile GPU process.
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
      /* try next attribute set */
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
      <span className="earth-globe-fallback-pin" />
    </div>
  );
}

type PremiumEarthProps = {
  className?: string;
};

export function PremiumEarth({ className }: PremiumEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
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

    // VMware / Mesa / SwiftShader: keep draw cost low so the context stays alive.
    const glInfo = renderer.getContext().getExtension("WEBGL_debug_renderer_info");
    const rendererName = glInfo
      ? String(renderer.getContext().getParameter(glInfo.UNMASKED_RENDERER_WEBGL) || "")
      : "";
    const softGpu = /vmware|svga|llvmpipe|swiftshader|mesa|softpipe/i.test(rendererName);
    const maxDpr = softGpu ? 1 : 2;
    const sphereSeg = softGpu ? 48 : 96;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.7);

    const rotationGroup = new THREE.Group();
    const geographicGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroup.add(geographicGroup);

    // Bring Georgia toward the front
    rotationGroup.rotation.y = THREE.MathUtils.degToRad(-TBILISI.longitude);

    const oceanGeometry = new THREE.SphereGeometry(EARTH_RADIUS, sphereSeg, sphereSeg);
    const oceanMaterial = new THREE.MeshPhongMaterial({
      color: 0x020609,
      shininess: 35,
      specular: 0x172b35,
    });
    geographicGroup.add(new THREE.Mesh(oceanGeometry, oceanMaterial));

    // Borders first (lighter than land dots)
    let borderGeometry: THREE.BufferGeometry | null = null;
    let borders: THREE.LineSegments | null = null;
    try {
      borderGeometry = createCountryBordersGeometry();
      borders = new THREE.LineSegments(
        borderGeometry,
        new THREE.LineBasicMaterial({
          color: 0x55717a,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        }),
      );
      geographicGroup.add(borders);
    } catch (err) {
      console.warn("[PremiumEarth] borders failed", err);
    }

    const atmosphere = createAtmosphere(sphereSeg);
    geographicGroup.add(atmosphere);

    const markerPosition = latLonToVector3(TBILISI.latitude, TBILISI.longitude, 1.012);
    const markerGroup = new THREE.Group();
    markerGroup.position.copy(markerPosition);
    geographicGroup.add(markerGroup);

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.007, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffc56b }),
    );
    markerGroup.add(marker);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      }),
    );
    glow.scale.set(0.13, 0.13, 1);
    markerGroup.add(glow);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);

    const blueFill = new THREE.DirectionalLight(0x456f99, 0.35);
    blueFill.position.set(3, -2, -3);
    scene.add(blueFill);

    // One revolution every 75 seconds — starts immediately.
    const rotationSpeed = (Math.PI * 2) / 75;
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let disposed = false;

    function animate() {
      if (disposed) return;
      animationFrame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      if (!reducedMotion) {
        rotationGroup.rotation.y += rotationSpeed * delta;
      }
      // Readable by tests / DevTools to confirm the spin is alive.
      canvas.dataset.earthYaw = String(rotationGroup.rotation.y);
      try {
        renderer.render(scene, camera);
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    animate();

    let landGeometry: THREE.BufferGeometry | null = null;
    let landMaterial: THREE.ShaderMaterial | null = null;

    // Skip dense point cloud on soft/VM GPUs — borders + ocean stay readable.
    if (!softGpu) {
      void buildLandBuffersAsync()
        .then((buffers) => {
          if (disposed) return;
          landGeometry = createLandPointsGeometry(buffers);
          landMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            vertexColors: true,
            uniforms: {
              dotSize: { value: 2.5 },
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
                float distanceFromCenter = length(centered);
                if (distanceFromCenter > 0.5) discard;
                float softness = 1.0 - smoothstep(0.22, 0.5, distanceFromCenter);
                gl_FragColor = vec4(vColor, softness * 0.95);
              }
            `,
          });
          geographicGroup.add(new THREE.Points(landGeometry, landMaterial));
        })
        .catch((err) => {
          console.warn("[PremiumEarth] land build failed", err);
        });
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (!disposed) setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight) return;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);

      landGeometry?.dispose();
      landMaterial?.dispose();
      borderGeometry?.dispose();
      if (borders) (borders.material as THREE.Material).dispose();

      oceanGeometry.dispose();
      oceanMaterial.dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
      glow.material.map?.dispose();
      glow.material.dispose();

      // Do not forceContextLoss — on VMware/ANGLE that breaks Strict Mode remount
      // ("BindToCurrentSequence failed") and any later WebGL on the page.
      renderer.dispose();

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

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
