"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Context to signal when splash is complete
const SplashContext = createContext<{ isComplete: boolean }>({ isComplete: false });

export const useSplashComplete = () => useContext(SplashContext);

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Start exit sequence
                    setTimeout(() => {
                        setIsVisible(false);
                        // Signal complete after exit animation
                        setTimeout(() => setIsComplete(true), 600);
                    }, 400);
                    return 100;
                }
                return prev + Math.random() * 18;
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <SplashContext.Provider value={{ isComplete }}>
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                        }}
                        className="fixed inset-0 z-[100] bg-[#1A1A2E] flex flex-col items-center justify-center"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="relative mb-8"
                        >
                            <Image
                                src="/hems-logo.svg.png"
                                alt="HEMS Labs"
                                width={160}
                                height={80}
                                className="h-16 w-auto"
                                priority
                            />
                        </motion.div>

                        {/* Loading indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="font-mono text-[var(--accent-primary)] text-sm tracking-widest mb-4">
                                {Math.floor(Math.min(progress, 100)).toString().padStart(3, "0")}%
                            </div>
                            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[var(--accent-primary)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                />
                            </div>
                        </motion.div>

                        {/* Subtle glow */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SplashContext.Provider>
    );
}
