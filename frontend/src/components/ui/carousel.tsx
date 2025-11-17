import * as React from "react"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: React.ReactNode
  className?: string
}

interface CarouselContextValue {
  currentIndex: number
  totalSlides: number
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
}

const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined)

export const Carousel = ({ children, className }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const totalSlides = React.Children.count(children)

  const goToSlide = React.useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index)
    }
  }, [totalSlides])

  const nextSlide = React.useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  const prevSlide = React.useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  // Update position on index change
  React.useEffect(() => {
    if (!trackRef.current || !containerRef.current) return
    
    // Get the first item to calculate width including margins
    const firstItem = trackRef.current.querySelector('[class*="basis"]')
    if (!firstItem) return
    
    const itemWidth = firstItem.getBoundingClientRect().width
    const trackStyle = window.getComputedStyle(trackRef.current)
    const gap = parseFloat(trackStyle.gap) || 24
    const translateX = -(currentIndex * (itemWidth + gap))
    
    trackRef.current.style.transform = `translateX(${translateX}px)`
  }, [currentIndex, totalSlides])

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (!trackRef.current || !containerRef.current) return
      
      const firstItem = trackRef.current.querySelector('[class*="basis"]')
      if (!firstItem) return
      
      const itemWidth = firstItem.getBoundingClientRect().width
      const trackStyle = window.getComputedStyle(trackRef.current)
      const gap = parseFloat(trackStyle.gap) || 24
      const translateX = -(currentIndex * (itemWidth + gap))
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${translateX}px)`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex])

  // Touch/swipe support
  const touchStartX = React.useRef(0)
  const touchEndX = React.useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    handleSwipe()
  }

  const handleSwipe = () => {
    const swipeThreshold = 50
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentIndex < totalSlides - 1) {
        nextSlide()
      } else if (diff < 0 && currentIndex > 0) {
        prevSlide()
      }
    }
  }

  const value: CarouselContextValue = {
    currentIndex,
    totalSlides,
    goToSlide,
    nextSlide,
    prevSlide,
  }

  return (
    <CarouselContext.Provider value={value}>
      <div className={cn("relative w-full h-full", className)}>
        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 transition-transform duration-500 ease-out h-full items-stretch"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {children}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}


export const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel")
  }
  return context
}

// Export CarouselItem
export { CarouselItem } from "./carousel-item"

