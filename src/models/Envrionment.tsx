// src/models/environment.tsx
import { Reflector, useTexture } from '@react-three/drei';
import { Vector2 } from 'three';

export function Environment() {
  // Load textures for the normal and roughness maps
  const [floor, normal] = useTexture([
    './SurfaceImperfections003_1K_var1.jpg', // Roughness map
    './SurfaceImperfections003_1K_Normal.jpg', // Normal map
  ]);

  return (
    <group>
      {/* Lighting setup */}
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={0.1} castShadow />

      {/* Reflective ground plane */}
      <Reflector
        blur={[400, 100]} // Blur the reflection
        resolution={1024} // Reflection resolution
        args={[50, 50]} // Plane size
        mirror={0.5} // Reflection intensity
        mixBlur={6} // Blurriness of the reflection
        mixStrength={1.5} // Reflection strength
        rotation={[-Math.PI / 2, 0, 0]} // Rotate to flat plane
      >
        {(Material, props) => (
          <Material
            color="#a0a0a0" // Base color
            metalness={0.4} // Metalness
            roughnessMap={floor} // Apply roughness map
            normalMap={normal} // Apply normal map
            normalScale={new Vector2(2, 2)} // Use Vector2 for normalScale
            {...props}
          />
        )}
      </Reflector>
    </group>
  );
}
