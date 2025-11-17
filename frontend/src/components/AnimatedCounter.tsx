"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (hasAnimated) {
      setDisplayValue(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animate()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [hasAnimated, value])

  const animate = () => {
    const startTime = performance.now()
    const startValue = 0
    const endValue = value

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)

      const currentValue = startValue + (endValue - startValue) * eased
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animateFrame)
      } else {
        setDisplayValue(endValue)
      }
    }

    requestAnimationFrame(animateFrame)
  }

  const formatNumber = (num: number): string => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return Math.floor(num).toString()
  }

  const formattedValue = formatNumber(displayValue)

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

