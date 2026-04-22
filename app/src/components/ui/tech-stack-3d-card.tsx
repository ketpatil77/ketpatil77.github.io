import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '@/lib/motion';
import { SplineWithFallback } from '@/components/ui/spline';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechStack3DCardProps {
  name: string;
  description: string;
  sceneUrl?: string;
  fallbackIcon: React.ReactNode;
  index: number;
  shouldReduceMotion: boolean | null;
  iconColor: string;
}

export function TechStack3DCard({
  name,
  description,
  sceneUrl,
  fallbackIcon,
  index,
  shouldReduceMotion,
  iconColor,
}: TechStack3DCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const disabled = Boolean(shouldReduceMotion) || isMobile;

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20, scale: 0.95 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { ...motionTokens.spring.soft, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex h-full min-h-[80px] flex-col justify-center gap-2 rounded-2xl glass-card p-3.5 transition-all duration-300 hover:border-[var(--border-bright)] cursor-default"
      style={{
        transform: !disabled && isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: !disabled && isHovered ? '0 8px 32px rgba(0, 212, 255, 0.15)' : undefined,
      }}
    >
      <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, var(--cyan-trace), transparent 90%)' }} />
      
      <div className="relative z-10 flex items-center justify-between gap-2">
        {sceneUrl && !disabled ? (
          <div className="h-10 w-10 overflow-hidden rounded-lg" style={{ transform: isHovered ? 'rotateY(180deg)' : 'none', transition: 'transform 400ms ease-out' }}>
            <SplineWithFallback
              scene={sceneUrl}
              fallback={<div className="flex h-full w-full items-center justify-center text-xl">{fallbackIcon}</div>}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${iconColor}20`, color: iconColor }}
          >
            {fallbackIcon}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="type-heading text-sm font-bold tracking-tight text-[var(--text-100)]">
          {name}
        </h3>
        <p className="type-body text-xs leading-relaxed text-[var(--text-300)] line-clamp-2 transition-all group-hover:line-clamp-none">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-auto border-t border-[var(--border-subtle)] pt-2">
        <motion.div
          className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-surface)]"
          initial={shouldReduceMotion ? {} : { width: '0%' }}
          whileInView={shouldReduceMotion ? {} : { width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${iconColor}, ${iconColor}80)` }}
            initial={shouldReduceMotion ? {} : { width: '0%' }}
            whileInView={shouldReduceMotion ? {} : { width: `${60 + (index * 8) % 35}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}