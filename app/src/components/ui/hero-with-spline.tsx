import { motion, useReducedMotion } from 'framer-motion';
import { SplineWithFallback } from '@/components/ui/spline-with-fallback';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroWithSplineProps {
  sceneUrl: string;
  children: React.ReactNode;
}

export function HeroWithSpline({ sceneUrl, children }: HeroWithSplineProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerformanceMode = shouldReduceMotion || isMobile;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: lowPerformanceMode ? 0 : 0.6 }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {!lowPerformanceMode && sceneUrl && (
        <SplineWithFallback
          scene={sceneUrl}
          className="absolute inset-0 z-0"
          containerClassName="absolute inset-0 z-0"
          fallback={<div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-base)] via-[var(--bg-surface)] to-[var(--bg-base)]" />}
        />
      )}
      
      <div className="relative z-10 text-center">
        {children}
      </div>
    </motion.section>
  );
}