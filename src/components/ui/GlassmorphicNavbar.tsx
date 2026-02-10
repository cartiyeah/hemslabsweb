"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Droplets, Users, Calendar } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
}

const navIcons = [
  <Sparkles key="sparkles" size={20} />,
  <Droplets key="droplets" size={20} />,
  <Users key="users" size={20} />,
  <Calendar key="calendar" size={20} />,
];

interface GlassmorphicNavbarProps {
  items: NavItem[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

const GlassmorphicNavbar: React.FC<GlassmorphicNavbarProps> = ({
  items,
  activeIndex,
  onNavigate,
}) => {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2.5 shadow-2xl"
      >
        {/* Glow effect container */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-pink-500/20 to-rose-500/20 blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isHovered = hoveredTab === index;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(index)}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer z-10 select-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active/Hover bubble background */}
              {(isActive || isHovered) && (
                <motion.div
                  layoutId={isActive ? "active-bubble" : undefined}
                  className={`absolute inset-0 rounded-full ${
                    isActive
                      ? "bg-white/20"
                      : "bg-white/10"
                  }`}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  {/* Glow effect for active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 20px 2px rgba(52, 211, 153, 0.3)",
                          "0 0 30px 4px rgba(244, 114, 182, 0.4)",
                          "0 0 20px 2px rgba(52, 211, 153, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              )}

              {/* Icon */}
              <motion.span
                className={`relative z-10 transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : isHovered
                    ? "text-emerald-200"
                    : "text-white/70"
                }`}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {navIcons[index]}
              </motion.span>

              {/* Label */}
              <motion.span
                className={`relative z-10 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : isHovered
                    ? "text-emerald-100"
                    : "text-white/70"
                }`}
              >
                {item.label}
              </motion.span>

              {/* Bubble particles on hover */}
              {isHovered && (
                <>
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400/60 rounded-full blur-sm"
                    animate={{
                      y: [-5, -15, -5],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400/60 rounded-full blur-sm"
                    animate={{
                      y: [5, 15, 5],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 -right-2 w-1 h-1 bg-pink-400/60 rounded-full blur-sm"
                    animate={{
                      x: [0, 10, 0],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                  />
                </>
              )}
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default GlassmorphicNavbar;
