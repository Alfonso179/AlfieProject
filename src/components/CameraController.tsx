import { useFrame, useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  targetRef: React.RefObject<THREE.Object3D>;
}

const CameraController: React.FC<CameraControllerProps> = ({ targetRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (targetRef.current) {
      const targetPosition = new THREE.Vector3();
      targetRef.current.getWorldPosition(targetPosition);

      // Define the desired offset between camera and target
      const cameraOffset = new THREE.Vector3(0, 5, -10);

      // Rotate the offset based on the target's orientation
      const targetQuaternion = new THREE.Quaternion();
      targetRef.current.getWorldQuaternion(targetQuaternion);
      cameraOffset.applyQuaternion(targetQuaternion);

      // Compute the new camera position
      const newCameraPosition = targetPosition.clone().add(cameraOffset);

      // Smoothly interpolate the camera's position
      camera.position.lerp(newCameraPosition, 0.1);

      // Make the camera look at the target
      camera.lookAt(targetPosition);
    }
  });

  return null;
};

export default CameraController;
