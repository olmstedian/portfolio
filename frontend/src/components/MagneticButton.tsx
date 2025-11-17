"use client"

import { useEffect, useRef, ReactNode, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15

      const transform = `translate(${currentX}px, ${currentY}px)`
      element.style.transform = transform

      if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01) {
        requestAnimationFrame(updatePosition)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      targetX = deltaX
      targetY = deltaY

      updatePosition()
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      updatePosition()
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength])

  return (
    <div
      ref={ref}
      className={cn("inline-block transition-transform duration-200 ease-out", className)}
      {...props}
    >
      {children}
    </div>
  )
}

