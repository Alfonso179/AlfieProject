import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

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

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Desk.geometry}
        material={materials.Desk_Texture}
        position={[0, 0.7, 0]}
        scale={[1, 1, 1]}
      />
    </group>
  );
}

useGLTF.preload('./Desk.glb');
