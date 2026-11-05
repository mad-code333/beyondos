"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import landData from "world-atlas/land-110m.json";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import * as THREE from "three";

/** Tbilisi, Georgia — WGS84 */
const TBILISI = { lat: 41.7151, lon: 44.8271 } as const;
const RADIUS = 1.55;
const BASE_ROT = { x: 0.16, y: -0.78, z: 0.03 } as const;
const PERIOD_SEC = 50;
const AUTO_SPEED = (Math.PI * 2) / PERIOD_SEC;

const landTopology = landData as unknown as Topology<{
  land: GeometryCollection;
}>;

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

type DotData = { positions: Float32Array };

let cachedDots: DotData | null = null;

function yieldToMain() {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 48 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

function sampleLandMask(
  img: Uint8ClampedArray,
  W: number,
  H: number,
  maxPoints: number,
): Float32Array {
  const isLand = (lat: number, lon: number) => {
    const x = Math.floor(((lon + 180) / 360) * W) % W;
    const y = Math.max(0, Math.min(H - 1, Math.floor(((90 - lat) / 180) * H)));
    return img[(y * W + x) * 4]! > 100;
  };

  const pts: number[] = [];
  const candidates = Math.min(180_000, maxPoints * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < candidates && pts.length / 3 < maxPoints; i++) {
    const y = 1 - (i / (candidates - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
    const lon = (Math.atan2(z, x) * 180) / Math.PI;
    if (!isLand(lat, lon)) continue;
    const v = latLonToVec3(lat, lon, 1);
    pts.push(v.x, v.y, v.z);
  }
  return new Float32Array(pts);
}

function rasterizeLandTopo(W = 1024, H = 512): ImageData | null {
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

async function buildLandDots(maxPoints: number): Promise<DotData> {
  if (cachedDots) return cachedDots;
  await yieldToMain();

  // Prefer prebuilt bin when present, but downsample so soft GPUs don't choke.
  try {
    const posRes = await fetch("/media/earth-dots-lite.bin");
    if (posRes.ok) {
      const buf = await posRes.arrayBuffer();
      const all = new Float32Array(buf);
      const total = all.length / 3;
      if (total <= maxPoints) {
        cachedDots = { positions: all };
        return cachedDots;
      }
      const step = Math.ceil(total / maxPoints);
      const pts = new Float32Array(Math.floor(total / step) * 3);
      let o = 0;
      for (let i = 0; i < total; i += step) {
        const j = i * 3;
        pts[o++] = all[j]!;
        pts[o++] = all[j + 1]!;
        pts[o++] = all[j + 2]!;
      }
      cachedDots = { positions: pts.subarray(0, o) };
      return cachedDots;
    }
  } catch {
    /* fall through */
  }

  const fromPng = await loadLandmaskPng();
  await yieldToMain();
  const image = fromPng ?? rasterizeLandTopo();
  if (!image) {
    cachedDots = { positions: new Float32Array(0) };
    return cachedDots;
  }
  cachedDots = {
    positions: sampleLandMask(image.data, image.width, image.height, maxPoints),
  };
  return cachedDots;
}

function useEarthDots(maxPoints: number) {
  const [data, setData] = useState<DotData | null>(null);
  useEffect(() => {
    let cancelled = false;
    void buildLandDots(maxPoints).then((dots) => {
      if (!cancelled) setData(dots);
    });
    return () => {
      cancelled = true;
    };
  }, [maxPoints]);
  return data;
}

type DragState = { yaw: number; pitch: number };

type GlobeSceneProps = {
  reduceMotion: boolean;
  drag: MutableRefObject<DragState>;
  maxPoints: number;
  active: boolean;
};

function LandDots({ data }: { data: DotData }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.computeBoundingSphere();
    return g;
  }, [data]);

  useEffect(() => () => geom.dispose(), [geom]);

  return (
    <points geometry={geom} scale={RADIUS} frustumCulled={false}>
      <pointsMaterial
        color="#ecece6"
        size={0.011}
        sizeAttenuation
        transparent
        opacity={0.92}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh scale={RADIUS * 1.055}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#c4c4bc"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={RADIUS * 1.022}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#a8a8a0"
          transparent
          opacity={0.05}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function CoreSphere() {
  return (
    <mesh scale={RADIUS * 0.992}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#050505" />
    </mesh>
  );
}

function OcclusionSphere() {
  return (
    <mesh scale={RADIUS * 0.999}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial colorWrite={false} depthWrite />
    </mesh>
  );
}

function TbilisiPin({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToVec3(TBILISI.lat, TBILISI.lon, RADIUS * 1.02), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }) => {
    if (!group.current) return;
    group.current.getWorldPosition(world);
    normal.copy(world).normalize();
    camDir.copy(camera.position).sub(world).normalize();
    const facing = normal.dot(camDir);
    const visible = THREE.MathUtils.smoothstep(facing, -0.02, 0.18);
    group.current.visible = visible > 0.05;
    const pulse = reduceMotion
      ? 1
      : 0.88 + 0.12 * (0.5 + 0.5 * Math.sin((clock.elapsedTime * Math.PI * 2) / 1.3));
    if (glow.current) {
      (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * visible * pulse;
      glow.current.scale.setScalar(1 + 0.08 * pulse);
    }
  });

  return (
    <group ref={group} position={pos} renderOrder={10}>
      <mesh ref={glow} renderOrder={10}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial
          color="#00e676"
          transparent
          opacity={0.55}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh renderOrder={11}>
        <sphereGeometry args={[0.042, 14, 14]} />
        <meshBasicMaterial
          color="#00e676"
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function EarthGroup({ reduceMotion, drag, maxPoints, active }: GlobeSceneProps) {
  const group = useRef<THREE.Group>(null);
  const data = useEarthDots(maxPoints);
  const auto = useRef(0);

  useFrame((_, delta) => {
    if (!group.current || !active) return;
    const dt = Math.min(Math.max(delta, 0), 0.05);
    if (!reduceMotion) auto.current += dt * AUTO_SPEED;
    group.current.rotation.y = BASE_ROT.y + auto.current + drag.current.yaw;
    group.current.rotation.x = THREE.MathUtils.clamp(
      BASE_ROT.x + drag.current.pitch,
      -0.32,
      0.48,
    );
    group.current.rotation.z = BASE_ROT.z;
  });

  return (
    <group ref={group}>
      <CoreSphere />
      <OcclusionSphere />
      <Atmosphere />
      {data && data.positions.length > 0 ? <LandDots data={data} /> : null}
      <TbilisiPin reduceMotion={reduceMotion} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[4.6, 2.9, 3.8]} intensity={0.9} color="#ffffff" />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.06, 4.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

class GlobeErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
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

type EarthGlobeProps = { className?: string };

export function EarthGlobe({ className }: EarthGlobeProps) {
  const reduce = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const [nearView, setNearView] = useState(false);
  const [active, setActive] = useState(true);
  const [softGpu, setSoftGpu] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState>({ yaw: 0, pitch: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const gl =
        (probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) as WebGL2RenderingContext | null) ||
        (probe.getContext("webgl", { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null);
      if (!gl) {
        setFailed(true);
        return;
      }
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      if (info) {
        const name = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "");
        setSoftGpu(/vmware|svga|llvmpipe|swiftshader|mesa|softpipe|angle/i.test(name));
      }
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setNearView(true);
      },
      { rootMargin: "280px 0px", threshold: 0 },
    );
    const vis = new IntersectionObserver(
      ([e]) => setActive(!!e?.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.05 },
    );
    near.observe(el);
    vis.observe(el);
    const onVis = () =>
      setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      near.disconnect();
      vis.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []); 

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    drag.current.yaw += dx * 0.0038;
    drag.current.pitch = THREE.MathUtils.clamp(
      drag.current.pitch + dy * 0.0024,
      -0.4,
      0.4,
    );
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  if (failed) {
    return (
      <div ref={wrapRef} className={className} aria-label="Earth globe fallback">
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Earth globe with Georgia marked as home base"
    >
      {nearView ? (
        <GlobeErrorBoundary fallback={<GlobeFallback />}>
          <Canvas
            className="earth-globe-canvas"
            dpr={softGpu ? 1 : [1, 1.5]}
            frameloop={active ? "always" : "never"}
            gl={{
              antialias: !softGpu,
              alpha: true,
              powerPreference: softGpu ? "low-power" : "default",
              failIfMajorPerformanceCaveat: false,
            }}
            camera={{ fov: 32, near: 0.1, far: 40 }}
            style={{ touchAction: "none", background: "transparent" }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <Suspense fallback={null}>
              <CameraRig />
              <Lights />
              <EarthGroup
                reduceMotion={reduce}
                drag={drag}
                maxPoints={softGpu ? 22_000 : 42_000}
                active={active}
              />
            </Suspense>
          </Canvas>
        </GlobeErrorBoundary>
      ) : null}
    </div>
  );
}

export default EarthGlobe;
