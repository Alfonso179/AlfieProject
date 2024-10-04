import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Model() {
  return (
    <group>
      {/* Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      {/* Cube */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </group>
  );
}

export default function Viewer() {
  return (
    <Canvas shadows camera={{ fov: 50, position: [0, 3, 5] }}>
      <Suspense fallback={null}>
        <Model />
      </Suspense>

      {/* Use Orbit Controls instead of PointerLockControls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow intensity={1} />
    </Canvas>
  );
}
