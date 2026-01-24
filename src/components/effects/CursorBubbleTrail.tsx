"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
}

export default function CursorBubbleTrail() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const bubbleId = useRef(0);
    const lastPosition = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    const createBubble = useCallback((x: number, y: number) => {
        const id = bubbleId.current++;
        const size = Math.random() * 8 + 4; // 4-12px
        const newBubble: Bubble = {
            id,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            size,
            opacity: 0.6,
        };

        setBubbles(prev => [...prev.slice(-15), newBubble]); // Keep max 16 bubbles

        // Fade out and remove after animation
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== id));
        }, 800);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastPosition.current.x;
            const dy = e.clientY - lastPosition.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only create bubbles when moving fast enough
            if (distance > 15) {
                lastPosition.current = { x: e.clientX, y: e.clientY };

                if (rafId.current) cancelAnimationFrame(rafId.current);
                rafId.current = requestAnimationFrame(() => {
                    createBubble(e.clientX, e.clientY);
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [createBubble]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {bubbles.map(bubble => (
                <div
                    key={bubble.id}
                    className="absolute rounded-full"
                    style={{
                        left: bubble.x,
                        top: bubble.y,
                        width: bubble.size,
                        height: bubble.size,
                        background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(159,197,232,0.4) 50%, transparent 70%)`,
                        boxShadow: `0 0 ${bubble.size * 0.5}px rgba(255,255,255,0.5)`,
                        transform: "translate(-50%, -50%)",
                        animation: "bubbleFade 0.8s ease-out forwards",
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes bubbleFade {
                    0% {
                        opacity: 0.7;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(1.5) translateY(-20px);
                    }
                }
            `}</style>
        </div>
    );
}
