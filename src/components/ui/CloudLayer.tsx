"use client";

import { useEffect, useState, memo } from "react";

interface Cloud {
    id: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    direction: "left" | "right";
    zIndex: number;
    svgFile: string; // Which cloud SVG to use
}

interface CloudLayerProps {
    scrollProgress: number;
}

const CloudLayer = memo(function CloudLayer({ scrollProgress }: CloudLayerProps) {
    const [clouds, setClouds] = useState<Cloud[]>([]);

    useEffect(() => {
        // Generate random clouds with varying depth
        const generated: Cloud[] = [];
        const cloudCount = 20;
        const cloudFiles = ['/cloud.svg', '/cloud2.svg', '/cloud3.svg'];

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
                svgFile: cloudFiles[Math.floor(Math.random() * cloudFiles.length)],
            });
        }

        setClouds(generated);
    }, []);

    // Cloud exit window: 5% to 15% scroll
    const exitStart = 0.05;
    const exitEnd = 0.15;

    // Calculate cloud visibility and exit offset
    let cloudOpacity = 1;
    let exitOffset = 0;

    if (scrollProgress > exitStart) {
        const exitProgress = Math.min(
            (scrollProgress - exitStart) / (exitEnd - exitStart),
            1
        );
        // Smoothly glide off-screen (100vw total movement over the window)
        exitOffset = exitProgress * 100;
        // Natural linear fade
        cloudOpacity = 1 - exitProgress;
    }

    // Completely gone by exitEnd
    if (scrollProgress > exitEnd) return null;

    return (
        <div
            className="cloud-layer"
            style={{
                opacity: cloudOpacity,
                // Removed transition: 'opacity 0.3s' as it fights JS scroll progress
                willChange: 'opacity'
            }}
        >
            {clouds.map((cloud) => {
                // Calculate directional exit: move in original travel direction
                const boostDirection = cloud.direction === "right" ? 1 : -1;
                const extraTranslate = exitOffset * boostDirection;

                return (
                    <div
                        key={cloud.id}
                        className={`cloud cloud-${cloud.direction}`}
                        style={{
                            top: `${cloud.top}%`,
                            width: `${cloud.size}px`,
                            height: `${cloud.size * 0.6}px`,
                            backgroundImage: `url('${cloud.svgFile}')`,
                            animationDuration: `${cloud.duration}s`,
                            animationDelay: `${cloud.delay}s`,
                            opacity: cloud.opacity,
                            zIndex: cloud.zIndex,
                            transform: `translateX(${extraTranslate}vw) translateZ(0)`,
                            // Removed transition: 'transform 0.5s' as it fights JS scroll progress
                            willChange: 'transform'
                        }}
                    />
                );
            })}
        </div>
    );
});

export default CloudLayer;
