import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DragScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Show scroll-shadow fade on edges */
  showFade?: boolean;
  /** Snap scrolling */
  snap?: boolean;
  dragElastic?: number;
}

export function DragScroll({
  children,
  className,
  showFade = true,
  snap = false,
  dragElastic = 0.05,
}: DragScrollProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  return (
    <div
      ref={constraintsRef}
      className={cn(
        'drag-scroll-root relative overflow-hidden',
        showFade && 'drag-scroll-fade',
        className
      )}
    >
      <motion.div
        ref={trackRef}
        className={cn(
          'drag-scroll-track flex cursor-grab active:cursor-grabbing select-none',
          snap && 'snap-x snap-mandatory'
        )}
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={dragElastic}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 240, bounceDamping: 28 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 50); }}
        // Prevent accidental click-through while dragging
        onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
