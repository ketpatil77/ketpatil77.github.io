import { checkWebGLSupport } from './webgl';

export type PerformanceLevel = 'low' | 'medium' | 'high';

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  hasWebGL: boolean;
  hasWebGL2: boolean;
  performance: PerformanceLevel;
  prefersReducedMotion: boolean;
  isLowBattery: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
}

export function getDeviceCapabilities(): DeviceCapabilities {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const hasWebGL = checkWebGLSupport();
  
  const nav = navigator as Navigator & { deviceMemory?: number; getBattery?: () => Promise<{ charging: boolean; level: number }> };
  const deviceMemory = nav.deviceMemory ?? (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  
  let performance: PerformanceLevel = 'medium';
  if (hardwareConcurrency > 8 && deviceMemory >= 8) {
    performance = 'high';
  } else if (hardwareConcurrency <= 2 || deviceMemory <= 2) {
    performance = 'low';
  }
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  let isLowBattery = false;
  if (nav.getBattery) {
    nav.getBattery().then((battery) => {
      isLowBattery = !battery.charging && battery.level < 0.2;
    }).catch(() => {});
  }
  
  return {
    isMobile,
    isTablet,
    hasWebGL,
    hasWebGL2: Boolean(window.WebGL2RenderingContext),
    performance,
    prefersReducedMotion,
    isLowBattery,
    deviceMemory,
    hardwareConcurrency,
  };
}

export function shouldLoad3DContent(capabilities: DeviceCapabilities): boolean {
  if (!capabilities.hasWebGL) return false;
  if (capabilities.prefersReducedMotion) return false;
  if (capabilities.performance === 'low') return false;
  if (capabilities.isLowBattery) return false;
  return true;
}

export function getOptimalSceneQuality(capabilities: DeviceCapabilities): 'high' | 'medium' | 'low' {
  if (capabilities.performance === 'high' && !capabilities.isMobile) {
    return 'high';
  }
  if (capabilities.performance === 'low' || capabilities.isMobile) {
    return 'low';
  }
  return 'medium';
}