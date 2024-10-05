import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { extend, useThree, useLoader, useFrame } from '@react-three/fiber';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { TextureLoader } from 'three';

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: React.ReactElement<typeof Water>;
    }
  }
}

// Custom type for Water material
interface WaterMaterial extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    [key: string]: any;
  };
}

export const WaterMat: React.FC = () => {
  const ref = useRef<Water>(null);
  const { gl, scene } = useThree();
  
  const waterNormals = useLoader(TextureLoader, './waternormals.jpeg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0.70707, 0.70707, 0),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    }),
    [waterNormals, scene.fog]
  );

  useFrame((state, delta) => {
    if (ref.current) {
      const waterMaterial = ref.current.material as WaterMaterial;
      waterMaterial.uniforms.time.value += delta;
    }
  });

  return (
    <water 
      ref={ref} 
      args={[geom, config]} 
      rotation-x={-Math.PI / 2} 
      position={[0, -10, 0]}
    />
  );
};