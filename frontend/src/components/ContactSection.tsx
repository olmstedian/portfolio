import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Github, Instagram, MessageCircle, Twitter, ExternalLink, Send, Sparkles } from "lucide-react"
import { cn, decodeEmail, getMailtoLink } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"
import { MagneticButton } from "./MagneticButton"
import { ParallaxSection } from "./ParallaxSection"
import { useState, useEffect } from "react"

interface ContactLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  text: string
  color: string
  bgGradient: string
  hoverGradient: string
}

const contactLinks: ContactLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/olmstedian",
    icon: Github,
    text: "@olmstedian",
    color: "text-slate-700 dark:text-slate-300",
    bgGradient: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30",
    hoverGradient: "hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-900/50 dark:hover:to-gray-900/50"
  },
  {
    label: "Instagram",
    href: "https://instagram.com/cuneytandcakar",
    icon: Instagram,
    text: "@cuneytandcakar",
    color: "text-pink-600 dark:text-pink-400",
    bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    hoverGradient: "hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/50 dark:hover:to-rose-900/50"
  },
  {
    label: "Bluesky",
    href: "https://olmstedian.bsky.social",
    icon: MessageCircle,
    text: "@olmstedian",
    color: "text-blue-600 dark:text-blue-400",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    hoverGradient: "hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50"
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/_olmstedian_",
    icon: Twitter,
    text: "@_olmstedian_",
    color: "text-slate-900 dark:text-slate-100",
    bgGradient: "from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30",
    hoverGradient: "hover:from-slate-200 hover:to-gray-200 dark:hover:from-slate-800/50 dark:hover:to-gray-800/50"
  },
]

export function ContactSection() {
  const { t } = useLanguage()
  // Obfuscated email parts - decoded client-side to protect from crawlers
  const [email, setEmail] = useState<string>('')
  
  useEffect(() => {
    // Decode email client-side only (not visible to crawlers)
    const user = 'ccakar'
    const domain = 'spexop.com'
    setEmail(decodeEmail(user, domain))
  }, [])
  
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background py-20 md:py-28">
      {/* Background decoration with Parallax */}
      <div className="absolute inset-0 -z-10">
        <ParallaxSection speed={0.2} direction="up">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </ParallaxSection>
        <ParallaxSection speed={0.25} direction="down">
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </ParallaxSection>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t.contact.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          {/* Email Section - Improved Design */}
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950/40 dark:via-orange-950/40 dark:to-amber-950/40 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:border-primary/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/10" />
            <CardContent className="p-6 md:p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg md:text-xl text-foreground mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {t.contact.emailMe}
                    </h3>
                    {email ? (
                      <a
                        href={getMailtoLink('ccakar', 'spexop.com')}
                        className="text-sm md:text-base text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors break-all md:break-normal line-clamp-1"
                      >
                        {email}
                      </a>
                    ) : (
                      <span className="text-sm md:text-base text-muted-foreground break-all md:break-normal line-clamp-1">
                        Loading...
                      </span>
                    )}
                  </div>
                </div>
                <MagneticButton strength={0.4}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 gap-2"
                  >
                    <a href={email ? getMailtoLink('ccakar', 'spexop.com') : '#'}>
                      <Send className="h-4 w-4" />
                      {t.contact.sendEmail}
                    </a>
                  </Button>
                </MagneticButton>
              </div>
            </CardContent>
            {/* Animated border glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Card>

          {/* Social Media Links - Compact Cards */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center md:text-left">
              {t.contact.socialMedia}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {contactLinks.map((link) => {
                const Icon = link.icon
                const isExternal = link.href.startsWith('http')
                
                return (
                  <Card
                    key={link.label}
                    className={cn(
                      "group relative overflow-hidden border transition-all duration-300",
                      "hover:shadow-lg hover:-translate-y-1",
                      `bg-gradient-to-br ${link.bgGradient} ${link.hoverGradient}`,
                      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
                      "hover:before:opacity-100 dark:before:from-white/5"
                    )}
                  >
                    <CardContent className="p-4 relative z-10">
                      <a
                        href={link.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 group/link"
                      >
                        {/* Icon */}
                        <div className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 flex-shrink-0",
                          "bg-background/80 backdrop-blur-sm border border-border/50",
                          "group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/50"
                        )}>
                          <Icon className={cn("h-4 w-4 transition-colors duration-300", link.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground group-hover/link:text-primary transition-colors duration-300 line-clamp-1">
                            {link.label}
                          </h4>
                          <p className="text-xs text-muted-foreground group-hover/link:text-foreground/80 transition-colors duration-300 line-clamp-1">
                            {link.text}
                          </p>
                        </div>

                        {/* External link indicator */}
                        {isExternal && (
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                        )}
                      </a>

                      {/* Hover indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t.contact.cta}</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

