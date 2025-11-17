import { Code2, Database, Palette, Zap, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"

interface TechStackItem {
  name: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
}

const techStack: TechStackItem[] = [
  { name: "React", category: "Frontend", icon: Code2 },
  { name: "TypeScript", category: "Frontend", icon: Code2 },
  { name: "Vite", category: "Build Tool", icon: Zap },
  { name: "Tailwind CSS", category: "Styling", icon: Palette },
  { name: "shadcn/ui", category: "UI Components", icon: Palette },
  { name: "Supabase", category: "Backend", icon: Database },
  { name: "GitHub", category: "Hosting", icon: Github },
]

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-6">
          {/* Tech Stack Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                {t.footer.builtWith}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {techStack.map((tech, index) => {
                const Icon = tech.icon
                return (
                  <Badge
                    key={tech.name}
                    variant="secondary"
                    className={cn(
                      "text-xs px-3 py-1.5 gap-1.5",
                      "bg-background/60 border border-border/50",
                      "hover:bg-background/80 hover:border-primary/30",
                      "transition-all duration-200"
                    )}
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    <span>{tech.name}</span>
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Cüneyt Çakar. {t.footer.copyright}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {t.footer.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

