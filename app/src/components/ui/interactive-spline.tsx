import { useState, type CSSProperties } from 'react';
import { SplineScene } from './spline-scene';

interface InteractiveSplineProps {
  scene: string;
  onHover?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
  fallback?: React.ReactNode;
  scale?: number;
  hoverScale?: number;
}

export function InteractiveSpline({
  scene,
  onHover,
  onHoverEnd,
  onClick,
  className,
  containerClassName,
  style,
  fallback,
  scale = 1,
  hoverScale = 1.05,
}: InteractiveSplineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentScale = isHovered ? hoverScale : scale;

  return (
    <div
      className={`relative transition-transform duration-300 ${containerClassName ?? ''}`}
      style={{
        transform: `scale(${currentScale})`,
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverEnd?.();
      }}
      onClick={onClick}
    >
      <SplineScene
        scene={scene}
        className={className}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && fallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </div>
      )}
    </div>
  );
}