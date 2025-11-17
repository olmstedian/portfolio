import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-provider"
import { TypewriterEffect } from "./TypewriterEffect"
import { ScrollReveal } from "./ScrollReveal"
import { MagneticButton } from "./MagneticButton"
import { ParallaxSection } from "./ParallaxSection"
import { ParticleBackground } from "./ParticleBackground"

export function Hero() {
  const { t } = useLanguage()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Particle Background */}
      <ParticleBackground
        particleCount={40}
        particleColor="rgba(59, 130, 246, 0.4)"
        lineColor="rgba(59, 130, 246, 0.15)"
        lineDistance={100}
        speed={0.3}
        interactive={true}
        className="opacity-60 dark:opacity-40"
      />
      
      {/* Animated Liquid Blobs with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 */}
        <ParallaxSection speed={0.3} direction="up">
          <div 
            className="absolute top-1/4 left-1/4 w-[200px] h-[200px] blur-[1px] mix-blend-multiply dark:mix-blend-screen animate-blob1"
            style={{
              background: isDark
                ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.2))'
                : 'linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(147, 197, 253, 0.4))',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
            }}
          />
        </ParallaxSection>
        {/* Blob 2 */}
        <ParallaxSection speed={0.4} direction="down">
          <div 
            className="absolute top-1/2 right-1/4 w-[150px] h-[150px] blur-[1px] mix-blend-multiply dark:mix-blend-screen animate-blob2"
            style={{
              background: isDark
                ? 'linear-gradient(-45deg, rgba(99, 102, 241, 0.25), rgba(196, 181, 253, 0.15))'
                : 'linear-gradient(-45deg, rgba(99, 102, 241, 0.5), rgba(196, 181, 253, 0.3))',
              borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%'
            }}
          />
        </ParallaxSection>
        {/* Blob 3 */}
        <ParallaxSection speed={0.35} direction="up">
          <div 
            className="absolute bottom-1/4 left-1/3 w-[180px] h-[180px] blur-[1px] mix-blend-multiply dark:mix-blend-screen animate-blob3"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.1))'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(217, 70, 239, 0.2))',
              borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%'
            }}
          />
        </ParallaxSection>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 text-center md:px-6">
        <ScrollReveal direction="up" delay={200}>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">{t.hero.greeting}</span>
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t.hero.title}
              </span>
              <span className="block text-2xl text-muted-foreground sm:text-3xl md:text-4xl">
                <TypewriterEffect 
                  text={t.hero.subtitle}
                  speed={80}
                  delay={1000}
                  showCursor={true}
                />
              </span>
            </h1>
            
            <ScrollReveal direction="up" delay={400}>
              <p className="text-xl font-medium text-muted-foreground md:text-2xl">
                {t.hero.description}
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={600}>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                {t.hero.description2}
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={800}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-6">
                <MagneticButton strength={0.4}>
                  <Button size="lg" onClick={() => {
                    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
                  }}>
                    {t.hero.viewProjects}
                  </Button>
                </MagneticButton>
                <MagneticButton strength={0.4}>
                  <Button size="lg" variant="outline" onClick={() => {
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                  }}>
                    {t.hero.getInTouch}
                  </Button>
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={1000}>
              <div className="pt-12">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="animate-bounce"
                  aria-label="Scroll down"
                >
                  <ArrowDown className="h-6 w-6" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

