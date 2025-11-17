import { useEffect, useState } from "react"
import { supabase, Project } from "@/lib/supabase"
import { FALLBACK_PROJECTS } from "@/lib/projects-fallback"
import { ProjectCarousel } from "./ProjectCarousel"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-provider"
import { ParallaxSection } from "./ParallaxSection"

export function ProjectsSection() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Try to fetch from Supabase
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false })

        if (supabaseError) {
          throw supabaseError
        }

        if (data && data.length > 0) {
          // Transform data to match Project interface
          const transformedProjects = data.map(project => ({
            ...project,
            macos_window: project.macos_window ?? false,
          }))

          setProjects(transformedProjects)
          setUsingFallback(false)
        } else {
          // No data from Supabase, use fallback
          console.warn('No projects found in Supabase, using fallback data')
          setProjects(FALLBACK_PROJECTS.filter(p => p.active && p.featured))
          setUsingFallback(true)
        }
      } catch (err) {
        // Network errors, timeouts, or any other errors - use fallback
        console.warn('Failed to fetch from Supabase, using fallback data:', err)
        
        // Use fallback data instead of showing error
        const fallbackProjects = FALLBACK_PROJECTS.filter(p => p.active && p.featured)
        setProjects(fallbackProjects)
        setUsingFallback(true)
        setError(null) // Don't show error when using fallback
        
        // Log the actual error for debugging
        if (err instanceof Error) {
          console.error('Supabase error details:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
          })
        } else if (err && typeof err === 'object') {
          // Handle Supabase error objects
          const errorObj = err as { message?: string; details?: string; hint?: string; code?: string }
          console.error('Supabase error details:', {
            message: errorObj.message || 'Unknown error',
            details: errorObj.details,
            hint: errorObj.hint,
            code: errorObj.code,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t.projects.title}
            </h2>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t.projects.title}
            </h2>
            <p className="text-destructive">{t.projects.error}: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t.projects.title}
            </h2>
            <p className="text-muted-foreground">{t.projects.empty}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-12 md:py-16">
      {/* Background decoration with Parallax */}
      <div className="absolute inset-0 -z-10">
        <ParallaxSection speed={0.2} direction="up">
          <div className="absolute top-1/4 right-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
        </ParallaxSection>
        <ParallaxSection speed={0.25} direction="down">
          <div className="absolute bottom-1/4 left-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
        </ParallaxSection>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t.projects.title}
            </h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              {t.projects.subtitle}
            </p>
            {usingFallback && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                {t.projects.cached}
              </p>
            )}
          </div>

          <div className="min-h-0">
            <ProjectCarousel projects={projects} />
          </div>
        </div>
      </div>
    </section>
  )
}

