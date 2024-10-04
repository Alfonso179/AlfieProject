// CameraProvider.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Vector3 } from 'three';

interface CameraState {
  position: Vector3;
}

type CameraAction = 
  | { type: 'SET_POSITION'; position: Vector3 }
  | { type: 'RESET_POSITION' };

const initialState: CameraState = {
  position: new Vector3(0, 0, 5),
};

const cameraReducer = (state: CameraState, action: CameraAction): CameraState => {
  switch (action.type) {
    case 'SET_POSITION':
      return { ...state, position: action.position };
    case 'RESET_POSITION':
      return initialState;
    default:
      return state;
  }
};

const CameraContext = createContext<{ state: CameraState; dispatch: React.Dispatch<CameraAction> } | undefined>(undefined);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cameraReducer, initialState);

  return (
    <CameraContext.Provider value={{ state, dispatch }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error('useCamera must be used within a CameraProvider');
  return context;
};
