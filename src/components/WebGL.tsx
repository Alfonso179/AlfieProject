import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Sky,
  Environment as DreiEnvironment,
} from '@react-three/drei';
import { CameraProvider } from '../providers/CameraProvider';
import { Debug, Physics, useContactMaterial } from '@react-three/cannon';
import SkateboardController from './SkateboardController';
import { usePlane } from '@react-three/cannon';
import * as CANNON from 'cannon-es';

// GroundPlane component accepting material as prop
const GroundPlane = ({ material }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: material,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightgrey" />
    </mesh>
  );
};

// New component for physics materials and contact materials
const PhysicsMaterials = () => {
  const groundMaterial = useMemo(
    () => new CANNON.Material('groundMaterial'),
    []
  );
  const skateboardMaterial = useMemo(
    () => new CANNON.Material('skateboardMaterial'),
    []
  );

  // Must be inside Physics provider
  useContactMaterial(groundMaterial, skateboardMaterial, {
    friction: 0.01,
    restitution: 0.0,
  });

  return (
    <>
      {/* Pass materials to components */}
      <GroundPlane material={groundMaterial} />
      <SkateboardController material={skateboardMaterial} />
    </>
  );
};

const WebGL = () => {
  return (
    <CameraProvider>
      <Canvas
        shadows
        camera={{ fov: 50, position: [0, 5, 10] }}
        gl={{ alpha: false }}
      >
        {/* Lighting and other components */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[-50, 50, -50]}
          intensity={0.4}
          castShadow
        />

        {/* Physics provider */}
        <Physics gravity={[0, -9.82, 0]}>
          <Debug scale={1}>
            <Suspense fallback={null}>
              {/* Render PhysicsMaterials inside Physics */}
              <PhysicsMaterials />
            </Suspense>
          </Debug>
        </Physics>

        {/* Environment and controls */}
        <Sky sunPosition={[500, 150, -1000]} turbidity={20} />
        <DreiEnvironment preset="city" />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </CameraProvider>
  );
};

export default WebGL;
