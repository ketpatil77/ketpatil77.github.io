import { createContext, useMemo } from 'react';
import { getDeviceCapabilities, type DeviceCapabilities, shouldLoad3DContent, getOptimalSceneQuality } from '@/utils/3d';

interface DeviceCapabilitiesContextValue extends DeviceCapabilities {
  shouldLoad3D: boolean;
  sceneQuality: 'high' | 'medium' | 'low';
  isLoaded: boolean;
}

const DeviceCapabilitiesContext = createContext<DeviceCapabilitiesContextValue | null>(null);

export function DeviceCapabilitiesProvider({ children }: { children: React.ReactNode }) {
  const capabilities = useMemo(() => {
    const caps = getDeviceCapabilities();
    return {
      ...caps,
      shouldLoad3D: shouldLoad3DContent(caps),
      sceneQuality: getOptimalSceneQuality(caps),
      isLoaded: true,
    } as DeviceCapabilitiesContextValue;
  }, []);

  if (!capabilities) {
    return null;
  }

  return (
    <DeviceCapabilitiesContext.Provider value={capabilities}>
      {children}
    </DeviceCapabilitiesContext.Provider>
  );
}
