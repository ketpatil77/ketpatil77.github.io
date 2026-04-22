import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  el?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  staggerOffset?: number; // fraction 0-1 per word
}

export function ScrollRevealText({
  text,
  className,
  el: El = 'p',
  staggerOffset = 0.028,
}: ScrollRevealTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ['start 0.9', 'start 0.35'],
  });

  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <El className={className}>{text}</El>;
  }

  return (
    // @ts-expect-error dynamic element
    <El ref={containerRef} className={cn('flex flex-wrap gap-x-[0.3em]', className)}>
      {words.map((word, i) => {
        const start = i * staggerOffset;
        const end = Math.min(start + staggerOffset * 4, 1);
        /* eslint-disable react-hooks/rules-of-hooks */
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        return (
          <motion.span key={`${word}-${i}`} style={{ opacity }} className="inline-block">
            {word}
          </motion.span>
        );
      })}
    </El>
  );
}
