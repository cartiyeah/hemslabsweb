"use client";

import { useEffect, useState } from "react";

interface Star {
    id: number;
    top: number;
    left: number;
    size: number;
    opacity: number;
    animDuration: number;
    animDelay: number;
}

interface StarFieldProps {
    opacity: number;
}

export default function StarField({ opacity }: StarFieldProps) {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        // Generate fewer, subtle stars (50 instead of 150)
        const generated: Star[] = [];
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
            generated.push({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: Math.random() * 2 + 1, // 1px to 3px
                opacity: Math.random() * 0.6 + 0.4, // 0.4 to 1.0 (brighter for visibility)
                animDuration: Math.random() * 3 + 2, // 2s to 5s twinkle
                animDelay: Math.random() * 5,
            });
        }

        setStars(generated);
    }, []);

    return (
        <div
            className="star-field fixed inset-0 pointer-events-none z-0"
            style={{ opacity, transition: 'opacity 1s ease' }}
        >
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star absolute bg-white rounded-full"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animation: `twinkle ${star.animDuration}s ease-in-out infinite ${star.animDelay}s`,
                        boxShadow: `0 0 ${star.size + 1}px rgba(255, 255, 255, 0.9)`
                    }}
                />
            ))}
        </div>
    );
}
