import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"
import type { Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const nextLanguage = language === "en" ? "tr" : "en"
    setLanguage(nextLanguage)
  }

  const currentLang = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className={cn(
        "relative h-9 w-9 rounded-md transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Switch to ${language === "en" ? "Turkish" : "English"}`}
      title={currentLang.nativeLabel}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">{currentLang.nativeLabel}</span>
    </Button>
  )
}

