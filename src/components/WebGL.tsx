import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { CameraProvider } from "../providers/CameraProvider";
import { Desk } from '../models/DeskModel';
import { Environment } from '../models/Envrionment';
import { WaterMat } from './WaterMaterial';
import CameraController from './CameraController';
import { Bridge } from '../models/Bridge';
import { Skateboard } from '../models/Skateboard';
import { SceneWithLamposts } from '../models/Lampost';
import SkateboardController from '../components/SkateboardController';
import * as THREE from "three";
import * as CANNON from "cannon-es";

const WebGL = () => {

  useEffect(() => {
    const scene = new THREE.Scene();
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });

    console.log("Scene initialized:", scene);
    console.log("World initialized:", world);

    // Lighting
    const dirLight = new THREE.DirectionalLight(0xF0997D, 0.8);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMesh = new THREE.Mesh(
      floorGeo,
      new THREE.MeshToonMaterial({ color: 0x454545 })
    );
    floorMesh.rotation.x = -Math.PI * 0.5;
    scene.add(floorMesh);

    const floorS = new CANNON.Plane();
    const floorB = new CANNON.Body({ mass: 0 });
    floorB.addShape(floorS);
    world.addBody(floorB);
    floorB.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

    console.log("Initializing skateboard controller");
    const skateboardController = new SkateboardController(scene, world);

    const handleResize = () => {
      // Camera handled by @react-three/fiber, no need to manage manually here
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <CameraProvider>
      <Canvas
        shadows
        camera={{ fov: 50, position: [0, 5, 5] }}
        gl={{ alpha: false }}
      >
        {/* <color attach="background" args={["skyblue"]} /> */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[-50, 50, -50]}
          intensity={0.4}
          castShadow
        />

        <CameraController />
        <Suspense fallback={null}>
          {/* Uncomment the components you want to test with */}
          {/* <Environment />
          <WaterMat /> */}
          <Sky sunPosition={[500, 150, -1000]} turbidity={20} />
          {/* <Bridge/>
          <Skateboard/>
          <SceneWithLamposts/> */}
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </CameraProvider>
  );
};

export default WebGL;