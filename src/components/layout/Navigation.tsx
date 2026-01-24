"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/marketing", label: "Marketing" },
    { href: "/bubbles", label: "Bubbles" },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : ""
                }`}
        >
            <nav className="mx-auto max-w-7xl flex items-center justify-end gap-4">
                {/* Nav Links */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="hidden md:flex items-center gap-1 glass-nav rounded-full px-2 py-1.5"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${pathname === item.href
                                    ? "text-[var(--foreground)]"
                                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                                }`}
                        >
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute inset-0 bg-black/5 rounded-full shadow-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center gap-3"
                >
                    <button className="hidden md:flex btn-icon">
                        <span className="w-4 h-0.5 bg-current rounded-full" />
                    </button>

                    <Link href="#contact" className="hidden md:flex btn-primary text-sm py-2.5 px-5">
                        Let&apos;s Talk
                        <motion.span
                            className="w-1.5 h-1.5 bg-current rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </Link>

                    <button className="flex items-center gap-2 btn-secondary text-sm py-2.5 px-4">
                        Menu
                        <span className="flex gap-0.5">
                            <span className="w-1 h-1 bg-current rounded-full" />
                            <span className="w-1 h-1 bg-current rounded-full" />
                        </span>
                    </button>
                </motion.div>
            </nav>
        </motion.header>
    );
}
