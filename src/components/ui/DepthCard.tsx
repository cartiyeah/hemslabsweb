"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface DepthCardProps {
    href: string;
    image: string;
    title: string;
    tags?: string[];
    index?: number;
}

// Window panel directions based on grid position
// 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
const getWindowPanelDirection = (index: number) => {
    const directions = [
        { x: -60, y: -60 }, // top-left comes from top-left
        { x: 60, y: -60 },  // top-right comes from top-right
        { x: -60, y: 60 },  // bottom-left comes from bottom-left
        { x: 60, y: 60 },   // bottom-right comes from bottom-right
    ];
    return directions[index % 4];
};

export default function DepthCard({
    href,
    image,
    title,
    tags = [],
    index = 0,
}: DepthCardProps) {
    const direction = getWindowPanelDirection(index);

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: direction.x,
                y: direction.y,
                scale: 0.9,
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8,
                delay: index * 0.1,
            }}
        >
            <Link href={href} className="group block">
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <p className="text-xs uppercase tracking-wider text-[var(--foreground)]/60 mb-2 font-medium">
                        {tags.join(" • ")}
                    </p>
                )}

                {/* Title with arrow */}
                <div className="flex items-center gap-3">
                    <motion.span
                        className="text-xl text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors"
                        whileHover={{ x: 4 }}
                    >
                        →
                    </motion.span>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {title}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );
}
