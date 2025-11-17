"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  label: string
  value: number
  max?: number
  showLabel?: boolean
  showPercentage?: boolean
  className?: string
  barClassName?: string
  labelClassName?: string
  animated?: boolean
  duration?: number
}

export function ProgressBar({
  label,
  value,
  max = 100,
  showLabel = true,
  showPercentage = true,
  className,
  barClassName,
  labelClassName,
  animated = true,
  duration = 2000,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated || hasAnimated) {
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
  }, [animated, hasAnimated, value, duration])

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

  const percentage = Math.min((displayValue / max) * 100, 100)

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-medium", labelClassName)}>
            {label}
          </span>
          {showPercentage && (
            <span className={cn("text-sm font-medium text-muted-foreground", labelClassName)}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out",
            barClassName
          )}
          style={{
            width: `${percentage}%`,
            transition: hasAnimated
              ? "width 0.3s ease-out"
              : "none",
          }}
        />
      </div>
    </div>
  )
}

