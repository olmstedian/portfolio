import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "light" | "dark"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Add transition class for smooth theme change
    if (!prefersReducedMotion) {
      root.style.transition = "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease"
    }

    root.classList.remove("light", "dark")

    let resolvedTheme: "light" | "dark"

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      resolvedTheme = systemTheme
    } else {
      resolvedTheme = theme
    }

    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)

    // Remove transition after animation completes
    if (!prefersReducedMotion) {
      setTimeout(() => {
        root.style.transition = ""
      }, 500)
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches

        if (!prefersReducedMotion) {
          root.style.transition = "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease"
        }

        root.classList.remove("light", "dark")
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        root.classList.add(systemTheme)
        setActualTheme(systemTheme)

        if (!prefersReducedMotion) {
          setTimeout(() => {
            root.style.transition = ""
          }, 500)
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    },
    actualTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

