import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF, MeshReflectorMaterial } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Mesh } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Desk: THREE.Mesh;
  };
  materials: {
    Desk_Texture: THREE.MeshStandardMaterial;
  };
};

export function Desk(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./Desk.glb') as GLTFResult;
  
  const overlayRef = useRef<Mesh>(null);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Desk.geometry}
        material={materials.Desk_Texture}
        position={[2.0222, 0.6, -1.4116]}
        scale={[1.2, 1, 0.9103]}
      />

      <mesh ref={overlayRef} position={[1.1, 0.8, -1.07]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 1]} /> {/* Adjust width and height as necessary */}
        <MeshReflectorMaterial
          blur={[1000, 1000]}
          resolution={1024}
          mirror={0.5}
          mixBlur={0.4}
          mixStrength={100}
          roughness={0.1}
          depthScale={0}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.05}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('./Desk.glb');
