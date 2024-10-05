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

export function Skateboard(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./longboard.glb') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      {Object.entries(nodes).map(([name, mesh]) => {
        const materialName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : (mesh.material as THREE.Material)?.name;

        const material = materials[materialName ?? 'Default'] || materials[''];

        return (
          <mesh
            key={name}
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={material}
            position={[1, 0.085, 0]} 
            rotation={[degreesToRadians(-90), degreesToRadians(0), degreesToRadians(0)]}
            scale={mesh.scale.clone().multiplyScalar(0.2)} 
          />
        );
      })}
    </group>
  );
}

useGLTF.preload('./longboard.glb');