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

export function Bridge(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./suspension_bridge.glb') as GLTFResult;

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
            position={[-25, 0, -25]} 
            rotation={[degreesToRadians(90), degreesToRadians(180), degreesToRadians(-45)]}
            scale={mesh.scale.clone().multiplyScalar(5)} // Uniformly scale by a factor of 2
          />
        );
      })}
    </group>
  );
}

useGLTF.preload('./suspension_bridge.glb');