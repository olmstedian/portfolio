import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Language, translations } from "./i18n"

interface LanguageProviderProps {
  children: ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

interface LanguageProviderState {
  language: Language
  setLanguage: (language: Language) => void
  t: typeof translations.en
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: translations.en,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "portfolio-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return defaultLanguage
    
    try {
      const stored = localStorage.getItem(storageKey) as Language | null
      if (stored && (stored === "en" || stored === "tr")) {
        return stored
      }
      
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("tr")) {
        return "tr"
      }
      
      return defaultLanguage
    } catch {
      return defaultLanguage
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, language)
      document.documentElement.lang = language
    } catch (error) {
      console.warn("Failed to save language preference", error)
    }
  }, [language, storageKey])

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      setLanguageState(newLanguage)
    },
    t: translations[language],
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}

