"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import CloudLayer from "@/components/ui/CloudLayer";
import StarField from "@/components/ui/StarField";
import BubbleLayer from "@/components/ui/BubbleLayer";
import ChatWindow from "@/components/ui/ChatWindow";

const sections = [
  { id: "who-n-what", label: "Who 'n What" },
  { id: "bubbles", label: "Bubbles" },
  { id: "social", label: "Social" },
  { id: "events", label: "Events" },
];

// Day to night color stops
const skyColors = {
  day: {
    top: '#2e8bc0',
    middle: '#45a5c4',
    bottom: '#7ec8e3',
  },
  bubblesDeep: {
    top: '#1a1a1a', // Blackish grey
    middle: '#2a2a2a',
    bottom: '#1a1a1a',
  },
  sunset: {
    top: '#1a1a4e',
    middle: '#ff6b6b',
    bottom: '#feca57',
  },
  night: {
    top: '#0a0a1a',
    middle: '#1a1a3e',
    bottom: '#2a2a5e',
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

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Force scroll to top on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Toggle body scroll lock
  useEffect(() => {
    if (isScrollLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.scrollbarGutter = 'stable';
    } else {
      document.body.style.overflow = '';
      document.body.style.scrollbarGutter = '';
    }
  }, [isScrollLocked]);
  // High-performance tracking
  const stateRef = useRef({
    lastProgress: 0,
    isNavigating: false,
    lastNavTime: 0,
    isScrollLocked: false // Synchronous lock for the scroll handler
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

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sectionRefs.current[i];
            if (section && section.offsetTop <= scrollPosition) {
              setActiveIndex((prev) => (prev !== i ? i : prev)); // Only update if changed
              break;
            }
          }
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
  }, [activeIndex]); // Re-bind if sections change, though they are static here

  // Sun calculations and Colors memoized
  const skyTheme = useMemo(() => {
    let top, middle, bottom;

    if (scrollProgress < 0.15) {
      top = skyColors.day.top;
      middle = skyColors.day.middle;
      bottom = skyColors.day.bottom;
    } else if (scrollProgress < 0.25) {
      const t = (scrollProgress - 0.15) / 0.10;
      top = lerpColor(skyColors.day.top, skyColors.bubblesDeep.top, t);
      middle = lerpColor(skyColors.day.middle, skyColors.bubblesDeep.middle, t);
      bottom = lerpColor(skyColors.day.bottom, skyColors.bubblesDeep.bottom, t);
    } else if (scrollProgress < 0.40) {
      top = skyColors.bubblesDeep.top;
      middle = skyColors.bubblesDeep.middle;
      bottom = skyColors.bubblesDeep.bottom;
    } else if (scrollProgress < 0.50) {
      const t = (scrollProgress - 0.40) / 0.10;
      top = lerpColor(skyColors.bubblesDeep.top, skyColors.sunset.top, t);
      middle = lerpColor(skyColors.bubblesDeep.middle, skyColors.sunset.middle, t);
      bottom = lerpColor(skyColors.bubblesDeep.bottom, skyColors.sunset.bottom, t);
    } else if (scrollProgress < 0.75) {
      top = skyColors.sunset.top;
      middle = skyColors.sunset.middle;
      bottom = skyColors.sunset.bottom;
    } else {
      const t = (scrollProgress - 0.75) / 0.25;
      top = lerpColor(skyColors.sunset.top, skyColors.night.top, t);
      middle = lerpColor(skyColors.sunset.middle, skyColors.night.middle, t);
      bottom = lerpColor(skyColors.sunset.bottom, skyColors.night.bottom, t);
    }

    const sunAngle = scrollProgress * Math.PI;
    const sunX = 10 + (80 * scrollProgress);
    const sunY = 80 - (Math.sin(sunAngle) * 60);

    const sunColor = scrollProgress < 0.3
      ? '#FFD700'
      : scrollProgress < 0.7
        ? lerpColor('#FFD700', '#FF4500', (scrollProgress - 0.3) / 0.4)
        : lerpColor('#FF4500', '#8B0000', (scrollProgress - 0.7) / 0.3);

    const sunOpacity = scrollProgress > 0.85 ? 1 - ((scrollProgress - 0.85) / 0.15) : 1;
    const isNight = scrollProgress > 0.7;

    return { top, middle, bottom, sunX, sunY, sunColor, sunOpacity, isNight };
  }, [scrollProgress]);

  const scrollToSection = (index: number) => {
    setActiveIndex(index); // Instant feedback
    const section = sectionRefs.current[index];
    if (section) {
      // If jumping to any section other than the current one, suppress surge
      if (index !== activeIndex) {
        stateRef.current.lastNavTime = Date.now();
        stateRef.current.isNavigating = true;
        setNavTarget(index);
        setIsNavigating(true);
      }
      section.scrollIntoView({ behavior: 'smooth' });
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
      <StarField opacity={skyTheme.isNight ? (scrollProgress - 0.7) / 0.3 : 0} />



      {/* Floating Cloud Layer */}
      <CloudLayer scrollProgress={scrollProgress} />

      {/* Bubble Surge Transition */}
      <BubbleLayer
        scrollProgress={scrollProgress}
        isNavigating={isNavigating}
        targetIndex={navTarget}
        onAnimatingChange={(animating) => {
          stateRef.current.isScrollLocked = animating;
          setIsScrollLocked(animating);
          if (animating) setActiveIndex(1);
        }}
      />

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} />

      {/* Logo - Top Left */}
      <div className="fixed z-50" style={{ top: '-95px', left: '10px' }}>
        <Image
          src="/hems-logo.svg.png"
          alt="Hems"
          width={160}
          height={55}
          priority
          className="object-contain"
        />
      </div>

      {/* Main Glass Navbar - Center Top */}
      <nav
        className="navbar-capsule"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: scrollProgress > 0.5
            ? 'rgba(10, 20, 40, 0.4)'
            : 'rgba(20, 40, 80, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '8px 36px',
          border: scrollProgress > 0.5
            ? '1px solid rgba(100, 150, 255, 0.2)'
            : '1px solid rgba(150, 200, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 20, 60, 0.2)',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          {sections.map((section, index) => (
            <span
              key={section.id}
              onClick={() => scrollToSection(index)}
              className={`glitch-text ${activeIndex === index ? 'active-nav-item' : ''}`}
              style={{
                position: 'relative',
                fontFamily: "var(--font-audiowide), sans-serif",
                color: activeIndex === index ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '1px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'color 0.3s ease',
                padding: '8px 16px',
                borderRadius: '25px',
                ['--glitch-delay' as string]: `${index * 0.25}s`,
              } as React.CSSProperties}
            >
              {activeIndex === index && (
                <>
                  <span className="wind-particle wind-1" />
                  <span className="wind-particle wind-2" />
                  <span className="wind-particle wind-3" />
                  <span className="wind-particle wind-4" />
                  <span className="wind-particle wind-5" />
                  <span className="wind-particle wind-6" />
                  <span className="wind-glow" />
                </>
              )}
              {section.label}
            </span>
          ))}
        </div>
      </nav>

      {/* Small Glass Bar - Right */}
      <div
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 100,
          background: (scrollProgress > 0.5 || isChatOpen)
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '12px 20px',
          border: (scrollProgress > 0.5 || isChatOpen)
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: "var(--font-rowdies), sans-serif",
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '20px', // Increased size for emoji visibility
          lineHeight: 1,
          userSelect: 'none',
        }}>
          🫧
        </span>
      </div>

      {/* PAGE SECTIONS */}

      {/* Section 1: Who 'n What */}
      <section
        id="who-n-what"
        ref={(el) => { sectionRefs.current[0] = el; }}
        style={{
          minHeight: '150vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '100px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Content placeholder */}
      </section>

      {/* Section 2: Bubbles */}
      <section
        id="bubbles"
        ref={(el) => { sectionRefs.current[1] = el; }}
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
        }}
      >
        {/* Content placeholder */}
      </section>
    </main>
  );
}
