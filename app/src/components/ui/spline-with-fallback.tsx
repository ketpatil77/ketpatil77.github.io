import { type ReactNode, type CSSProperties } from 'react';
import { SplineScene } from './spline-scene';
import { checkWebGLSupport } from '@/utils/3d';

interface SplineWithFallbackProps {
  scene: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  className?: string;
  style?: CSSProperties;
  containerClassName?: string;
}

function FallbackContainer({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

function SplineWithFallback({
  scene,
  fallback,
  errorFallback,
  className,
  style,
  containerClassName,
}: SplineWithFallbackProps) {
  const hasWebGL = checkWebGLSupport();

  if (!hasWebGL) {
    return (
      <FallbackContainer className={containerClassName} style={style}>
        {fallback ?? null}
      </FallbackContainer>
    );
  }

  if (!scene) {
    return (
      <FallbackContainer className={containerClassName} style={style}>
        {fallback ?? null}
      </FallbackContainer>
    );
  }

  return (
    <FallbackContainer className={containerClassName} style={style}>
      <SplineScene
        scene={scene}
        className={className}
        style={style}
        errorFallback={errorFallback ?? fallback}
      />
    </FallbackContainer>
  );
}

export { SplineWithFallback };
