import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { degreesToRadians } from '../components/Utils';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.MeshStandardMaterial;
  };
};

export function Lampost(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./lampost.gltf') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      {Object.entries(nodes).map(([name, mesh]) => {
        const materialName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : (mesh.material as THREE.Material)?.name;

        const material = materials[materialName ?? 'Steel'] || materials[''];

        return (
          <mesh
            key={name}
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={material}
            position={[-25, 0.7, -25]}  
            rotation={[0, 0, 0]}
            scale={mesh.scale}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload('./lampost.gltf');