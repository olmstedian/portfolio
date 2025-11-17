"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  showCursor?: boolean
}

export function TypewriterEffect({
  text,
  className,
  speed = 50,
  delay = 0,
  showCursor = true,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    const startTyping = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(startTyping, speed)
      } else {
        setIsTyping(false)
      }
    }

    const initialTimeout = setTimeout(() => {
      startTyping()
    }, delay)

    return () => {
      clearTimeout(initialTimeout)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, speed, delay])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span
          className={cn(
            "inline-block w-0.5 h-[1em] bg-primary ml-1 align-bottom",
            "animate-pulse",
            !isTyping && "opacity-0"
          )}
        />
      )}
    </span>
  )
}

