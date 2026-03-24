 import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    intensity?: number;
    className?: string;
    asChild?: boolean;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
    ({ children, variant = 'primary', intensity = 0.4, className, ...props }, ref) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const shouldReduceMotion = useReducedMotion();
        const [position, setPosition] = useState({ x: 0, y: 0 });

        const setRefs = (node: HTMLButtonElement | null) => {
            buttonRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!buttonRef.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            setPosition({ x: middleX * intensity, y: middleY * intensity });
        };

        const reset = () => {
            setPosition({ x: 0, y: 0 });
        };

        const variantStyles = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            outline: 'btn-outline',
            ghost: 'btn-ghost',
        };

        if (shouldReduceMotion) {
            return (
                <button ref={setRefs} className={cn('btn', variantStyles[variant], className)} {...props}>
                    {children}
                </button>
            );
        }

        return (
            <motion.button
                ref={setRefs}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
                className={cn('btn z-10', variantStyles[variant], className)}
                {...(props as any)}
            >
                {children}
            </motion.button>
        );
    }
);

MagneticButton.displayName = 'MagneticButton';
