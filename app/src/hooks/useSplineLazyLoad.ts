import { useState, useEffect, useRef } from 'react';

interface UseSplineLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useSplineLazyLoad(options: UseSplineLazyLoadOptions = {}) {
  const { threshold = 0.1, rootMargin = '50px', enabled = true } = options;
  
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [enabled, shouldLoad, threshold, rootMargin]);

  return { ref, shouldLoad, isVisible };
}