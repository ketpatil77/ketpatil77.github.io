import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  duration?: number; // seconds per full loop
  strokeWidth?: number;
  color?: string;
  gradientLength?: number; // 0-1, fraction of perimeter lit up
}

export function MovingBorder({
  children,
  className,
  borderRadius = 16,
  duration = 6,
  strokeWidth = 1.5,
  color = 'var(--cyan-full)',
  gradientLength = 0.25,
}: MovingBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect || shouldReduceMotion) return;

    let rafId: number;
    let startTime: number | null = null;

    const perimeter = rect.getTotalLength?.() ?? 0;
    if (perimeter === 0) return;

    const dashLen = perimeter * gradientLength;
    rect.style.strokeDasharray = `${dashLen} ${perimeter - dashLen}`;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      const offset = -((elapsed / duration) % 1) * perimeter;
      rect.style.strokeDashoffset = `${offset}`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [duration, gradientLength, shouldReduceMotion]);

  return (
    <div className={cn('moving-border-root relative', className)}>
      {/* SVG border layer */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 overflow-visible"
        width="100%"
        height="100%"
        fill="none"
        aria-hidden="true"
      >
        <rect
          ref={rectRef}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={`calc(100% - ${strokeWidth}px)`}
          height={`calc(100% - ${strokeWidth}px)`}
          rx={borderRadius}
          ry={borderRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      {children}
    </div>
  );
}
