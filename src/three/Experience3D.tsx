import { useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { Color, MathUtils, Group, Mesh } from 'three';

// securify (mono) -> TOONHUB (brand colors), lerped across scroll progress.
const MONO = new Color('#d8d8d8');
const TOON = [new Color('#F4845F'), new Color('#6BBF7A'), new Color('#E882B4'), new Color('#6EB5FF')];

/** Picks the scene's accent color for a given 0..1 scroll progress. */
function accentFor(p: number, out: Color) {
  if (p < 0.45) {
    // securify zone: stay monochrome silver
    return out.copy(MONO);
  }
  // toonhub zone: cycle through the brand palette
  const t = (p - 0.45) / 0.55; // 0..1 across the lower half
  const scaled = t * (TOON.length - 1);
  const i = Math.min(TOON.length - 2, Math.floor(scaled));
  return out.copy(TOON[i]).lerp(TOON[i + 1], scaled - i);
}

type SceneProps = { scroll: MutableRefObject<number> };

function DataCore({ scroll }: SceneProps) {
  const mesh = useRef<Mesh>(null);
  const matColor = useRef(new Color('#d8d8d8'));
  const target = useRef(new Color());

  useFrame((state, delta) => {
    const p = scroll.current;
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += delta * 0.25;
    m.rotation.x = MathUtils.lerp(m.rotation.x, p * Math.PI, 0.05);
    const s = 1 + p * 0.4;
    m.scale.setScalar(MathUtils.lerp(m.scale.x, s, 0.06));
    // ease accent color toward the scroll-driven target
    accentFor(p, target.current);
    matColor.current.lerp(target.current, 0.06);
    const mat = m.material as unknown as { color: Color; emissive: Color };
    mat.color.copy(matColor.current);
    mat.emissive.copy(matColor.current).multiplyScalar(0.15 + Math.sin(state.clock.elapsedTime) * 0.05);
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 8]} />
      <MeshDistortMaterial
        distort={0.35}
        speed={1.6}
        roughness={0.15}
        metalness={0.9}
        color="#d8d8d8"
      />
    </mesh>
  );
}

function FloatingShapes({ scroll }: SceneProps) {
  const group = useRef<Group>(null);
  const target = useRef(new Color());

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.08;
    accentFor(scroll.current, target.current);
    g.children.forEach((child) => {
      const mesh = child.children[0] as Mesh | undefined;
      const mat = mesh?.material as unknown as { color: Color } | undefined;
      if (mat) mat.color.lerp(target.current, 0.04);
    });
  });

  const items: { pos: [number, number, number]; geo: string }[] = [
    { pos: [-3.4, 1.6, -1], geo: 'octahedron' },
    { pos: [3.6, -1.2, -2], geo: 'torus' },
    { pos: [-2.8, -1.8, 0.5], geo: 'dodecahedron' },
    { pos: [3, 1.9, 0], geo: 'tetrahedron' },
    { pos: [0, 2.6, -3], geo: 'torus' },
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

function Rig({ scroll }: SceneProps) {
  useFrame((state) => {
    const p = scroll.current;
    // gentle dolly + parallax with the pointer
    state.camera.position.z = MathUtils.lerp(state.camera.position.z, 6 - p * 1.5, 0.05);
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.6, 0.05);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.4, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Fixed, full-viewport 3D layer that sits behind the whole page and animates
 * with scroll — a distorted metallic "data core", floating geometry, and a star
 * field, shifting from securify's monochrome to TOONHUB's brand colors.
 */
export default function Experience3D({ scroll }: SceneProps) {
  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, 2]} intensity={0.6} />
        <Stars radius={60} depth={40} count={2500} factor={4} saturation={0} fade speed={0.6} />
        <FloatingShapes scroll={scroll} />
        <DataCore scroll={scroll} />
        <Rig scroll={scroll} />
      </Canvas>
    </div>
  );
}
