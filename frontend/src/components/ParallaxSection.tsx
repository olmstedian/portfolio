"use client"

import { useEffect, useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down"
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      return
    }

    let ticking = false

    const updateParallax = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate if element is in viewport
      if (elementTop + elementHeight < 0 || elementTop > windowHeight) {
        ticking = false
        return
      }

      // Calculate scroll progress (0 when element enters, 1 when it exits)
      const scrollProgress =
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))

      // Apply transform
      const translateY = (clampedProgress - 0.5) * speed * 100
      const finalTranslate = direction === "up" ? -translateY : translateY

      element.style.transform = `translateY(${finalTranslate}px)`
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    // Initial update
    updateParallax()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateParallax)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateParallax)
    }
  }, [speed, direction])

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  )
}

