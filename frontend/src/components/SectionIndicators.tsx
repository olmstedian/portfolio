"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const sections = ["home", "about", "projects", "github", "contact"]

export function SectionIndicators() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={cn(
              "relative group",
              "transition-all duration-300"
            )}
            aria-label={`Go to ${section} section`}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full bg-muted-foreground/30 transition-all duration-300",
                "group-hover:bg-primary group-hover:scale-150",
                activeSection === section && "bg-primary scale-125"
              )}
            />
            <span
              className={cn(
                "absolute right-6 top-1/2 -translate-y-1/2",
                "text-xs font-medium text-muted-foreground opacity-0",
                "group-hover:opacity-100 transition-opacity duration-300",
                "whitespace-nowrap pr-2"
              )}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

