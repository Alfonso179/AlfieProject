import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraProvider } from "../providers/CameraProvider";
import { Desk } from '../models/DeskModel';
import { Environment } from '../models/Envrionment';
import CameraController from './CameraController';

const WebGL = () => {
    return (
      <CameraProvider>
        <Canvas 
          shadows 
          camera={{ fov: 50, position: [0, 5, 5] }} 
          gl={{ alpha: false }} 
        >
          <color attach="background" args={["skyblue"]} />
          
          <CameraController />
          <Suspense fallback={null}>
            <Environment />
            <Desk />
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </CameraProvider>
    );
  };
  

export default WebGL;
