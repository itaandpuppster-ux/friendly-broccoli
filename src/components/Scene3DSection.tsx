import { useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { MathUtils, Group, Mesh } from 'three';

type P = { progress: MutableRefObject<number> };

/** Distorted metallic core that tumbles and scales with the section's scroll. */
function DataCore({ progress }: P) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current;
    m.rotation.y += delta * 0.25;
    m.rotation.x = MathUtils.lerp(m.rotation.x, p * Math.PI * 2, 0.06);
    m.scale.setScalar(MathUtils.lerp(m.scale.x, 1 + p * 0.4, 0.06));
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 8]} />
      <MeshDistortMaterial distort={0.35} speed={1.6} roughness={0.15} metalness={0.9} color="#d8d8d8" />
    </mesh>
  );
}

/** A ring of small shapes drifting around the core. */
function FloatingShapes() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });
  const items = [
    { pos: [-3.4, 1.6, -1] as [number, number, number], geo: 'octahedron' },
    { pos: [3.6, -1.2, -2] as [number, number, number], geo: 'torus' },
    { pos: [-2.8, -1.8, 0.5] as [number, number, number], geo: 'dodecahedron' },
    { pos: [3, 1.9, 0] as [number, number, number], geo: 'tetrahedron' },
    { pos: [0, 2.6, -3] as [number, number, number], geo: 'torus' },
  ];
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={it.pos}>
            {it.geo === 'octahedron' && <octahedronGeometry args={[0.55]} />}
            {it.geo === 'torus' && <torusGeometry args={[0.4, 0.16, 16, 40]} />}
            {it.geo === 'dodecahedron' && <dodecahedronGeometry args={[0.5]} />}
            {it.geo === 'tetrahedron' && <tetrahedronGeometry args={[0.6]} />}
            <meshStandardMaterial color="#d8d8d8" roughness={0.25} metalness={0.7} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/** Gentle camera dolly + pointer parallax. */
function Rig({ progress }: P) {
  useFrame((state) => {
    const p = progress.current;
    state.camera.position.z = MathUtils.lerp(state.camera.position.z, 6 - p * 1.5, 0.05);
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.6, 0.05);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.4, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * A single, self-contained 3D section: the moving 3D core lives inside this
 * section's own canvas (it scrolls with the page, not a fixed global layer) and
 * animates with the section's scroll progress.
 */
export default function Scene3DSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      progress.current = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, 2]} intensity={0.6} />
          <Stars radius={60} depth={40} count={2500} factor={4} saturation={0} fade speed={0.6} />
          <FloatingShapes />
          <DataCore progress={progress} />
          <Rig progress={progress} />
        </Canvas>
      </div>

      <div className="reveal pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">security in motion</p>
        <h2 className="hero-title mt-5 text-5xl md:text-7xl font-medium lowercase text-white">
          protection you can see
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-white/70">
          a live, three-dimensional core that spins, drifts, and reacts as you scroll.
        </p>
      </div>
    </section>
  );
}
