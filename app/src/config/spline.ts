export interface SplineSceneConfig {
  heroText?: string;
  techStack3DIcons?: string;
  portfolioDevice?: string;
  aboutAmbient?: string;
  services3D?: string;
  handsUI?: string;
}

const splineRuntimeDefaults = {
  // Official exported/runtime scenes used as safe defaults until custom scenes are exported from Spline.
  heroText: 'https://prod.spline.design/9951u9cumiw2Ehj8/scene.splinecode',
  techStack3DIcons: 'https://prod.spline.design/UWoeqiir20o49Dah/scene.splinecode',
  portfolioDevice: 'https://prod.spline.design/U9O6K7fXziMEU7Wu/scene.splinecode',
  aboutAmbient: 'https://prod.spline.design/LEvjG3OETYd2GsRw/scene.splinecode',
  services3D: 'https://prod.spline.design/FVZWbQH2B6ndj9UU/scene.splinecode',
  handsUI: 'https://prod.spline.design/PBQQBw8bfXDhBo7w/scene.splinecode',
} satisfies Required<SplineSceneConfig>;

export const splineSceneConfig: SplineSceneConfig = {
  heroText: import.meta.env.VITE_SPLINE_HERO_SCENE || splineRuntimeDefaults.heroText,
  techStack3DIcons: import.meta.env.VITE_SPLINE_TECH_SCENE || splineRuntimeDefaults.techStack3DIcons,
  portfolioDevice: import.meta.env.VITE_SPLINE_PORTFOLIO_SCENE || splineRuntimeDefaults.portfolioDevice,
  aboutAmbient: import.meta.env.VITE_SPLINE_ABOUT_SCENE || splineRuntimeDefaults.aboutAmbient,
  services3D: import.meta.env.VITE_SPLINE_SERVICES_SCENE || splineRuntimeDefaults.services3D,
  handsUI: import.meta.env.VITE_SPLINE_HANDS_SCENE || splineRuntimeDefaults.handsUI,
};

export function getSplineSceneUrl(key: keyof SplineSceneConfig): string {
  return splineSceneConfig[key] || '';
}

export function hasSplineScene(key: keyof SplineSceneConfig): boolean {
  return Boolean(splineSceneConfig[key]);
}

export function isSplineConfigured(): boolean {
  return Object.values(splineSceneConfig).some(Boolean);
}

export function getHeroSceneUrl(): string {
  return splineSceneConfig.heroText || splineRuntimeDefaults.heroText;
}

export function getTechStackSceneUrl(): string {
  return splineSceneConfig.techStack3DIcons || splineRuntimeDefaults.techStack3DIcons;
}

export function getPortfolioSceneUrl(): string {
  return splineSceneConfig.portfolioDevice || splineRuntimeDefaults.portfolioDevice;
}

export function getAboutSceneUrl(): string {
  return splineSceneConfig.aboutAmbient || splineRuntimeDefaults.aboutAmbient;
}

export function getServicesSceneUrl(): string {
  return splineSceneConfig.services3D || splineRuntimeDefaults.services3D;
}
