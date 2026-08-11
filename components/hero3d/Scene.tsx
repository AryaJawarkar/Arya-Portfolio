'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { TECH, logoDataUri, type TechLogo } from './techLogos';

/**
 * The hero constellation: Arya's stack orbiting the headline.
 *
 * The centre is deliberately empty of solid geometry — the name IS the core of
 * the system, so nothing is allowed to sit behind it and fight the type. Each
 * node is the technology's own logo, and every node travels on exactly the ring
 * it is drawn against: the ring geometry and the node's position are generated
 * from the same circle in the same local space, with the inclination applied
 * once on the shared parent group.
 */

type Orbit = {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  items: TechLogo[];
};

const ORBITS: Orbit[] = [
  {
    // Inner ring: the frontend Arya works in day to day.
    radius: 4.6,
    rotation: [0.4, 0.15, 0],
    speed: 0.17,
    items: [TECH.react, TECH.typescript, TECH.next],
  },
  {
    // Middle ring: the Python/Flask services and their data stores.
    radius: 6.3,
    rotation: [-0.52, -0.3, 0.08],
    speed: -0.13,
    items: [TECH.python, TECH.flask, TECH.postgres, TECH.mongo],
  },
  {
    // Outer ring: the cloud it ships to, and the tools around it.
    radius: 8.1,
    rotation: [0.72, 0.45, -0.12],
    speed: 0.1,
    items: [TECH.aws, TECH.git, TECH.postman],
  },
];

// Screen-space ellipse the headline occupies, in NDC. Nodes fade out inside it
// so a logo can never land on top of the name.
const TEXT_GUARD_X = 0.62;
const TEXT_GUARD_Y = 0.34;

function OrbitNode({
  logo,
  radius,
  speed,
  phase,
}: {
  logo: TechLogo;
  radius: number;
  speed: number;
  phase: number;
}) {
  const anchor = useRef<THREE.Group>(null);
  const mark = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const labelEl = useRef<HTMLSpanElement>(null);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  // Built here rather than via useLoader so the colour space can be set on the
  // texture we own (mutating a hook's return value is disallowed).
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(logoDataUri(logo));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [logo]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock, camera }) => {
    const node = anchor.current;
    if (!node) return;

    // Same circle the ring is drawn from, in the same local space.
    const t = clock.getElapsedTime() * speed + phase;
    node.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);

    node.getWorldPosition(worldPos);

    // Counter-scale by distance so every mark renders at the same size on
    // screen. Raw perspective made the near logos several times larger than
    // the far ones, which read as clutter rather than depth.
    if (mark.current) {
      mark.current.scale.setScalar(
        camera.position.distanceTo(worldPos) * 0.055
      );
    }

    // Fade the logo and its label as they approach the headline. Mutates
    // worldPos into NDC, so it has to come after the distance measurement.
    worldPos.project(camera);
    const d = Math.hypot(worldPos.x / TEXT_GUARD_X, worldPos.y / TEXT_GUARD_Y);
    const fade = THREE.MathUtils.clamp((d - 1) / 0.45, 0, 1);

    if (material.current) material.current.opacity = 0.15 + fade * 0.85;
    if (labelEl.current) labelEl.current.style.opacity = String(fade * 0.8);
  });

  return (
    <group ref={anchor}>
      {/* Billboarded so the mark always faces the viewer — a logo turned
          edge-on is just a line. */}
      <Billboard>
        <mesh ref={mark}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={material}
            map={texture}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      {/* Label sits below the mark. Offset in CSS pixels rather than world
          units, so it tracks the now depth-independent logo size.
          zIndexRange keeps it beneath the hero copy (z-10). */}
      <Html center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ transform: 'translateY(34px)' }}>
          <span
            ref={labelEl}
            className="whitespace-nowrap font-mono text-[10px] tracking-widest uppercase text-blue-100/80"
            style={{ opacity: 0 }}
          >
            {logo.label}
          </span>
        </div>
      </Html>
    </group>
  );
}

function OrbitPath({ orbit }: { orbit: Orbit }) {
  // Built as a THREE.Line object rather than a <line> element: in React 19's
  // JSX types `line` resolves to the SVG element, not the three.js one.
  const ring = useMemo(() => {
    const segments = 160;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(a) * orbit.radius,
          0,
          Math.sin(a) * orbit.radius
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: '#60a5fa',
      transparent: true,
      opacity: 0.22,
    });
    return new THREE.Line(geometry, material);
  }, [orbit.radius]);

  return (
    <group rotation={orbit.rotation}>
      <primitive object={ring} />
      {orbit.items.map((item, i) => (
        <OrbitNode
          key={item.label}
          logo={item}
          radius={orbit.radius}
          speed={orbit.speed}
          // Evenly spaced around the ring.
          phase={(i / orbit.items.length) * Math.PI * 2}
        />
      ))}
    </group>
  );
}

export default function Scene({ progress }: { progress: MotionValue<number> }) {
  const system = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame(({ camera, pointer: p }, delta) => {
    const scrolled = progress.get(); // 0 -> in hero, 1 -> scrolled past

    // Damped mouse parallax.
    pointer.current.x += (p.x - pointer.current.x) * 0.04;
    pointer.current.y += (p.y - pointer.current.y) * 0.04;

    if (system.current) {
      system.current.rotation.y += delta * 0.045;
      system.current.rotation.x = THREE.MathUtils.lerp(
        system.current.rotation.x,
        pointer.current.y * 0.16 - scrolled * 0.7,
        0.06
      );
      system.current.position.y = THREE.MathUtils.lerp(
        system.current.position.y,
        -scrolled * 2.2,
        0.1
      );
      system.current.scale.setScalar(1 - scrolled * 0.28);
    }

    if (shell.current) {
      shell.current.rotation.y -= delta * 0.05;
      shell.current.rotation.x += delta * 0.02;
    }

    // Camera drifts back as the hero scrolls away.
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.5, 0.05),
      THREE.MathUtils.lerp(camera.position.y, pointer.current.y * 0.3, 0.05),
      THREE.MathUtils.lerp(camera.position.z, 9 + scrolled * 3, 0.06)
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight
        position={[7, 5, 6]}
        intensity={110}
        distance={26}
        color="#60a5fa"
      />
      <pointLight
        position={[-7, -4, -2]}
        intensity={80}
        distance={26}
        color="#a78bfa"
      />

      {/* Pushed back so the system reads as depth behind the headline. */}
      <group ref={system} position={[0, 0, -3]}>
        {/* A thin wireframe shell at the centre — structure without mass, so
            it never washes out the name sitting in front of it. */}
        <mesh ref={shell} scale={2.1}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#93c5fd"
            wireframe
            transparent
            opacity={0.13}
            toneMapped={false}
          />
        </mesh>

        {ORBITS.map((orbit) => (
          <OrbitPath key={orbit.radius} orbit={orbit} />
        ))}
      </group>

      <Sparkles
        count={200}
        scale={[16, 9, 12]}
        size={2.6}
        speed={0.25}
        color="#bfdbfe"
        opacity={0.9}
      />
    </>
  );
}
