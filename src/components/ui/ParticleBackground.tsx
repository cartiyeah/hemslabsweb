"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const accentColors = ["#34D399", "#F472B6", "#FB7185", "#4ADE80", "#A78BFA"]

interface ParticleBackgroundProps {
  particleCount?: number
  interactionRadius?: number
  className?: string
}

export default function ParticleBackground({
  particleCount = 250,
  interactionRadius = 300,
  className = "",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const scrollYRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      initParticles(rect.width, rect.height)
    }

    const initParticles = (width: number, height: number) => {
      particlesRef.current = []
      // Grid-based placement for uniform coverage with random jitter
      const cols = Math.ceil(Math.sqrt(particleCount * (width / height)))
      const rows = Math.ceil(particleCount / cols)
      const cellW = width / cols
      const cellH = height / rows
      let count = 0
      for (let row = 0; row < rows && count < particleCount; row++) {
        for (let col = 0; col < cols && count < particleCount; col++) {
          const x = col * cellW + Math.random() * cellW
          const y = row * cellH + Math.random() * cellH
          particlesRef.current.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 4 + 2.5,
            opacity: Math.random() * 0.3 + 0.55,
            color: accentColors[Math.floor(Math.random() * accentColors.length)],
          })
          count++
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
    }

    const animate = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius
          const angle = Math.atan2(dy, dx)
          particle.vx -= Math.cos(angle) * force * 0.5
          particle.vy -= Math.sin(angle) * force * 0.5
        }

        particle.vx += (particle.baseX - particle.x) * 0.01
        particle.vy += (particle.baseY - particle.y) * 0.01

        particle.vx *= 0.95
        particle.vy *= 0.95

        particle.x += particle.vx
        particle.y += particle.vy

        const scrollInfluence = Math.sin(scrollYRef.current * 0.01 + particle.baseX * 0.01) * 2
        particle.y += scrollInfluence * 0.1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connection lines between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = p1.color
            ctx.globalAlpha = (1 - distance / 100) * 0.2
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, interactionRadius])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
