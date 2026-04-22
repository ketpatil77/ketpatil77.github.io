import { cn } from '@/lib/utils';

interface ShineBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  borderWidth?: number;
  duration?: number; // seconds for one full rotation
  color?: string | string[];
  active?: boolean; // always-animate vs hover-only
}

export function ShineBorder({
  children,
  className,
  borderRadius = 12,
  borderWidth = 1,
  duration = 5,
  color = ['var(--cyan-full)', 'var(--violet)', 'var(--cyan-dim)'],
  active = false,
}: ShineBorderProps) {
  const colors = Array.isArray(color) ? color.join(', ') : color;

  return (
    <div
      className={cn(
        'shine-border-root relative',
        active ? 'shine-border-active' : 'shine-border-hover',
        className
      )}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        background: `conic-gradient(from var(--shine-angle, 0deg), transparent 20%, ${colors}, transparent 80%)`,
        '--shine-duration': `${duration}s`,
      } as React.CSSProperties}
    >
      <div
        className="relative h-full w-full"
        style={{ borderRadius: `${borderRadius - borderWidth}px`, background: 'var(--bg-surface)' }}
      >
        {children}
      </div>
    </div>
  );
}
