import React, { Suspense, useEffect, useMemo, useRef } from 'react';
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
import CameraController from './CameraController';
import { Object3D } from 'three';

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
const PhysicsMaterials: React.FC<{
  skateboardRef: React.RefObject<THREE.Group>;
}> = ({ skateboardRef }) => {
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

  useEffect(() => {
    if (skateboardRef.current) {
      console.log('WebGL skateboardRef.current:', skateboardRef.current);
    }
  }, [skateboardRef]);
  return (
    <>
      {/* Pass materials to components */}
      <GroundPlane material={groundMaterial} />
      <SkateboardController ref={skateboardRef} material={skateboardMaterial} />
    </>
  );
};

const WebGL = () => {
  const skateboardRef = useRef<Three.Group>(null);


  return (
    // <CameraProvider>
    <Canvas
      shadows
      camera={{ fov: 50, position: [0, 5, 10] }}
      gl={{ alpha: false }}
    >
      {/* Lighting and other components */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-50, 50, -50]} intensity={0.4} castShadow />

      {/* Physics provider */}
      <Physics gravity={[0, -9.82, 0]}>
        <Debug scale={1}>
          <Suspense fallback={null}>
            {/* Render PhysicsMaterials inside Physics */}
            <PhysicsMaterials skateboardRef={skateboardRef} />
          </Suspense>
        </Debug>
      </Physics>

      {/* Environment and controls */}
      <Sky sunPosition={[500, 150, -1000]} turbidity={20} />
      <DreiEnvironment preset="city" />
      {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
      <CameraController targetRef={skateboardRef} />
    </Canvas>
    // </CameraProvider>
  );
};

export default WebGL;
