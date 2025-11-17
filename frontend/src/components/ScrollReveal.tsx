"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  )
}

