import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, CameraShake, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

useGLTF.preload('/robot-draco.glb');

function Model(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/robot-draco.glb') as GLTF & { animations: any };
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.play();
    }
  }, [actions]);

  return <primitive object={scene} {...props} />;
}

export default function Viewer() {
  return (
    <Canvas shadows camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls makeDefault />
      <CameraShake
        maxYaw={0.1}
        maxPitch={0.1}
        maxRoll={0.1}
        yawFrequency={0.1}
        pitchFrequency={0.1}
        rollFrequency={0.1}
        intensity={1}
        decayRate={0.65}
      />
    </Canvas>
  );
}
