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

const TBILISI = { lat: 41.7151, lon: 44.8271 } as const;
const RADIUS = 1.55;
/** Rest pose: Caucasus / Georgia facing camera, slight axial tilt */
const BASE_ROT = { x: 0.18, y: -0.72, z: 0.04 } as const;
const AUTO_SPEED = 0.09;
const PITCH_DRIFT = 0.012;

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function useEarthDots() {
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/media/earth-dots.bin")
      .then((res) => {
        if (!res.ok) throw new Error("dots missing");
        return res.arrayBuffer();
      })
      .then((buf) => {
        if (!cancelled) setPositions(new Float32Array(buf));
      })
      .catch(() => {
        if (!cancelled) setPositions(buildFallbackDots());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return positions;
}

function buildFallbackDots() {
  const pts: number[] = [];
  const r = 1;
  // Sparse Fibonacci-ish sphere sample — better than pure random blobs
  const n = 12000;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    // Bias toward northern landmasses for recognizable silhouette
    const lat = Math.asin(y) * (180 / Math.PI);
    const lon = ((theta * 180) / Math.PI) % 360;
    const keep =
      (lat > -55 && Math.abs(lon % 90) > 12) ||
      (lat > 20 && lat < 75) ||
      (lat > -40 && lat < 15 && lon > 100 && lon < 160);
    if (!keep && i % 5 !== 0) continue;
    pts.push(r * Math.cos(theta) * radiusAtY, r * y, r * Math.sin(theta) * radiusAtY);
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

function LandDots({ positions }: { positions: Float32Array }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.computeBoundingSphere();
    return g;
  }, [positions]);

  useEffect(() => () => geom.dispose(), [geom]);

  return (
    <points geometry={geom} scale={RADIUS} frustumCulled={false}>
      <pointsMaterial
        color="#e8e8e2"
        size={0.011}
        sizeAttenuation
        transparent
        opacity={0.92}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh scale={RADIUS * 1.045}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#c8c8c0"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={RADIUS * 1.018}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#9a9a94"
          transparent
          opacity={0.04}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function CoreSphere() {
  return (
    <mesh scale={RADIUS * 0.994}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#040404" roughness={0.96} metalness={0.04} />
    </mesh>
  );
}

function TbilisiPin({ reduceMotion }: { reduceMotion: boolean }) {
  const pos = useMemo(() => latLonToVec3(TBILISI.lat, TBILISI.lon, RADIUS * 1.014), []);
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!glow.current || reduceMotion) return;
    const s = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.06;
    glow.current.scale.setScalar(s);
  });

  return (
    <group position={pos}>
      <mesh ref={glow}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial color="#f0c14a" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.013, 16, 16]} />
        <meshBasicMaterial color="#f5c84a" toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.03, 32]} />
        <meshBasicMaterial
          color="#f0c14a"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function EarthGroup({ reduceMotion, drag }: GlobeSceneProps) {
  const group = useRef<THREE.Group>(null);
  const positions = useEarthDots();
  const auto = useRef(0);
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    if (!reduceMotion) {
      auto.current += dt * AUTO_SPEED;
      clockRef.current += dt;
    }
    const pitchWave = reduceMotion ? 0 : Math.sin(clockRef.current * 0.35) * PITCH_DRIFT;
    group.current.rotation.y = BASE_ROT.y + auto.current + drag.current.yaw;
    group.current.rotation.x = THREE.MathUtils.clamp(
      BASE_ROT.x + drag.current.pitch + pitchWave,
      -0.35,
      0.55,
    );
    group.current.rotation.z = BASE_ROT.z;
  });

  return (
    <group ref={group}>
      <CoreSphere />
      <Atmosphere />
      {positions ? <LandDots positions={positions} /> : null}
      <TbilisiPin reduceMotion={reduceMotion} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.24} />
      <directionalLight position={[4.4, 2.8, 3.6]} intensity={1.35} color="#ffffff" />
      <directionalLight position={[-3.6, -0.8, -2.8]} intensity={0.28} color="#9a9a94" />
      <pointLight position={[0.2, 1.8, 2.4]} intensity={0.35} color="#d8d8d0" distance={8} />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.08, 4.25);
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
    drag.current.yaw += dx * 0.0045;
    drag.current.pitch = THREE.MathUtils.clamp(
      drag.current.pitch + dy * 0.0028,
      -0.45,
      0.45,
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
