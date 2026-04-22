export const motionTokens = {
  duration: {
    fast: 0.24,
    base: 0.42,
    slow: 0.72,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1] as const,
    smooth: [0.33, 1, 0.68, 1] as const,
  },
  spring: {
    soft: { type: 'spring', bounce: 0.24, duration: 0.72 } as const,
    hero: { type: 'spring', bounce: 0.28, duration: 1.0 } as const,
  },
} as const;

// Editorial animation variants — warm, purposeful, 300-400ms
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const cardHoverVariants = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' },
  hover: {
    y: -4,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Scroll trigger options for IntersectionObserver
export const scrollTriggerOptions = {
  threshold: 0.2,
  margin: '0px 0px -100px 0px',
};
