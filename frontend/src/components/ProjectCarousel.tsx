import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { ProjectCard } from "./ProjectCard"
import { Project } from "@/lib/supabase"

interface ProjectCarouselProps {
  projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  return (
    <Carousel>
      {projects.map((project) => (
        <CarouselItem key={project.id}>
          <ProjectCard project={project} />
        </CarouselItem>
      ))}
    </Carousel>
  )
}

