"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue, Variants } from "framer-motion";
import VideoShowcase from "@/components/ui/VideoShowcase";
import DepthCard from "@/components/ui/DepthCard";

// Portfolio items
const portfolioItems = [
  {
    href: "/events",
    image: "/images/event-crowd-color.png",
    title: "HEMS Live Events",
    tags: ["Events", "College", "Nightlife"],
  },
  {
    href: "/marketing",
    image: "/images/event-crowd-bw.jpg",
    title: "Growth Marketing",
    tags: ["Marketing", "Strategy", "Data"],
  },
  {
    href: "/bubbles",
    image: "/hems-bg-blue.jpg",
    title: "Bubbles AI",
    tags: ["AI", "WhatsApp", "Automation"],
  },
  {
    href: "/events",
    image: "/images/event-crowd-color.png",
    title: "Campus Takeovers",
    tags: ["Events", "Branding", "Experience"],
  },
];

// 3D Perspective wrapper component
function Parallax3D({
  children,
  scrollYProgress,
  yIn = 0,
  yOut = -100,
  rotateXIn = 0,
  rotateXOut = 15,
  scaleIn = 1,
  scaleOut = 0.9,
  opacityIn = 1,
  opacityOut = 0,
}: {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  yIn?: number;
  yOut?: number;
  rotateXIn?: number;
  rotateXOut?: number;
  scaleIn?: number;
  scaleOut?: number;
  opacityIn?: number;
  opacityOut?: number;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [yIn, yOut]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [rotateXIn, rotateXOut]);
  const scale = useTransform(scrollYProgress, [0, 1], [scaleIn, scaleOut]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [opacityIn, opacityIn, opacityOut]);

  return (
    <motion.div
      style={{
        y,
        rotateX,
        scale,
        opacity,
        transformPerspective: 1200,
        transformOrigin: "center center",
      }}
    >
      {children}
    </motion.div>
  );
}

// Hero intro animations
const heroContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Floating entrance animation
const floatIn: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 15,
      mass: 0.8,
    },
  },
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Hero scroll progress
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // About scroll progress
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  // Featured scroll progress
  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });

  // Services scroll progress
  const { scrollYProgress: servicesProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });

  // Hero parallax values
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], [0, -150]);
  const heroRotateX = useTransform(heroProgress, [0, 1], [0, 20]);

  return (
    <div ref={containerRef} className="min-h-screen relative" style={{ perspective: "1200px" }}>
      {/* ========================================
          HERO SECTION - 3D Perspective
          ======================================== */}
      <motion.section
        ref={heroRef}
        style={{
          opacity: heroOpacity,
          y: heroY,
          rotateX: heroRotateX,
          transformOrigin: "center top",
        }}
        className="relative min-h-screen flex flex-col justify-start px-6 lg:px-12 pt-8 pb-12 z-10"
      >
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* GIANT Logo - raised higher, smooth slide in */}
          <motion.div
            initial={{ x: -250, opacity: 0, rotateY: -15 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{
              duration: 1.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mb-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src="/hems-logo.svg.png"
              alt="HEMS Labs"
              width={1000}
              height={500}
              className="h-80 lg:h-[24rem] w-auto drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={heroItem}
            className="text-xl lg:text-2xl max-w-lg leading-relaxed text-[var(--foreground)] font-medium mb-12"
            style={{ transformStyle: "preserve-3d" }}
          >
            We build infrastructure for student life through events, marketing, and AI.
          </motion.p>

          {/* Video Showcase - restored larger size */}
          <motion.div
            variants={heroItem}
            style={{ transformStyle: "preserve-3d" }}
          >
            <VideoShowcase
              src="/videos/hero-reel.mp4"
              className="aspect-video max-h-[65vh]"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={heroItem}
            className="flex justify-center items-center gap-6 mt-12 text-sm text-[var(--foreground)]/50"
          >
            <motion.span
              className="text-xs"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >+</motion.span>
            <span className="uppercase tracking-[0.2em] text-xs font-medium">Scroll to explore</span>
            <motion.span
              className="text-xs"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >+</motion.span>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ========================================
          ABOUT SECTION - Floats in 3D space
          ======================================== */}
      <section
        ref={aboutRef}
        className="relative py-32 lg:py-40 px-6 lg:px-12 overflow-visible z-20"
        style={{ perspective: "1200px" }}
      >
        <Parallax3D
          scrollYProgress={aboutProgress}
          yIn={100}
          yOut={-50}
          rotateXIn={-5}
          rotateXOut={5}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Giant Text */}
              <motion.div
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <h2 className="display-lg mb-6 text-[var(--foreground)]">
                  Beyond Events
                  <br />
                  <span className="text-gradient">Within Reach</span>
                </h2>
              </motion.div>

              {/* Right: Description */}
              <motion.div
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
              >
                <p className="body-lg mb-8 text-[var(--foreground)]/80">
                  HEMS Labs is a venture studio from MIT Manipal that builds
                  solutions for student life. From packed venues to viral campaigns
                  to AI concierges—we create infrastructure that moves.
                </p>
                <Link href="/events" className="btn-secondary">
                  <span className="w-2 h-2 bg-current rounded-full" />
                  About Us
                </Link>
              </motion.div>
            </div>

            {/* Secondary Image with 3D float */}
            <motion.div
              variants={floatIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-24 lg:mt-32"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-[16/10] max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/event-crowd-color.png"
                  alt="HEMS Events"
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Parallax3D>
      </section>

      {/* ========================================
          FEATURED WORK - Cards float in 3D
          ======================================== */}
      <section
        ref={featuredRef}
        className="py-32 lg:py-40 px-6 lg:px-12 relative z-30 overflow-visible"
        style={{ perspective: "1200px" }}
      >
        <Parallax3D
          scrollYProgress={featuredProgress}
          yIn={80}
          yOut={-60}
          rotateXIn={-3}
          rotateXOut={3}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
              <motion.h2
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="display-lg"
              >
                Featured Work
              </motion.h2>
              <motion.p
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="body-lg max-w-sm text-[var(--foreground)]/80"
              >
                Projects crafted with forward-thinking partners over the years.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {portfolioItems.map((item, index) => (
                <DepthCard key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </Parallax3D>
      </section>

      {/* ========================================
          SERVICES - 3D Cards floating
          ======================================== */}
      <section
        ref={servicesRef}
        className="py-32 lg:py-40 px-6 lg:px-12 relative z-40 overflow-visible"
        style={{ perspective: "1200px" }}
      >
        <Parallax3D
          scrollYProgress={servicesProgress}
          yIn={60}
          yOut={-40}
          rotateXIn={-2}
          rotateXOut={4}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              variants={floatIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="power-header text-center mb-16"
            >
              What We Build
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Events */}
              <motion.div
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ y: -10, rotateX: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link
                  href="/events"
                  className="group block p-8 rounded-2xl h-full bg-white shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">HEMS Live</h3>
                  <p className="text-[var(--foreground)]/70 leading-relaxed">
                    Full-house events and venue takeovers that define Manipal nightlife.
                  </p>
                </Link>
              </motion.div>

              {/* Marketing */}
              <motion.div
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -10, rotateX: 5, scale: 1.02 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link
                  href="/marketing"
                  className="group block p-8 rounded-2xl h-full bg-white shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">HEMS Growth</h3>
                  <p className="text-[var(--foreground)]/70 leading-relaxed">
                    Data-driven marketing that penetrates Manipal markets.
                  </p>
                </Link>
              </motion.div>

              {/* Bubbles */}
              <motion.div
                variants={floatIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -10, rotateX: 5, scale: 1.02 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link
                  href="/bubbles"
                  className="group block p-8 rounded-2xl h-full bg-white shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B5BDB] to-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl">🫧</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">Bubbles AI</h3>
                  <p className="text-[var(--foreground)]/70 leading-relaxed">
                    Your WhatsApp concierge for orders, reminders, and schedules.
                  </p>
                </Link>
              </motion.div>
            </div>
          </div>
        </Parallax3D>
      </section>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="py-16 px-6 lg:px-12 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <Image
              src="/hems-logo.svg.png"
              alt="HEMS Labs"
              width={140}
              height={70}
              className="h-12 w-auto"
            />
            <span className="text-[var(--foreground)]/60 text-sm">
              © 2024 HEMS Labs. Manipal, India.
            </span>
          </div>

          <div className="flex gap-4">
            <a href="#" className="btn-primary text-sm py-2.5 px-5">
              Let&apos;s Talk
            </a>
            <a href="#" className="btn-secondary text-sm py-2.5 px-5">
              Menu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
