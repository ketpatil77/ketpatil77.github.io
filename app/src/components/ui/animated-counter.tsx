import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  durationMs = 1400,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    if (shouldReduceMotion) {
      setDisplayed(value);
      return;
    }
    startedRef.current = true;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(parseFloat((eased * value).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplayed(value);
    };

    requestAnimationFrame(tick);
  }, [isInView, value, durationMs, shouldReduceMotion, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </span>
  );
}
