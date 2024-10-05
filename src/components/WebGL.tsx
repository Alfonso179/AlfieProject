import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { CameraProvider } from "../providers/CameraProvider";
import { Desk } from '../models/DeskModel';
import { Environment } from '../models/Envrionment';
import { WaterMat } from './WaterMaterial';
import CameraController from './CameraController';
import { Bridge } from '../models/Bridge';

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
            <WaterMat />
            <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
            <Desk />
            <Bridge/>
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </CameraProvider>
    );
  };
  

export default WebGL;
