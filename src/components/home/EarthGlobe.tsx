"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
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
/** Caucasus facing camera at rest */
const BASE_ROT = { x: 0.16, y: -0.78, z: 0.03 } as const;
/** One full revolution every ~50 seconds */
const PERIOD_SEC = 50;
const AUTO_SPEED = (Math.PI * 2) / PERIOD_SEC;

/**
 * Equirectangular → Three.js sphere.
 * Lon west→east, lat north→south; X left-handed flip matches common globe demos.
 */
function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

type DotData = {
  positions: Float32Array;
  colors: Float32Array | null;
};

function useEarthDots() {
  const [data, setData] = useState<DotData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [posRes, colRes] = await Promise.all([
          fetch("/media/earth-dots.bin"),
          fetch("/media/earth-dot-colors.bin").catch(() => null),
        ]);
        if (!posRes.ok) throw new Error("dots missing");
        const posBuf = await posRes.arrayBuffer();
        let colors: Float32Array | null = null;
        if (colRes?.ok) {
          const colBuf = await colRes.arrayBuffer();
          if (colBuf.byteLength === posBuf.byteLength) {
            colors = new Float32Array(colBuf);
          }
        }
        if (!cancelled) {
          setData({ positions: new Float32Array(posBuf), colors });
        }
      } catch {
        if (!cancelled) {
          setData({ positions: buildFallbackDots(), colors: null });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

function buildFallbackDots() {
  const pts: number[] = [];
  const n = 16000;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = ((theta * 180) / Math.PI) % 360;
    const keep =
      (lat > -60 && Math.abs(((lon % 360) + 360) % 90) > 8) ||
      (lat > 15 && lat < 75) ||
      (lat > -45 && lat < 20 && lon > 90 && lon < 180);
    if (!keep && i % 4 !== 0) continue;
    const v = latLonToVec3(lat, ((lon + 540) % 360) - 180, 1);
    pts.push(v.x, v.y, v.z);
  }
  return new Float32Array(pts);
}

type DragState = {
  yaw: number;
  pitch: number;
};

type GlobeSceneProps = {
  reduceMotion: boolean;
  drag: MutableRefObject<DragState>;
};

function LandDots({ data }: { data: DotData }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    if (data.colors) {
      g.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    }
    g.computeBoundingSphere();
    return g;
  }, [data]);

  useEffect(() => () => geom.dispose(), [geom]);

  return (
    <points geometry={geom} scale={RADIUS} frustumCulled={false}>
      <pointsMaterial
        color="#ecece6"
        size={0.0095}
        sizeAttenuation
        transparent
        opacity={0.94}
        depthWrite={false}
        toneMapped={false}
        vertexColors={!!data.colors}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function Atmosphere() {
  return (
    <>
      {/* Soft outer halo */}
      <mesh scale={RADIUS * 1.055}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#c4c4bc"
          transparent
          opacity={0.045}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Delicate rim */}
      <mesh scale={RADIUS * 1.022}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#a8a8a0"
          transparent
          opacity={0.055}
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
      <sphereGeometry args={[1, 64, 64]} />
      {/* Slightly lifted from pure black so the globe silhouette reads on dark stages */}
      <meshStandardMaterial color="#141414" roughness={0.97} metalness={0.02} />
    </mesh>
  );
}

/** Invisible depth writer so the pin occludes on the far side */
function OcclusionSphere() {
  return (
    <mesh scale={RADIUS * 0.999}>
      <sphereGeometry args={[1, 48, 48]} />
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
      : 0.88 + 0.12 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * (Math.PI * 2) / 1.3));
    if (glow.current) {
      (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * visible * pulse;
      glow.current.scale.setScalar(1 + 0.06 * pulse);
    }
  });

  // One solid vibrant grass-green point only — no ring.
  return (
    <group ref={group} position={pos} renderOrder={10}>
      <mesh ref={glow} renderOrder={10}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.4}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh renderOrder={11}>
        <sphereGeometry args={[0.036, 20, 20]} />
        <meshBasicMaterial
          color="#22c55e"
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function EarthGroup({ reduceMotion, drag }: GlobeSceneProps) {
  const group = useRef<THREE.Group>(null);
  const data = useEarthDots();
  const auto = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Cap only pathological stalls; keep motion continuous
    const dt = Math.min(Math.max(delta, 0), 0.05);
    if (!reduceMotion) {
      auto.current += dt * AUTO_SPEED;
    }
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
      {data ? <LandDots data={data} /> : null}
      <TbilisiPin reduceMotion={reduceMotion} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[4.6, 2.9, 3.8]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-3.8, -0.6, -2.6]} intensity={0.22} color="#9a9a94" />
      <pointLight position={[0.15, 1.6, 2.6]} intensity={0.28} color="#d4d4cc" distance={9} />
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
    <div className="earth-globe-fallback" aria-hidden="true">
      <span className="earth-globe-fallback-pin" />
    </div>
  );
}

type EarthGlobeProps = {
  className?: string;
};

export function EarthGlobe({ className }: EarthGlobeProps) {
  const reduce = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const drag = useRef<DragState>({ yaw: 0, pitch: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
        probe.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
        probe.getContext("experimental-webgl");
      if (!gl) setFailed(true);
    } catch {
      setFailed(true);
    }
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
    // Gentle drag offset — auto-rotation never stops
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
      <div className={className} aria-label="Earth globe fallback">
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Earth globe with Georgia marked as home base"
    >
      <GlobeErrorBoundary fallback={<GlobeFallback />}>
        <Canvas
          className="earth-globe-canvas"
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 32, near: 0.1, far: 40 }}
          style={{ touchAction: "none", background: "transparent" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <CameraRig />
            <Lights />
            <EarthGroup reduceMotion={reduce} drag={drag} />
          </Suspense>
        </Canvas>
      </GlobeErrorBoundary>
    </div>
  );
}
