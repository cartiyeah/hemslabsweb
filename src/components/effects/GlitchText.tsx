"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
}

const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

export default function GlitchText({
    text,
    className = "",
    delay = 0,
    duration = 1.5,
}: GlitchTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimating(true);
            let iteration = 0;
            const totalIterations = text.length * 3;

            const interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((char, index) => {
                            // Characters before the "reveal point" show correctly
                            if (index < iteration / 3) {
                                return char;
                            }
                            // Characters at or after the reveal point glitch
                            if (char === " ") return " ";
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join("")
                );

                iteration++;

                if (iteration >= totalIterations) {
                    clearInterval(interval);
                    setDisplayText(text);
                }
            }, (duration * 1000) / totalIterations);

            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [text, delay, duration]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnimating ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={className}
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
            {displayText || text}
        </motion.span>
    );
}
