"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CloudLayer from "@/components/ui/CloudLayer";
import StarField from "@/components/ui/StarField";

const sections = [
  { id: "who-n-what", label: "Who 'n What" },
  { id: "events", label: "Events" },
  { id: "bubbles", label: "Bubbles" },
  { id: "social", label: "Social" },
];

// Day to night color stops
const skyColors = {
  day: {
    top: '#2e8bc0',
    middle: '#45a5c4',
    bottom: '#7ec8e3',
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
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / docHeight, 1);

      setScrollProgress(progress);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate sun position (arc from left to right)
  const sunAngle = scrollProgress * Math.PI; // 0 to PI (180 degrees)
  const sunX = 10 + (80 * scrollProgress); // 10% to 90% from left
  const sunY = 80 - (Math.sin(sunAngle) * 60); // Arc: starts low, peaks at middle, ends low

  // Calculate sky colors based on scroll
  let topColor, middleColor, bottomColor;

  if (scrollProgress < 0.5) {
    // Day to Sunset (first half of scroll)
    const t = scrollProgress * 2;
    topColor = lerpColor(skyColors.day.top, skyColors.sunset.top, t);
    middleColor = lerpColor(skyColors.day.middle, skyColors.sunset.middle, t);
    bottomColor = lerpColor(skyColors.day.bottom, skyColors.sunset.bottom, t);
  } else {
    // Sunset to Night (second half of scroll)
    const t = (scrollProgress - 0.5) * 2;
    topColor = lerpColor(skyColors.sunset.top, skyColors.night.top, t);
    middleColor = lerpColor(skyColors.sunset.middle, skyColors.night.middle, t);
    bottomColor = lerpColor(skyColors.sunset.bottom, skyColors.night.bottom, t);
  }

  // Sun color and glow based on time of day
  const sunColor = scrollProgress < 0.3
    ? '#FFD700'
    : scrollProgress < 0.7
      ? lerpColor('#FFD700', '#FF4500', (scrollProgress - 0.3) / 0.4)
      : lerpColor('#FF4500', '#8B0000', (scrollProgress - 0.7) / 0.3);

  const sunOpacity = scrollProgress > 0.85 ? 1 - ((scrollProgress - 0.85) / 0.15) : 1;
  const isNight = scrollProgress > 0.7; // Start fading in stars in the last 30% of scroll

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
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
          background: `linear-gradient(180deg, ${topColor} 0%, ${middleColor} 50%, ${bottomColor} 100%)`,
          transition: 'background 0.1s ease',
          zIndex: 0,
        }}
      />

      {/* Star Field - Visible only at night */}
      <StarField opacity={isNight ? (scrollProgress - 0.7) / 0.3 : 0} />

      {/* Sun */}
      <div
        style={{
          position: 'fixed',
          left: `${sunX}%`,
          top: `${sunY}%`,
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${sunColor} 0%, ${sunColor}88 40%, transparent 70%)`,
          boxShadow: `
            0 0 60px ${sunColor}80,
            0 0 120px ${sunColor}40,
            0 0 200px ${sunColor}20
          `,
          opacity: sunOpacity,
          transition: 'opacity 0.3s ease',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Sun rays */}
      <div
        style={{
          position: 'fixed',
          left: `${sunX}%`,
          top: `${sunY}%`,
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${sunColor}20 0%, transparent 60%)`,
          opacity: sunOpacity * 0.5,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Cloud Layer */}
      <CloudLayer />

      {/* Logo - Top Left */}
      <div className="fixed z-50" style={{ top: '-105px', left: '10px' }}>
        <Image
          src="/hems-logo.svg.png"
          alt="Hems"
          width={190}
          height={77}
          priority
          className="object-contain"
        />
      </div>

      {/* Main Glass Navbar - Center Top */}
      <nav
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: scrollProgress > 0.5
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '12px 40px',
          border: scrollProgress > 0.5
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          {sections.map((section, index) => (
            <span
              key={section.id}
              onClick={() => scrollToSection(index)}
              className={activeIndex === index ? 'active-nav-item' : ''}
              style={{
                position: 'relative',
                fontFamily: "var(--font-bungee), sans-serif",
                color: activeIndex === index ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                fontWeight: activeIndex === index ? 500 : 400,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginLeft: index === 0 ? '-5px' : '0',
                padding: '8px 16px',
                borderRadius: '25px',
              }}
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
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 100,
          background: scrollProgress > 0.5
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '12px 20px',
          border: scrollProgress > 0.5
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <span style={{
          fontFamily: "var(--font-bungee), sans-serif",
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px'
        }}>
          ↓
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '48px',
            fontWeight: 300,
            color: 'white',
            letterSpacing: '2px',
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Who &apos;n What
          </h1>
          <p style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            lineHeight: 1.8,
          }}>
            Scroll down to watch the sun set
          </p>
        </div>
      </section>

      {/* Section 2: Events */}
      <section
        id="events"
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '48px',
            fontWeight: 300,
            color: 'white',
            letterSpacing: '2px',
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Events
          </h1>
          <p style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            lineHeight: 1.8,
          }}>
            Golden hour approaches
          </p>
        </div>
      </section>

      {/* Section 3: Bubbles */}
      <section
        id="bubbles"
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '48px',
            fontWeight: 300,
            color: 'white',
            letterSpacing: '2px',
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Bubbles
          </h1>
          <p style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            lineHeight: 1.8,
          }}>
            Sunset paints the sky
          </p>
        </div>
      </section>

      {/* Section 4: Social */}
      <section
        id="social"
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '48px',
            fontWeight: 300,
            color: 'white',
            letterSpacing: '2px',
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Social
          </h1>
          <p style={{
            fontFamily: "var(--font-bungee), sans-serif",
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            lineHeight: 1.8,
          }}>
            Night falls gently
          </p>
        </div>
      </section>
    </main>
  );
}
