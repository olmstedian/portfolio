import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { AboutSection } from "@/components/AboutSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { GitHubSection } from "@/components/GitHubSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { ScrollProgress } from "@/components/ScrollProgress"
import { ScrollToTop } from "@/components/ScrollToTop"
import { SectionIndicators } from "@/components/SectionIndicators"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation />
      <SectionIndicators />
      <main>
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <GitHubSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
