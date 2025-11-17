import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { Project } from "@/lib/supabase"
import { Github, ExternalLink, Shield, Lock, Construction } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"
import { CardTilt } from "./CardTilt"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage()
  const developmentInfo = project.development_status || project.development_timeline

  // Translate development status labels
  const getDevelopmentStatus = () => {
    if (project.development_status) {
      const statusMap: Record<string, string> = {
        'Under Development': t.projects.underDevelopment,
        'Active Development': t.projects.activeDevelopment,
        'Classified Development': t.projects.classifiedDevelopment,
      }
      return statusMap[project.development_status] || project.development_status
    }
    if (project.development_timeline === 'Ongoing') {
      return t.projects.ongoing
    }
    return project.development_timeline || ''
  }

  // Get translation key - use display_order for Supabase projects (which have UUIDs as id)
  // or use id directly for fallback projects (which have simple string ids like "1", "2")
  const translationKey = project.display_order?.toString() || project.id
  
  // Get translated project title and description
  const projectTranslations = t.projects.items[translationKey]
  const displayTitle = projectTranslations?.title || project.title
  const displayDescription = projectTranslations?.description || project.description
  const displayRoles = projectTranslations?.roles || project.roles
  
  // Get translated technologies
  const displayTechnologies = projectTranslations?.technologies || 
    project.technologies.map(tech => t.projects.technologies[tech] || tech)

  return (
    <CardTilt intensity={10} perspective={1200}>
      <Card className={cn(
        "group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full max-h-[85vh]",
        "bg-card/50 backdrop-blur-sm border-border/50",
        project.macos_window && "border-t-4 border-t-primary"
      )}>
      {/* macOS Window Titlebar */}
      {project.macos_window && (
        <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center text-xs font-medium text-muted-foreground truncate px-2">
            {displayTitle}
          </div>
          <div className="w-10" />
        </div>
      )}

      {/* Image Gallery */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
        {project.images && project.images.length > 0 ? (
          <Carousel className="h-full w-full">
            {project.images.map((img, index) => (
              <CarouselItem key={index} className="basis-full">
                <img
                  src={img}
                  alt={`${displayTitle} - Screenshot ${index + 1}`}
                  className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </CarouselItem>
            ))}
          </Carousel>
        ) : (
          <img
            src={project.image}
            alt={displayTitle}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        
        {/* Badges Overlay */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
          {project.featured && (
            <Badge variant="featured" className="shadow-lg text-xs px-2 py-0.5">
              ✨ {t.projects.featured}
            </Badge>
          )}
          {project.classification && (
            <Badge variant="classified" className="shadow-lg text-xs px-2 py-0.5">
              <Shield className="mr-1 h-2.5 w-2.5" />
              {project.classification.toUpperCase()}
            </Badge>
          )}
          {project.confidential && (
            <Badge variant="confidential" className="shadow-lg text-xs px-2 py-0.5">
              <Lock className="mr-1 h-2.5 w-2.5" />
              {t.projects.confidential}
            </Badge>
          )}
          {developmentInfo && (
            <Badge variant="development" className="shadow-lg text-xs px-2 py-0.5">
              <Construction className="mr-1 h-2.5 w-2.5" />
              {getDevelopmentStatus()}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="space-y-2 p-4 flex-shrink-0">
        <CardTitle className="text-xl md:text-2xl line-clamp-1">
          {displayTitle}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-2">
          {displayDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-0 flex-1 min-h-0 overflow-y-auto">
        {/* Roles Section */}
        {displayRoles && Array.isArray(displayRoles) && displayRoles.length > 0 && (
          <div className="rounded-lg border-l-2 border-primary bg-primary/5 p-2.5">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">
              {t.projects.myRole}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {displayRoles.map((role, index) => (
                <Badge key={index} variant="default" className="text-xs px-2 py-0.5">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {displayTechnologies.slice(0, 8).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tech}
              </Badge>
            ))}
            {displayTechnologies.length > 8 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{displayTechnologies.length - 8} {t.projects.more}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2.5 p-4 pt-2 flex-shrink-0">
        {project.github && (
          <Button
            variant="default"
            size="sm"
            className={cn(
              "flex-1 gap-2 text-xs md:text-sm font-medium",
              "bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200",
              "text-white dark:text-slate-900",
              "hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-200 dark:hover:to-slate-300",
              "shadow-md hover:shadow-lg",
              "hover:scale-105 active:scale-95",
              "transition-all duration-300",
              "group/button border-0"
            )}
            asChild
          >
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <Github className={cn(
                "h-4 w-4 transition-transform duration-300",
                "group-hover/button:rotate-12"
              )} />
              <span>{t.projects.github}</span>
            </a>
          </Button>
        )}
        {project.demo && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 gap-2 text-xs md:text-sm font-medium",
              "bg-background/50 backdrop-blur-sm",
              "border-2 border-primary/30",
              "hover:bg-primary/10 hover:border-primary/60",
              "hover:text-primary",
              "shadow-sm hover:shadow-md",
              "hover:scale-105 active:scale-95",
              "transition-all duration-300",
              "group/button"
            )}
            asChild
          >
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <ExternalLink className={cn(
                "h-4 w-4 transition-transform duration-300",
                "group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
              )} />
              <span>{t.projects.liveDemo}</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
    </CardTilt>
  )
}

