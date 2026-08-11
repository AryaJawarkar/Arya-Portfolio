'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import Scene from './Scene';

const HeroCanvas = ({ progress }: { progress: MotionValue<number> }) => {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <Scene progress={progress} />
      </Suspense>
    </Canvas>
  );
};

export default HeroCanvas;
