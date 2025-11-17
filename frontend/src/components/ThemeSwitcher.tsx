import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (theme === "system") {
      return actualTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
    }
    return theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
  }

  const getLabel = () => {
    if (theme === "system") {
      return `System (${actualTheme === "dark" ? "Dark" : "Light"})`
    }
    return theme === "dark" ? "Dark" : "Light"
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-md transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} theme`}
      title={getLabel()}
    >
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200">
        {getIcon()}
      </div>
      <span className="sr-only">{getLabel()}</span>
    </Button>
  )
}

