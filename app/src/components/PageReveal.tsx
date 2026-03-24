import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { motionTokens } from '@/lib/motion';

export function PageReveal() {
    const shouldReduceMotion = useReducedMotion();
    const [isComplete, setIsComplete] = useState(false);

    // If user prefers reduced motion, skip the animation completely
    if (shouldReduceMotion || isComplete) return null;

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] flex flex-col"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.12, delay: 0 }}
            onAnimationComplete={() => setIsComplete(true)}
        >
            {/* 4 horizontal panels that slide out to the right */}
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-black border-b border-white/[0.03]"
                    initial={{ x: '0%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.24,
                        ease: motionTokens.ease.standard,
                        delay: shouldReduceMotion ? 0 : i * 0.03,
                    }}
                />
            ))}
        </motion.div>
    );
}
