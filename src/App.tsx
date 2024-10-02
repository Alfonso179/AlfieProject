import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PointerLockControls } from "@react-three/drei";

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

      {/* Free Look Camera (PointerLockControls) */}
      <PointerLockControls />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow intensity={1} />
      {/* <CameraShake
        maxYaw={0.1}
        maxPitch={0.1}
        maxRoll={0.1}
        yawFrequency={0.1}
        pitchFrequency={0.1}
        rollFrequency={0.1}
        intensity={1}
        decayRate={0.65}
      /> */}
    </Canvas>
  );
}
