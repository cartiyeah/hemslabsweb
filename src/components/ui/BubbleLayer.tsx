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
        const bubbleCount = 250; // Reduced count for clarity

        for (let i = 0; i < bubbleCount; i++) {
            generated.push({
                id: i,
                left: Math.random() * 100,
                size: 40 + Math.random() * 100, // Larger bubbles
                duration: 0.4 + Math.random() * 0.7, // Even faster rise (0.2s to 0.7s)
                delay: Math.random() * 0.6, // Tighter stagger
            });
        }

        setBubbles(generated);
    }, []);

    // Trigger threshold: 20% scroll
    const triggerPoint = 0.22;
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
            }, 1600);
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
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="bubble"
                    style={{
                        position: 'absolute',
                        left: `${bubble.left}%`,
                        bottom: '-200px', // Start further down
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        background: `url('/bubble.svg') no-repeat center center`,
                        backgroundSize: 'contain',
                        // One-shot animation (forwards), linear for constant flow
                        animation: `bubble-surge ${bubble.duration}s linear forwards`,
                        animationDelay: `${bubble.delay}s`,
                        transform: 'translateZ(0)', // Force GPU without excessive layering hints
                    }}
                />
            ))}
        </div>
    );
});

export default BubbleLayer;
