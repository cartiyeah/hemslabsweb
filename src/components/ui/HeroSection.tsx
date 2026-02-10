"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Users, Calendar, Rocket, Sparkles, Star } from "lucide-react";

interface ProductCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ icon, title, description, color, delay, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden h-full"
      >
        {/* Icon */}
        <div className="mb-4">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">
          {title}
        </h3>
        <p className="text-white/70 text-sm font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const FloatingElement: React.FC<{ delay: number; duration: number; x: number; y: number }> = ({
  delay,
  duration,
  x,
  y,
}) => {
  return (
    <motion.div
      className="absolute w-32 h-32 rounded-full bg-white/5 backdrop-blur-md"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

const Cloud: React.FC<{ delay: number; duration: number; x: number; y: number; size: number }> = ({
  delay,
  duration,
  x,
  y,
  size,
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        x: [0, 100, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 200 120"
        className="filter drop-shadow-lg"
      >
        <path
          d="M30,80 Q10,80 10,60 Q10,40 30,40 Q40,20 60,20 Q80,20 90,35 Q110,30 120,45 Q140,45 140,65 Q140,85 120,85 Z"
          fill="white"
          opacity="0.15"
        />
      </svg>
    </motion.div>
  );
};

interface HeroSectionProps {
  onNavigate?: (index: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full">
      {/* Film Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Massive atmospheric orbs with glow effects */}
      <motion.div
        className="absolute w-[40rem] h-[40rem] rounded-full bg-white/10 blur-[120px]"
        style={{ left: '-10%', top: '5%' }}
        animate={{
          y: [0, -120, 0],
          x: [0, 80, 0],
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[50rem] h-[50rem] rounded-full bg-[#FF99CC]/15 blur-[140px]"
        style={{ right: '-15%', top: '15%' }}
        animate={{
          y: [0, 100, 0],
          x: [0, -80, 0],
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute w-[45rem] h-[45rem] rounded-full bg-[#4ADE80]/12 blur-[130px]"
        style={{ left: '40%', bottom: '-10%' }}
        animate={{
          y: [0, -90, 0],
          x: [0, 60, 0],
          scale: [1, 1.5, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      {/* Additional depth layers */}
      <motion.div
        className="absolute w-[35rem] h-[35rem] rounded-full bg-[#2E7DFF]/20 blur-[100px]"
        style={{ left: '25%', top: '40%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute w-[30rem] h-[30rem] rounded-full bg-white/8 blur-[90px]"
        style={{ right: '20%', bottom: '20%' }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Floating background elements */}
      <FloatingElement delay={0} duration={20} x={10} y={20} />
      <FloatingElement delay={2} duration={25} x={80} y={60} />
      <FloatingElement delay={4} duration={22} x={50} y={80} />
      <FloatingElement delay={1} duration={18} x={70} y={30} />

      {/* Animated Clouds */}
      <Cloud delay={0} duration={30} x={5} y={10} size={250} />
      <Cloud delay={5} duration={35} x={60} y={5} size={200} />
      <Cloud delay={10} duration={40} x={80} y={20} size={180} />
      <Cloud delay={3} duration={32} x={20} y={60} size={220} />
      <Cloud delay={8} duration={38} x={70} y={70} size={190} />
      <Cloud delay={12} duration={28} x={40} y={40} size={210} />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col min-h-[100vh]">
        {/* Main Hero */}
        <div className="flex-1 flex items-center justify-center px-6 py-20 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="text-white/70 text-sm font-bold uppercase tracking-wider">Hems - A Leading Web Design Company</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
                YEAH, WE REGISTERED NOW BITCH
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium mb-8 leading-relaxed">
                Three powerful products designed to revolutionize how you connect, engage, and experience life.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FF99CC] to-[#FF6B9D] text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                START A PROJECT →
              </motion.button>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              {/* Astronaut/Rocket Illustration Area */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Central Rocket */}
                <div className="relative z-10">
                  <Rocket className="w-48 h-48 md:w-64 md:h-64 text-white" strokeWidth={1.5} />
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 -left-10"
                >
                  <MessageCircle className="w-16 h-16 text-[#FF99CC]" strokeWidth={2} />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-20 -right-10"
                >
                  <Calendar className="w-14 h-14 text-[#4ADE80]" strokeWidth={2} />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 left-5"
                >
                  <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-5 right-10"
                >
                  <Sparkles className="w-10 h-10 text-[#FF99CC]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Product Cards Section */}
        <div className="relative z-10 px-6 pb-20 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductCard
                icon={<MessageCircle className="w-8 h-8 text-white" strokeWidth={2.5} />}
                title="Bubbles"
                description="Your AI-powered personal assistant for seamless navigation and instant answers."
                color="#FF99CC"
                delay={0.2}
                onClick={() => onNavigate?.(1)}
              />

              <ProductCard
                icon={<Users className="w-8 h-8 text-white" strokeWidth={2.5} />}
                title="Social"
                description="Connect, collaborate, and build meaningful relationships within your community."
                color="#4ADE80"
                delay={0.4}
                onClick={() => onNavigate?.(2)}
              />

              <ProductCard
                icon={<Calendar className="w-8 h-8 text-white" strokeWidth={2.5} />}
                title="Events"
                description="Discover and experience unforgettable moments with perfectly curated events."
                color="#2E7DFF"
                delay={0.6}
                onClick={() => onNavigate?.(3)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
