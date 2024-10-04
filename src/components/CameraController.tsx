import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useCamera } from '../providers/CameraProvider';

const CameraController = () => {
  const { state } = useCamera();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.copy(state.position);
  }, [camera, state.position]);

  return null;
};

export default CameraController;
