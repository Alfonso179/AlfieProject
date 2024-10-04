import { Reflector, useTexture } from "@react-three/drei";
import { Vector2 } from "three";

export function Environment() {
  const [floor, normal] = useTexture([
    "./SurfaceImperfections003_1K_var1.jpg",
    "./SurfaceImperfections003_1K_Normal.jpg",
  ]);

  return (
    <group>

      <ambientLight intensity={0.4} />
      <directionalLight position={[-50, 50, -50]} intensity={0.4} castShadow />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
      />
      {/* <Reflector
        blur={[400, 100]}
        resolution={1024}
        args={[50, 50]}
        mirror={0.5}
        mixBlur={6}
        mixStrength={1.5}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {(Material, props) => (
          <Material
            color="#a0a0a0"
            metalness={0.4}
            roughnessMap={floor}
            normalMap={normal}
            normalScale={new Vector2(2, 2)}
            {...props}
          />
        )}
      </Reflector> */}
    </group>
  );
}
