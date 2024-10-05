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
  const { nodes, materials } = useGLTF('./Lampost.glb') as GLTFResult;

  console.log('Lampost model loaded. Nodes:', nodes);
  console.log('Lampost model loaded. Materials:', materials);

  return (
    <group {...props} dispose={null}>
      {Object.entries(nodes).map(([name, mesh]) => {
        const materialName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : (mesh.material as THREE.Material)?.name;

        const material = materials[materialName ?? 'Steel'] || materials[''];
        console.log(`Rendering mesh: ${name}`);
        
        return (
          <mesh
            key={name}
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={material}
            position={[0, 1.73, 0]}
            rotation={[degreesToRadians(90), degreesToRadians(180), degreesToRadians(-45)]}
            scale={mesh.scale.clone().multiplyScalar(0.2)}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload('./Lampost.glb');

const NUM_LAMPOSTS = 10;
const PLANE_WIDTH = 25;
const PLANE_DEPTH = 25;

export function SceneWithLamposts() {
  const lamppostPositions = Array.from({ length: NUM_LAMPOSTS }, () => ({
    x: THREE.MathUtils.randFloatSpread(PLANE_WIDTH),
    z: THREE.MathUtils.randFloatSpread(PLANE_DEPTH),
  }));

  console.log('Generated lamppost positions:', lamppostPositions);

  return (
    <group>
      {lamppostPositions.map((pos, index) => {
        console.log(`Placing lamppost #${index + 1} at position:`, pos);
        return (
          <Lampost
            key={index}
            position={[pos.x, 0, pos.z]}
            rotation={[0, 0, 0]}
          />
        );
      })}
    </group>
  );
}