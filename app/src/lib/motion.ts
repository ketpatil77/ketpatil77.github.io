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
