"use client"

import { useEffect, useRef, ReactNode, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CardTiltProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  intensity?: number
  perspective?: number
}

export function CardTilt({
  children,
  className,
  intensity = 15,
  perspective = 1000,
  ...props
}: CardTiltProps) {
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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = ((e.clientX - centerX) / rect.width) * intensity
      const deltaY = ((e.clientY - centerY) / rect.height) * -intensity

      element.style.transform = `perspective(${perspective}px) rotateY(${deltaX}deg) rotateX(${deltaY}deg) scale3d(1, 1, 1)`
    }

    const handleMouseLeave = () => {
      element.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`
    }

    const handleMouseEnter = () => {
      element.style.transition = "transform 0.1s ease-out"
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [intensity, perspective])

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

