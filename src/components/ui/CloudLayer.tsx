"use client";

import { useEffect, useState } from "react";

interface Cloud {
    id: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    direction: "left" | "right";
    zIndex: number;
}

export default function CloudLayer() {
    const [clouds, setClouds] = useState<Cloud[]>([]);

    useEffect(() => {
        // Generate random clouds with varying depth
        const generated: Cloud[] = [];
        const cloudCount = 20;

        for (let i = 0; i < cloudCount; i++) {
            // Depth factor: 0 = far (small, slow, faint), 1 = close (large, fast, bright)
            const depth = Math.random();

            generated.push({
                id: i,
                top: Math.random() * 85, // 0% to 85% from top (full Y variation)
                size: 100 + depth * 250, // 100px to 350px
                duration: 60 - depth * 40, // 60s (far) to 20s (close)
                delay: Math.random() * -60, // Stagger start
                opacity: 0.3 + depth * 0.5, // 0.3 to 0.8
                direction: Math.random() > 0.5 ? "left" : "right",
                zIndex: Math.floor(depth * 10),
            });
        }

        setClouds(generated);
    }, []);

    return (
        <div className="cloud-layer">
            {clouds.map((cloud) => (
                <div
                    key={cloud.id}
                    className={`cloud cloud-${cloud.direction}`}
                    style={{
                        top: `${cloud.top}%`,
                        width: `${cloud.size}px`,
                        height: `${cloud.size * 0.6}px`,
                        animationDuration: `${cloud.duration}s`,
                        animationDelay: `${cloud.delay}s`,
                        opacity: cloud.opacity,
                        zIndex: cloud.zIndex,
                    }}
                />
            ))}
        </div>
    );
}
