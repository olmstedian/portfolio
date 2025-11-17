import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"

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
  const { t } = useLanguage()
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
      <div className={cn("relative w-full max-h-[85vh] flex flex-col", className)}>
        <div className="relative flex items-center gap-2 md:gap-4 flex-1 min-h-0">
          <Button
            variant="outline"
            className={cn(
              "absolute left-0 z-10 h-11 px-3 md:px-4 rounded-full",
              "bg-background/90 backdrop-blur-md border-2 border-border/50",
              "shadow-lg hover:shadow-xl",
              "hover:bg-primary/10 hover:border-primary/50",
              "hover:scale-105 active:scale-95",
              "transition-all duration-300",
              "group/button flex items-center gap-2",
              "md:relative md:left-auto flex-shrink-0",
              currentIndex === 0 && "opacity-40 cursor-not-allowed hover:scale-100 hover:bg-background/90"
            )}
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label={t.carousel.previousSlide}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 md:h-5 md:w-5 transition-all duration-300 flex-shrink-0",
              "group-hover/button:translate-x-[-2px]",
              currentIndex === 0 && "group-hover/button:translate-x-0"
            )} />
            <span className="hidden md:inline-block text-sm font-medium">{t.carousel.previous}</span>
          </Button>

          <div
            ref={containerRef}
            className="flex-1 overflow-hidden min-h-0 h-full"
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

          <Button
            variant="outline"
            className={cn(
              "absolute right-0 z-10 h-11 px-3 md:px-4 rounded-full",
              "bg-background/90 backdrop-blur-md border-2 border-border/50",
              "shadow-lg hover:shadow-xl",
              "hover:bg-primary/10 hover:border-primary/50",
              "hover:scale-105 active:scale-95",
              "transition-all duration-300",
              "group/button flex items-center gap-2",
              "md:relative md:right-auto flex-shrink-0",
              currentIndex === totalSlides - 1 && "opacity-40 cursor-not-allowed hover:scale-100 hover:bg-background/90"
            )}
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            aria-label={t.carousel.nextSlide}
          >
            <span className="hidden md:inline-block text-sm font-medium">{t.carousel.next}</span>
            <ChevronRight className={cn(
              "h-4 w-4 md:h-5 md:w-5 transition-all duration-300 flex-shrink-0",
              "group-hover/button:translate-x-[2px]",
              currentIndex === totalSlides - 1 && "group-hover/button:translate-x-0"
            )} />
          </Button>
        </div>

        <CarouselIndicators />
      </div>
    </CarouselContext.Provider>
  )
}

const CarouselIndicators = () => {
  const { t } = useLanguage()
  const context = React.useContext(CarouselContext)
  if (!context) return null

  const { currentIndex, totalSlides, goToSlide } = context

  return (
    <div className="mt-4 md:mt-6 flex justify-center gap-2 flex-shrink-0">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={cn(
            "h-2.5 rounded-full transition-all duration-300",
            "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
            currentIndex === index
              ? "w-10 bg-primary shadow-lg shadow-primary/50"
              : "w-2.5 bg-muted/60 hover:bg-primary/50 hover:w-3"
          )}
          aria-label={`${t.carousel.goToSlide} ${index + 1}`}
        />
      ))}
    </div>
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

