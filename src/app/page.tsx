

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import StarField from "@/components/ui/StarField";
import BubbleLayer from "@/components/ui/BubbleLayer";
import ChatWindow from "@/components/ui/ChatWindow";
import GlassmorphicNavbar from "@/components/ui/GlassmorphicNavbar";
import BubblesSection from "@/components/ui/BubblesSection";
import HeroSection from "@/components/ui/HeroSection";

const sections = [
  { id: "who-n-what", label: "Who 'n What" },
  { id: "bubbles", label: "Bubbles" },
  { id: "social", label: "Social" },
  { id: "events", label: "Events" },
];

// Day to dark color stops
const skyColors = {
  day: {
    top: '#1E5799',    // Deep blue (top)
    middle: '#4A90C2', // Medium blue
    bottom: '#7EC8E3', // Light blue (horizon)
  },
  bubblesDeep: {
    top: '#0f172a', // Dark navy (particle bg)
    middle: '#131c2e',
    bottom: '#162032',
  },
  black: {
    top: '#000000',
    middle: '#000000',
    bottom: '#000000',
  },
};

// Interpolate between two colors
function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navTarget, setNavTarget] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [surgeComplete, setSurgeComplete] = useState(false);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Force scroll to top on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Reduce scroll sensitivity by 90% during bubble surge (instead of full lock)
  useEffect(() => {
    if (!isScrollLocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy(0, e.deltaY * 0.1);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isScrollLocked]);
  // High-performance tracking
  const stateRef = useRef({
    lastProgress: 0,
    isNavigating: false,
    lastNavTime: 0,
    isScrollLocked: false, // Synchronous lock for the scroll handler
    surgeComplete: false,  // Once bubble surge finishes, treat 0.08+ as Bubbles section
  });

  // Track scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight / 3;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(window.scrollY / docHeight, 1);

          // Detect large jumps or programmatic navigation
          const isJump = Math.abs(progress - stateRef.current.lastProgress) > 0.1;

          if (isJump || stateRef.current.isNavigating) {
            setIsNavigating(true);
          }

          setScrollProgress(progress);
          stateRef.current.lastProgress = progress;

          // HARD GUARD: If we are in the middle of a bubble surge or jump,
          // DO NOT let the scroll handler change the activeIndex.
          if (stateRef.current.isScrollLocked || stateRef.current.isNavigating) {
            ticking = false;
            return;
          }

          let foundIndex = 0;
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sectionRefs.current[i];
            if (section && section.offsetTop <= scrollPosition) {
              foundIndex = i;
              break;
            }
          }
          // After bubble surge, treat anything past trigger point as Bubbles section
          if (stateRef.current.surgeComplete && progress >= 0.06 && foundIndex === 0) {
            foundIndex = 1;
          }
          setActiveIndex((prev) => (prev !== foundIndex ? foundIndex : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    // Reset navigation flag when scrolling ends
    const handleScrollEnd = () => {
      setIsNavigating(false);
      setNavTarget(null);
      stateRef.current.isNavigating = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, []); // Sections are static, no need to re-bind

  // Sun calculations and Colors memoized
  const skyTheme = useMemo(() => {
    let top, middle, bottom;

    if (scrollProgress < 0.10) {
      // Day sky holds until curtain starts covering
      top = skyColors.day.top;
      middle = skyColors.day.middle;
      bottom = skyColors.day.bottom;
    } else if (scrollProgress < 0.18) {
      // Transition from blue sky to dark navy WHILE curtain fully covers viewport
      const t = (scrollProgress - 0.10) / 0.08;
      top = lerpColor(skyColors.day.top, skyColors.bubblesDeep.top, t);
      middle = lerpColor(skyColors.day.middle, skyColors.bubblesDeep.middle, t);
      bottom = lerpColor(skyColors.day.bottom, skyColors.bubblesDeep.bottom, t);
    } else if (scrollProgress < 0.55) {
      top = skyColors.bubblesDeep.top;
      middle = skyColors.bubblesDeep.middle;
      bottom = skyColors.bubblesDeep.bottom;
    } else if (scrollProgress < 0.70) {
      const t = (scrollProgress - 0.55) / 0.15;
      top = lerpColor(skyColors.bubblesDeep.top, skyColors.black.top, t);
      middle = lerpColor(skyColors.bubblesDeep.middle, skyColors.black.middle, t);
      bottom = lerpColor(skyColors.bubblesDeep.bottom, skyColors.black.bottom, t);
    } else {
      top = skyColors.black.top;
      middle = skyColors.black.middle;
      bottom = skyColors.black.bottom;
    }

    const sunAngle = scrollProgress * Math.PI;
    const sunX = 10 + (80 * scrollProgress);
    const sunY = 80 - (Math.sin(sunAngle) * 60);

    const sunColor = scrollProgress < 0.3
      ? '#FFD700'
      : lerpColor('#FFD700', '#8B0000', Math.min((scrollProgress - 0.3) / 0.4, 1));

    // Fade sun out as sky goes dark
    const sunOpacity = scrollProgress > 0.55 ? Math.max(1 - ((scrollProgress - 0.55) / 0.15), 0) : 1;
    const isNight = scrollProgress > 0.70;

    return { top, middle, bottom, sunX, sunY, sunColor, sunOpacity, isNight };
  }, [scrollProgress]);

  const scrollToSection = (index: number) => {
    // Immediately update the active tab - this is the user's intent
    setActiveIndex(index);

    const section = sectionRefs.current[index];
    if (section) {
      // Mark as navigating to prevent scroll handler interference
      stateRef.current.lastNavTime = Date.now();
      stateRef.current.isNavigating = true;
      setNavTarget(index);
      setIsNavigating(true);

      section.scrollIntoView({ behavior: 'smooth' });

      // Fallback timeout to reset navigation state (in case scrollend doesn't fire)
      // Must exceed bubble surge duration (2500ms) to prevent interference
      setTimeout(() => {
        stateRef.current.isNavigating = false;
        setIsNavigating(false);
        setNavTarget(null);
      }, 2800);
    }
  };

  return (
    <main className="relative">
      {/* Dynamic Sky Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `linear-gradient(180deg, ${skyTheme.top} 0%, ${skyTheme.middle} 50%, ${skyTheme.bottom} 100%)`,
          zIndex: 0,
          willChange: 'background',
        }}
      />

      {/* Star Field - Visible only at night */}
      <StarField opacity={skyTheme.isNight ? Math.min((scrollProgress - 0.70) / 0.15, 1) : 0} />




      {/* Bubble Surge Transition */}
      <BubbleLayer
        scrollProgress={scrollProgress}
        isNavigating={isNavigating}
        targetIndex={navTarget}
        onAnimatingChange={(animating) => {
          stateRef.current.isScrollLocked = animating;
          setIsScrollLocked(animating);
          if (animating && navTarget === null) setActiveIndex(1);
          if (!animating && isScrollLocked) {
            setSurgeComplete(true);
            stateRef.current.surgeComplete = true;
            // After surge, we're in Bubbles territory — set index to 1
            setActiveIndex(1);
          }
        }}
      />

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} />

      {/* Logo - Top Left */}
      <div
        className="fixed z-[250]"
        style={{ top: '-95px', left: '10px', cursor: 'pointer' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Image
          src="/hems-logo.svg.png"
          alt="Hems"
          width={160}
          height={55}
          priority
          className="object-contain"
        />
      </div>

      {/* Glassmorphic Navbar */}
      <GlassmorphicNavbar
        items={sections}
        activeIndex={activeIndex}
        onNavigate={scrollToSection}
      />

      {/* Bubble Chat Button - Right */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          top: '24px',
          right: '28px',
          zIndex: 250,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontSize: '32px',
          lineHeight: 1,
          filter: isChatOpen
            ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))'
            : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
          transform: isChatOpen ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isChatOpen ? 'scale(1.1)' : 'scale(1)';
          e.currentTarget.style.filter = isChatOpen
            ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))'
            : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))';
        }}
      >
        🫧
      </button>

      {/* PAGE SECTIONS */}

      {/* Section 1: Who 'n What */}
      <section
        id="who-n-what"
        ref={(el) => { sectionRefs.current[0] = el; }}
        style={{
          minHeight: '200vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <HeroSection onNavigate={scrollToSection} />
      </section>

      {/* Section 2: Bubbles */}
      <section
        id="bubbles"
        ref={(el) => { sectionRefs.current[1] = el; }}
        style={{
          minHeight: '200vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <BubblesSection visible={surgeComplete} />
      </section>

      {/* Section 3: Social */}
      <section
        id="social"
        ref={(el) => { sectionRefs.current[2] = el; }}
        style={{
          minHeight: '150vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Content placeholder */}
      </section>

      {/* Section 4: Events */}
      <section
        id="events"
        ref={(el) => { sectionRefs.current[3] = el; }}
        style={{
          minHeight: '150vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Looping video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/videos/eventsbg-1.mp4" type="video/mp4" />
        </video>

        {/* Top fade: blends video into the black sky above */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25vh',
            background: 'linear-gradient(to bottom, #000000, transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom fade: clean exit */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '15vh',
            background: 'linear-gradient(to top, #000000, transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Content placeholder */}
        <div style={{ position: 'relative', zIndex: 2 }} />
      </section>
    </main>
  );
}
