"use client";

import { useEffect, useState, useRef, memo } from "react";

interface Bubble {
    id: number;
    left: number;       // X position (%)
    size: number;       // Size in pixels
    duration: number;   // Animation duration
    delay: number;      // Stagger delay
}

interface BubbleLayerProps {
    scrollProgress: number;
    isNavigating: boolean;
    targetIndex: number | null;
    onAnimatingChange?: (animating: boolean) => void;
}

const BubbleLayer = memo(function BubbleLayer({ scrollProgress, isNavigating, targetIndex, onAnimatingChange }: BubbleLayerProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [triggered, setTriggered] = useState(false);
    const [animating, setAnimating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync internal animating state to parent
    useEffect(() => {
        onAnimatingChange?.(animating);
    }, [animating, onAnimatingChange]);

    // Generate bubbles once
    useEffect(() => {
        const generated: Bubble[] = [];
        const bubbleCount = 100;

        for (let i = 0; i < bubbleCount; i++) {
            // Distribute more uniformly across the screen
            const column = i % 10;
            const baseLeft = column * 10 + Math.random() * 8;

            generated.push({
                id: i,
                left: Math.min(baseLeft, 98),
                size: 72 + Math.random() * 120, // 20% larger bubbles (72-192px)
                duration: 0.6 + Math.random() * 0.9,
                delay: Math.random() * 0.5,
            });
        }

        setBubbles(generated);
    }, []);

    // Trigger threshold: 6% scroll (masks transition from hero to Bubbles)
    const triggerPoint = 0.16;
    const lastProgressRef = useRef(scrollProgress);
    const isJumpingRef = useRef(false);

    useEffect(() => {
        const delta = Math.abs(scrollProgress - lastProgressRef.current);
        const isSignificantJump = delta > 0.1;

        // EXCLUSIVE COMMAND: High Priority Lock
        // If we are navigating to anything other than the Bubbles section (Index 1),
        // we explicitly forbid the surge from ever triggering.
        const isSafeSection = targetIndex === 1;
        const isJumpingPast = (targetIndex !== null && !isSafeSection) || isSignificantJump;

        if (isJumpingPast) {
            isJumpingRef.current = true;
            // SILENT COMMAND: If jumping past Bubbles to a lower section (index > 1),
            // mark as triggered so it doesn't fire at the end of the scroll.
            if (targetIndex !== null && targetIndex > 1 && scrollProgress > triggerPoint) {
                setTriggered(true);
            }
        }

        // Reset jumping state only when scroll slows down near a stable point
        if (delta < 0.01 && !isNavigating) {
            isJumpingRef.current = false;
        }

        const shouldSuppress = isNavigating || isJumpingRef.current || (targetIndex !== null && !isSafeSection);

        if (scrollProgress >= triggerPoint && !triggered && !animating && !shouldSuppress) {
            setTriggered(true);
            setAnimating(true);

            // Clear bubbles after transition completes
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setAnimating(false);
            }, 2500);
        }

        // Reset trigger if scrolled way back up
        if (scrollProgress < triggerPoint - 0.05 && triggered) {
            setTriggered(false);
            setAnimating(false);
        }

        lastProgressRef.current = scrollProgress;
    }, [scrollProgress, triggered, animating, isNavigating, targetIndex]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!animating) return null;

    return (
        <div
            className="bubble-layer"
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 200, // Above everything!
            }}
        >
            {/* Solid curtain — guarantees full coverage behind bubbles */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '100vh',
                    height: '120vh',
                    background: 'linear-gradient(180deg, transparent 0%, #0f172a 15%, #131c2e 50%, #162032 100%)',
                    animation: 'bubble-curtain 2.5s ease-in-out forwards',
                    zIndex: 0,
                }}
            />

            {bubbles.map((bubble) => {
                // Randomize iridescent color shift for each bubble
                const hueShift = (bubble.id * 37) % 360;

                return (
                    <div
                        key={bubble.id}
                        className="bubble"
                        style={{
                            position: 'absolute',
                            left: `${bubble.left}%`,
                            bottom: '-200px',
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            borderRadius: '50%',
                            // Soap bubble with visible tinted iridescence
                            background: `
                                radial-gradient(circle at 30% 30%,
                                    rgba(255, 255, 255, 0.7) 0%,
                                    rgba(255, 255, 255, 0.2) 8%,
                                    hsla(${hueShift}, 60%, 80%, 0.15) 25%,
                                    hsla(${(hueShift + 90) % 360}, 55%, 75%, 0.12) 45%,
                                    hsla(${(hueShift + 180) % 360}, 50%, 70%, 0.18) 65%,
                                    hsla(${(hueShift + 60) % 360}, 65%, 65%, 0.4) 80%,
                                    hsla(${(hueShift + 120) % 360}, 60%, 60%, 0.5) 90%,
                                    hsla(${hueShift}, 55%, 65%, 0.45) 100%
                                )
                            `,
                            // Tinted iridescent border ring
                            border: `2px solid hsla(${hueShift}, 50%, 65%, 0.6)`,
                            boxShadow: `
                                inset 0 0 ${bubble.size * 0.15}px rgba(255, 255, 255, 0.3),
                                inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${bubble.size * 0.2}px rgba(255, 255, 255, 0.25),
                                0 0 ${bubble.size * 0.12}px hsla(${(hueShift + 90) % 360}, 55%, 65%, 0.35)
                            `,
                            animation: `bubble-surge ${bubble.duration}s linear forwards`,
                            animationDelay: `${bubble.delay}s`,
                            transform: 'translateZ(0)',
                            zIndex: 1,
                        }}
                    />
                );
            })}
        </div>
    );
});

export default BubbleLayer;
