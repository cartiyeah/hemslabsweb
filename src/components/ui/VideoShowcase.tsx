"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VideoShowcaseProps {
    src: string;
    poster?: string;
    className?: string;
}

export default function VideoShowcase({
    src,
    poster,
    className = "",
}: VideoShowcaseProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
                if (entry.isIntersecting && videoRef.current) {
                    videoRef.current.play().catch(() => { });
                } else if (videoRef.current) {
                    videoRef.current.pause();
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`video-container ${className}`}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </motion.div>
    );
}
