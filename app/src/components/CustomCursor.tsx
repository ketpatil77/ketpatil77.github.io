import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isFinePointer, setIsFinePointer] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Dot — instant
    const dotX = useMotionValue(-100);
    const dotY = useMotionValue(-100);

    // Ring — lerped behind
    const ringX = useSpring(useMotionValue(-100), { damping: 28, stiffness: 180, mass: 0.6 });
    const ringY = useSpring(useMotionValue(-100), { damping: 28, stiffness: 180, mass: 0.6 });

    const ringXBase = useRef(useMotionValue(-100));
    const ringYBase = useRef(useMotionValue(-100));

    useEffect(() => {
        const pointerQuery = window.matchMedia('(pointer: fine)');
        const updatePointer = () => setIsFinePointer(pointerQuery.matches);
        updatePointer();
        pointerQuery.addEventListener('change', updatePointer);
        return () => pointerQuery.removeEventListener('change', updatePointer);
    }, []);

    useEffect(() => {
        if (!isFinePointer) return;

        // Keep ring source values to drive the spring
        const rx = ringXBase.current;
        const ry = ringYBase.current;

        const unsubX = rx.on('change', (v) => ringX.set(v));
        const unsubY = ry.on('change', (v) => ringY.set(v));

        const onMove = (e: MouseEvent) => {
            dotX.set(e.clientX);
            dotY.set(e.clientY);
            rx.set(e.clientX);
            ry.set(e.clientY);
        };

        const onEnter = () => setIsVisible(true);
        const onLeave = () => setIsVisible(false);
        const onDown = () => setIsClicking(true);
        const onUp = () => setIsClicking(false);

        const onHover = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            setIsHovering(
                t.tagName === 'A' ||
                t.tagName === 'BUTTON' ||
                !!t.closest('a') ||
                !!t.closest('button') ||
                t.classList.contains('card-interactive') ||
                t.classList.contains('card-spotlight')
            );
        };

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('mouseover', onHover);

        return () => {
            unsubX();
            unsubY();
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('mouseover', onHover);
        };
    }, [dotX, dotY, ringX, ringY, isFinePointer]);

    if (!isFinePointer) {
        return null;
    }

    const RING_SIZE = isHovering ? 44 : isClicking ? 20 : 32;
    const DOT_SIZE = isHovering ? 0 : isClicking ? 3 : 5;

    return (
        <>
            {/* Trailing ring */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    width: RING_SIZE,
                    height: RING_SIZE,
                    border: `1.5px solid ${isHovering ? 'rgba(34,211,238,0.9)' : 'rgba(255,255,255,0.4)'}`,
                    background: isHovering ? 'rgba(34,211,238,0.06)' : 'transparent',
                    boxShadow: isHovering ? '0 0 16px rgba(34,211,238,0.25)' : 'none',
                    transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
            />
            {/* Dot */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    background: isHovering ? 'rgba(34,211,238,0.0)' : 'rgba(255,255,255,0.9)',
                    transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease',
                }}
            />
        </>
    );
}
