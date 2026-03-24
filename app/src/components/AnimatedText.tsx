import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';

interface AnimatedTextProps {
    text: string;
    el?: ElementType;
    className?: string;
    once?: boolean;
    type?: 'chars' | 'words' | 'lines';
    delay?: number;
}

const defaultContainer: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.012, delayChildren: 0.04 * i },
    }),
};

const defaultItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
    },
};

export function AnimatedText({
    text,
    el: Wrapper = 'p',
    className,
    once = true,
    type = 'words',
    delay = 0,
}: AnimatedTextProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion || typeof text !== 'string') {
        return <Wrapper className={className}>{text}</Wrapper>;
    }

    const items = type === 'chars' ? text.split('') : text.split(' ');

    return (
        <Wrapper className={className}>
            <motion.span
                variants={defaultContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once, margin: '-50px' }}
                custom={delay}
                aria-hidden
            >
                {items.map((item, index) => (
                    <motion.span
                        key={index}
                        variants={defaultItem}
                        className={cn('inline-block', type === 'chars' && item === ' ' ? 'w-[0.25em]' : 'mr-[0.25em]')}
                    >
                        {item}
                    </motion.span>
                ))}
            </motion.span>
            <span className="sr-only">{text}</span>
        </Wrapper>
    );
}
