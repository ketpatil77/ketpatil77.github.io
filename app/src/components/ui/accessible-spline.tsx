import { type CSSProperties, type ReactNode } from 'react';
import { SplineWithFallback } from './spline-with-fallback';

interface AccessibleSplineProps {
  scene: string;
  alt: string;
  description?: string;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}

export function AccessibleSpline({
  scene,
  alt,
  description,
  className,
  containerClassName,
  style,
  fallback,
}: AccessibleSplineProps) {
  return (
    <div role="img" aria-label={alt}>
      <div className="sr-only">
        <span>{alt}</span>
        {description && <p>{description}</p>}
      </div>
      <SplineWithFallback
        scene={scene}
        fallback={fallback}
        className={className}
        containerClassName={containerClassName}
        style={style}
      />
    </div>
  );
}