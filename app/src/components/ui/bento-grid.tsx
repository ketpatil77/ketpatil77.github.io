import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoItemProps {
  children: React.ReactNode;
  featured?: boolean;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'bento-grid grid auto-rows-fr gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoItem({ children, featured = false, className }: BentoItemProps) {
  return (
    <div
      className={cn(
        'bento-item',
        featured && 'bento-item-featured sm:col-span-2 lg:row-span-2',
        className
      )}
    >
      {children}
    </div>
  );
}
