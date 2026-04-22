import { useState, type ReactNode } from 'react';
import { SplineScene } from './spline-scene';

interface SplineBackgroundProps {
  sceneUrl: string;
  children: ReactNode;
  opacity?: number;
  zIndex?: number;
  blur?: number;
  className?: string;
}

export function SplineBackground({
  sceneUrl,
  children,
  opacity = 0.6,
  zIndex = 0,
  blur = 0,
  className = '',
}: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`} style={{ zIndex }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: isLoaded ? opacity : 0,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          transition: 'opacity 800ms ease-out',
        }}
      >
        <SplineScene
          scene={sceneUrl}
          className="h-full w-full"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      
      {children}
    </div>
  );
}