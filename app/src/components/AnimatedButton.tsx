import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  download?: string | boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  magnetic?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  href,
  download,
  variant = 'primary',
  size = 'md',
  showIcon = false,
  className,
  style,
  type = 'button',
  magnetic = true,
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const premiumEaseStyle: CSSProperties = { transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' };

  // Magnetic spring values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const magneticX = useSpring(x, springConfig);
  const magneticY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.25);
    y.set((clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!magnetic) return;
    x.set(0);
    y.set(0);
  };

  const baseStyles = cn(
    'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl focus-ring',
    'transition-colors duration-300 ease-out font-semibold will-change-transform',
    {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-outline': variant === 'outline',
      'btn-ghost border border-white/40 hover:bg-white/15 hover:border-white/60 text-white': variant === 'outline-white',
      'px-4 py-2 text-[0.8rem]': size === 'sm',
      'px-6 py-2.5 text-sm': size === 'md',
      'px-8 py-3.5 text-base': size === 'lg',
    },
    className
  );

  const content = (
    <>
      <span className="relative overflow-hidden flex items-center" style={{ height: '1.2em' }}>
        <span
          className={cn(
            'block transition-transform duration-300',
            isHovered ? '-translate-y-[120%]' : 'translate-y-0'
          )}
          style={premiumEaseStyle}
        >
          {children}
        </span>
        <span
          className={cn(
            'absolute inset-0 flex items-center transition-transform duration-300',
            isHovered ? 'translate-y-0' : 'translate-y-[120%]'
          )}
          style={premiumEaseStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
      {showIcon && (
        <ArrowRight
          className={cn(
            'w-4 h-4 transition-transform duration-300 shrink-0',
            isHovered ? 'translate-x-1' : 'translate-x-0'
          )}
          style={premiumEaseStyle}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        download={download}
        className={baseStyles}
        style={{ ...style, x: magneticX, y: magneticY }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        whileTap={{ scale: 0.96 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={baseStyles}
      style={{ ...style, x: magneticX, y: magneticY }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      whileTap={{ scale: 0.96 }}
    >
      {content}
    </motion.button>
  );
}
