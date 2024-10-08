import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as CANNON from 'cannon-es';

interface SkateboardControllerProps {
  material: CANNON.Material;
  position?: [number, number, number];
}

const SkateboardController: React.FC<SkateboardControllerProps> = ({
  material,
  position = [0, 2, 0],
}) => {
  const { nodes, materials } = useGLTF('./longboard.glb') as any;
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 0.2, 2],
    material: material,
  }));

  const [keyMap, setKeyMap] = useState<{ [key: string]: boolean }>({});

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyMap((prev) => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyMap((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Apply controls in the physics update loop
  useFrame(() => {
    if (keyMap['KeyW'] || keyMap['ArrowUp']) {
      api.applyLocalForce([0, 0, -25], [0, 0, 0]);
    }
    if (keyMap['KeyS'] || keyMap['ArrowDown']) {
      api.applyLocalForce([0, 0, 25], [0, 0, 0]);
    }
    if (keyMap['KeyA'] || keyMap['ArrowLeft']) {
      api.applyTorque([0, 10, 0]);
    }
    if (keyMap['KeyD'] || keyMap['ArrowRight']) {
      api.applyTorque([0, -10, 0]);
    }
  });

  return (
    <group ref={ref}>
      <group
        position={[0, -0.1, 0]} // Adjust to align model with physics body
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 0.2]}
      >
        {Object.entries(nodes).map(([name, mesh]) => {
          const materialName = Array.isArray(mesh.material)
            ? mesh.material[0]?.name
            : mesh.material?.name;
          const material =
            materials[materialName ?? 'Default'] || materials[''];

          return (
            <mesh
              key={name}
              castShadow
              receiveShadow
              geometry={mesh.geometry}
              material={material}
              position={[0, 0, -0.5]}
              rotation={[0, Math.PI, 0]}
            />
          );
        })}
      </group>
    </group>
  );
};

export default SkateboardController;
