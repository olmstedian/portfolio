import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Code, 
  Palette, 
  Rocket,
  Cpu,
  Database,
  Globe,
  Terminal,
  User,
  Award,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"
import { ScrollReveal } from "./ScrollReveal"
import { ParallaxSection } from "./ParallaxSection"
import { ProgressBar } from "./ProgressBar"

interface Skill {
  title: string
  description: string
  technologies: string[]
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  iconColor: string
  proficiency?: number
}

export function AboutSection() {
  const { t } = useLanguage()
  
  const skills: Skill[] = [
    {
      title: t.about.electronics.title,
      description: t.about.electronics.description,
      technologies: ["RF Design", "SIGINT", "DSP", "FPGA", "Embedded Systems"],
      icon: Zap,
      gradient: "from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      proficiency: 90
    },
    {
      title: t.about.backend.title,
      description: t.about.backend.description,
      technologies: ["Node.js", "Python", "Nest.js", "PostgreSQL", "Supabase", "Firebase"],
      icon: Code,
      gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      proficiency: 85
    },
    {
      title: t.about.frontend.title,
      description: t.about.frontend.description,
      technologies: ["React", "TypeScript", "Vue.js", "Spexop UI", "Tailwind CSS"],
      icon: Palette,
      gradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      proficiency: 88
    },
    {
      title: t.about.devops.title,
      description: t.about.devops.description,
      technologies: ["AWS", "Docker", "Linux", "CI/CD", "Kubernetes"],
      icon: Rocket,
      gradient: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      proficiency: 80
    },
  ]
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-28">
      {/* Background decoration with Parallax */}
      <div className="absolute inset-0 -z-10">
        <ParallaxSection speed={0.2} direction="up">
          <div className="absolute top-0 right-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
        </ParallaxSection>
        <ParallaxSection speed={0.25} direction="down">
          <div className="absolute bottom-0 left-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
        </ParallaxSection>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl space-y-16">
          {/* Header */}
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
                <User className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t.about.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t.about.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* Left Column - Story & Background */}
            <div className="space-y-6">
              <ScrollReveal direction="right" delay={200}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t.about.journey}</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t.about.journeyDesc}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.about.journeyDesc2}
                  </p>
                </CardContent>
                </Card>
              </ScrollReveal>

              {/* Expertise Highlights */}
              <ScrollReveal direction="right" delay={400}>
                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t.about.expertise}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Cpu className="h-4 w-4 text-primary" />
                        {t.about.hardwareDesign}
                      </div>
                      <p className="text-xs text-muted-foreground">RF & Signal Processing</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Database className="h-4 w-4 text-primary" />
                        {t.about.dataSystems}
                      </div>
                      <p className="text-xs text-muted-foreground">Scalable Backends</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4 text-primary" />
                        {t.about.webApps}
                      </div>
                      <p className="text-xs text-muted-foreground">Modern Frontends</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Terminal className="h-4 w-4 text-primary" />
                        {t.about.infrastructure}
                      </div>
                      <p className="text-xs text-muted-foreground">Cloud & DevOps</p>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Right Column - Skills */}
            <div className="space-y-6">
              <ScrollReveal direction="left" delay={200}>
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="h-1 w-12 bg-primary rounded-full" />
                    {t.about.skills}
                  </h3>
                  <div className="grid gap-4">
                  {skills.map((skill, index) => {
                    const Icon = skill.icon
                    return (
                      <Card
                        key={index}
                        className={cn(
                          "group relative overflow-hidden border-0 transition-all duration-300",
                          "hover:shadow-xl hover:-translate-y-1",
                          `bg-gradient-to-br ${skill.gradient}`,
                          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
                          "hover:before:opacity-100 dark:before:from-white/5"
                        )}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 flex-shrink-0",
                              "bg-background/80 backdrop-blur-sm border border-border/50",
                              "group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/50"
                            )}>
                              <Icon className={cn("h-6 w-6 transition-colors duration-300", skill.iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                                {skill.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                {skill.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {skill.technologies.map((tech, techIndex) => (
                                  <Badge
                                    key={techIndex}
                                    variant="secondary"
                                    className="text-xs font-medium"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              {skill.proficiency !== undefined && (
                                <ProgressBar
                                  label="Proficiency"
                                  value={skill.proficiency}
                                  max={100}
                                  showLabel={false}
                                  showPercentage={false}
                                  animated={true}
                                  duration={1500}
                                  className="mt-2"
                                  barClassName="bg-gradient-to-r from-primary to-primary/80"
                                />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {/* Hover indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </Card>
                    )
                  })}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

