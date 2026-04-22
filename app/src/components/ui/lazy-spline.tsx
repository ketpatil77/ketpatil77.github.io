import { useState, useEffect, type ReactNode } from 'react';
import { SplineScene, SplineSceneFallback } from './spline-scene';
import { checkWebGLSupport } from '@/utils/3d';
import { useSplineLazyLoad } from '@/hooks/useSplineLazyLoad';

interface LazySplineProps {
  scene: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  className?: string;
  containerClassName?: string;
  threshold?: number;
  rootMargin?: string;
  style?: React.CSSProperties;
}

export function LazySpline({
  scene,
  fallback,
  errorFallback,
  className,
  containerClassName,
  threshold = 0.1,
  rootMargin = '50px',
  style,
}: LazySplineProps) {
  const [hasWebGL, setHasWebGL] = useState(false);
  const { ref, shouldLoad } = useSplineLazyLoad({ threshold, rootMargin });

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  if (!hasWebGL || !scene) {
    return <>{fallback ?? null}</>;
  }

  if (!shouldLoad) {
    return (
      <div ref={ref} className={containerClassName} style={style}>
        {fallback ?? <SplineSceneFallback className={className} />}
      </div>
    );
  }

  return (
    <div ref={ref} className={containerClassName} style={style}>
      <SplineScene
        scene={scene}
        className={className}
        style={style}
        errorFallback={errorFallback ?? fallback}
      />
    </div>
  );
}
