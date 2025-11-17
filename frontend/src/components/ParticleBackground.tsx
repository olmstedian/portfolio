"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  particleColor?: string
  lineColor?: string
  lineDistance?: number
  speed?: number
  interactive?: boolean
}

export function ParticleBackground({
  className,
  particleCount = 50,
  particleColor = "rgba(59, 130, 246, 0.5)",
  lineColor = "rgba(59, 130, 246, 0.2)",
  lineDistance = 120,
  speed = 0.5,
  interactive = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const initializedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      return
    }

    // Set canvas size (initial and on resize)
    const updateDimensions = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Reset particles on resize if already initialized
      if (initializedRef.current && particlesRef.current.length > 0) {
        particlesRef.current.forEach(particle => {
          // Wrap particles if they're out of bounds
          if (particle.x > canvas.width) particle.x = canvas.width
          if (particle.y > canvas.height) particle.y = canvas.height
        })
      }
    }

    // Initialize particles only once
    if (!initializedRef.current) {
      updateDimensions()
      
      const particles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + 1,
        })
      }

      particlesRef.current = particles
      initializedRef.current = true
    }

    // Handle resize separately
    window.addEventListener("resize", updateDimensions)

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const force = (100 - distance) / 100
            particle.vx -= (dx / distance) * force * 0.02
            particle.vy -= (dy / distance) * force * 0.02
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Draw lines to nearby particles
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < lineDistance) {
            const opacity = (1 - distance / lineDistance) * 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = lineColor.replace("0.2", opacity.toString())
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateDimensions)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particleCount, particleColor, lineColor, lineDistance, speed, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  )
}

