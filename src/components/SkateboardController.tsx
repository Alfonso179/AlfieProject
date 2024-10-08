import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

interface SkateboardControllerProps {
  material: CANNON.Material;
  position?: [number, number, number];
}

const SkateboardController = forwardRef<THREE.Group, SkateboardControllerProps>(
  ({ material, position = [0, 2, 0] }, forwardedRef) => {
    const { nodes, materials } = useGLTF('./longboard.glb') as any;

    // Let useBox manage its own ref
    const [ref, api] = useBox(() => ({
      mass: 1,
      position,
      args: [1, 0.2, 2],
      material: material,
    }));

    // Expose the ref via useImperativeHandle if needed
    useImperativeHandle(forwardedRef, () => ref.current);

    const [keyMap, setKeyMap] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
      if (ref.current) {
        console.log('SkateboardController ref.current:', ref.current);
      }
    }, [ref]);
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
        api.applyLocalForce([0, 0, 25], [0, 0, 0]); // This should now work
      }
      if (keyMap['KeyS'] || keyMap['ArrowDown']) {
        api.applyLocalForce([0, 0, -25], [0, 0, 0]);
      }
      if (keyMap['KeyA'] || keyMap['ArrowLeft']) {
        api.applyTorque([0, 8, 0]);
      }
      if (keyMap['KeyD'] || keyMap['ArrowRight']) {
        api.applyTorque([0, -8, 0]);
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
  }
);

export default SkateboardController;
