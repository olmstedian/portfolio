import { Project } from "./supabase"
import { Translations } from "./i18n"

/**
 * Translate a project based on the current language translations
 * Falls back to original project data if translation is not available
 */
export function translateProject(project: Project, translations: Translations): Project {
  const projectTranslations = translations.projects.items[project.id]
  
  if (!projectTranslations) {
    // No translation available, return original
    return project
  }

  // Get translated development status if it exists
  let translatedDevelopmentStatus = project.development_status
  if (project.development_status) {
    const statusMap: Record<string, string> = {
      'Under Development': translations.projects.underDevelopment,
      'Active Development': translations.projects.activeDevelopment,
      'Classified Development': translations.projects.classifiedDevelopment,
    }
    translatedDevelopmentStatus = statusMap[project.development_status] || project.development_status
  }

  let translatedDevelopmentTimeline = project.development_timeline
  if (project.development_timeline === 'Ongoing') {
    translatedDevelopmentTimeline = translations.projects.ongoing
  }

  return {
    ...project,
    title: projectTranslations.title || project.title,
    description: projectTranslations.description || project.description,
    roles: projectTranslations.roles || project.roles,
    development_status: translatedDevelopmentStatus,
    development_timeline: translatedDevelopmentTimeline,
  }
}

