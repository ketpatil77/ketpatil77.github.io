import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'ltr' | 'rtl';
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

export function Marquee({
  children,
  direction = 'ltr',
  speed = 40,
  pauseOnHover = true,
  className,
  gap = 16,
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Estimate duration from content width
  useEffect(() => {
    if (!trackRef.current || shouldReduceMotion) return;
    const inner = trackRef.current.querySelector('.marquee-inner') as HTMLElement;
    if (!inner) return;
    const contentWidth = inner.scrollWidth / 2;
    const dur = contentWidth / speed;
    inner.style.setProperty('--marquee-duration', `${dur}s`);
  }, [speed, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div className={cn('flex flex-wrap gap-3 overflow-hidden', className)}>
        {children}
      </div>
    );
  }

  const animClass = direction === 'rtl' ? 'marquee-animate-rtl' : 'marquee-animate-ltr';

  return (
    <div
      className={cn('marquee-root overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div
        ref={trackRef}
        className={cn('marquee-inner flex w-max', pauseOnHover && 'marquee-pause-hover', animClass)}
        style={{ gap: `${gap}px` }}
      >
        {/* Doubled for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" style={{ gap: `${gap}px` }}>{children}</div>
      </div>
    </div>
  );
}
