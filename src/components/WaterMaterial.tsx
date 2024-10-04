import * as THREE from 'three';
import React, { useRef, useMemo, useEffect } from 'react';
import { extend, useThree, useLoader, useFrame } from '@react-three/fiber';
import { Water } from 'three/examples/jsm/objects/Water2';
import { TextureLoader } from 'three';

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: any;
    }
  }
}

export const WaterMat: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  
  const waterNormals = useLoader(TextureLoader, './waternormals.jpeg');
  
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.outputColorSpace === THREE.SRGBColorSpace ? THREE.RGBAFormat : THREE.RGBFormat,
    }),
    [waterNormals, gl.outputColorSpace]
  );

  useEffect(() => {
    if (ref.current) {
      console.log('Water material:', ref.current.material);
      console.log('Uniforms:', (ref.current.material as any).uniforms);
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current && (ref.current.material as any).uniforms && (ref.current.material as any).uniforms['time']) {
      (ref.current.material as any).uniforms['time'].value += delta;
    }
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
};