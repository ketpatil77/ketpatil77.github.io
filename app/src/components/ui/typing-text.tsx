import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per character
  showCaret?: boolean;
  caretClassName?: string;
  onComplete?: () => void;
}

export function TypingText({
  text,
  className,
  speed = 38,
  showCaret = true,
  caretClassName,
  onComplete,
}: TypingTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    if (shouldReduceMotion) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }
    startedRef.current = true;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [isInView, text, speed, shouldReduceMotion, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {showCaret && !done && (
        <span
          className={cn('typing-caret', caretClassName)}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
