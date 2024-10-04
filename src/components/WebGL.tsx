import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraProvider } from "../providers/CameraProvider";
import { Desk } from '../models/DeskModel';
import CameraController from './CameraController';

function Model() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </group>
  );
}

const WebGL = () => {
  return (
    <CameraProvider>
      <Canvas shadows camera={{ fov: 50, position: [0, 3, 5] }}>
        <CameraController />
        <Suspense fallback={null}>
          <Model />
          <Desk />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} castShadow intensity={1} />
      </Canvas>
    </CameraProvider>
  );
};

export default WebGL;
