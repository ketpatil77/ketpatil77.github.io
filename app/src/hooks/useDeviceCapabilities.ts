import { useContext } from 'react';
import { DeviceCapabilitiesContext } from '@/context/DeviceCapabilitiesContext';

export function useDeviceCapabilities() {
  const context = useContext(DeviceCapabilitiesContext);
  if (!context) {
    throw new Error('useDeviceCapabilities must be used within a DeviceCapabilitiesProvider');
  }
  return context;
}
