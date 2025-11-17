// Portfolio Projects Manager
// Handles rendering and management of portfolio project cards

class ProjectsManager {
  constructor(projectsData) {
    this.projects = projectsData || [];
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.getElementById('projects-grid');
    if (!this.container) {
      console.error('Projects grid container not found');
      return;
    }
    
    this.render();
  }

  /**
   * Render all projects in the carousel
   */
  render() {
    if (!this.container) return;

    // Create carousel wrapper
    this.container.innerHTML = `
      <div class="carousel-wrapper">
        <button class="carousel-button carousel-prev" aria-label="Previous project" id="carousel-prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div class="carousel-container" id="carousel-container">
          <div class="carousel-track">
            ${this.projects.map((project, index) => this.createProjectCard(project, index)).join('')}
          </div>
        </div>
        <button class="carousel-button carousel-next" aria-label="Next project" id="carousel-next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      <div class="carousel-indicators" id="carousel-indicators">
        ${this.projects.map((_, index) => `
          <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                  data-index="${index}" 
                  aria-label="Go to project ${index + 1}">
          </button>
        `).join('')}
      </div>
    `;

    // Initialize carousel functionality
    this.initCarousel();
  }

  /**
   * Initialize carousel functionality
   */
  initCarousel() {
    const track = this.container.querySelector('.carousel-track');
    const prevButton = this.container.querySelector('.carousel-prev');
    const nextButton = this.container.querySelector('.carousel-next');
    const indicators = this.container.querySelectorAll('.carousel-indicator');
    const container = this.container.querySelector('.carousel-container');
    
    if (!track || !prevButton || !nextButton) return;

    let currentIndex = 0;
    const totalSlides = this.projects.length;

    // Get slide width (container width + gap)
    const getSlideWidth = () => {
      if (!container) return 0;
      const containerWidth = container.offsetWidth;
      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.gap) || 0;
      return containerWidth + gap;
    };

    // Update carousel position
    const updateCarousel = () => {
      const slideWidth = getSlideWidth();
      const translateX = -(currentIndex * slideWidth);
      track.style.transform = `translateX(${translateX}px)`;
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });

      // Update button states
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === totalSlides - 1;
    };

    // Next slide
    nextButton.addEventListener('click', () => {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Previous slide
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // Indicator click
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < totalSlides - 1) {
          // Swipe left - next
          currentIndex++;
          updateCarousel();
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - previous
          currentIndex--;
          updateCarousel();
        }
      }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container.contains(document.activeElement) && 
          !document.activeElement.closest('.projects')) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) {
        currentIndex++;
        updateCarousel();
        e.preventDefault();
      }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCarousel();
      }, 250);
    });

    // Update on initial load after cards are rendered
    setTimeout(() => {
      updateCarousel();
    }, 100);

    // Initial update
    updateCarousel();
  }

  /**
   * Create HTML for a single project card
   */
  createProjectCard(project, index) {
    const cardClasses = [
      'project-card',
      project.macosWindow ? 'macos-window' : '',
      project.confidential ? 'classified-project' : ''
    ].filter(Boolean).join(' ');

    return `
      <article class="${cardClasses}" data-project-id="${project.id}" style="animation-delay: ${index * 0.1}s">
        ${project.macosWindow ? this.createMacOSWindowTitlebar(project) : ''}
        
        <div class="project-image">
          <img 
            src="${project.image}" 
            alt="${project.title}" 
            loading="lazy"
            width="400"
            height="250"
          >
          
          <!-- Badges -->
          ${this.createBadges(project)}
        </div>
        
        <div class="project-content">
          <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
          
          <p class="project-description">${this.escapeHtml(project.description)}</p>
          
          ${project.roles ? this.createRolesSection(project.roles) : ''}
          
          ${this.createTechnologiesList(project.technologies)}
          
          ${this.createActionButtons(project)}
        </div>
      </article>
    `;
  }

  /**
   * Create macOS window titlebar
   */
  createMacOSWindowTitlebar(project) {
    return `
      <div class="window-titlebar">
        <div class="window-controls">
          <button class="window-control close" aria-label="Close window" type="button"></button>
          <button class="window-control minimize" aria-label="Minimize window" type="button"></button>
          <button class="window-control maximize" aria-label="Maximize window" type="button"></button>
        </div>
        <div class="window-title">${this.escapeHtml(project.title)}</div>
      </div>
    `;
  }

  /**
   * Create badges section
   */
  createBadges(project) {
    const badges = [];

    if (project.featured) {
      badges.push('<span class="badge badge-featured">✨ Featured</span>');
    }

    if (project.classification) {
      badges.push(`<span class="badge badge-classified">🔒 ${this.escapeHtml(project.classification.toUpperCase())}</span>`);
    }

    if (project.confidential) {
      badges.push('<span class="badge badge-confidential">🔴 CONFIDENTIAL</span>');
    }

    if (project.development) {
      badges.push(`<span class="badge badge-development">🚧 ${this.escapeHtml(project.development.status)}</span>`);
    }

    if (badges.length === 0) return '';

    return `
      <div class="project-badges">
        ${badges.join('')}
      </div>
    `;
  }

  /**
   * Create roles section
   */
  createRolesSection(roles) {
    if (!roles || roles.length === 0) return '';

    const roleBadges = roles
      .map(role => `<span class="role-tag">${this.escapeHtml(role)}</span>`)
      .join('');

    return `
      <div class="project-roles">
        <h4 class="roles-title">My Role:</h4>
        <div class="roles-list">
          ${roleBadges}
        </div>
      </div>
    `;
  }

  /**
   * Create technologies list
   */
  createTechnologiesList(technologies) {
    if (!technologies || technologies.length === 0) return '';

    const maxVisible = 6;
    const visibleTechs = technologies.slice(0, maxVisible);
    const remainingCount = technologies.length - maxVisible;

    const techTags = visibleTechs
      .map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`)
      .join('');

    const moreBadge = remainingCount > 0
      ? `<span class="tech-tag project-tech-more">+${remainingCount}</span>`
      : '';

    return `
      <div class="project-technologies">
        ${techTags}
        ${moreBadge}
      </div>
    `;
  }

  /**
   * Create action buttons (GitHub, Demo)
   */
  createActionButtons(project) {
    const buttons = [];

    if (project.github) {
      buttons.push(`
        <a 
          href="${this.escapeHtml(project.github)}" 
          class="btn btn-project btn-github"
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="View ${this.escapeHtml(project.title)} on GitHub"
        >
          <span class="btn-icon">🐙</span>
          <span>GitHub</span>
        </a>
      `);
    }

    if (project.demo) {
      buttons.push(`
        <a 
          href="${this.escapeHtml(project.demo)}" 
          class="btn btn-project btn-demo"
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="View ${this.escapeHtml(project.title)} live demo"
        >
          <span class="btn-icon">🔗</span>
          <span>Live Demo</span>
        </a>
      `);
    }

    if (buttons.length === 0) return '';

    return `
      <div class="project-actions">
        ${buttons.join('')}
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get project by ID
   */
  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  /**
   * Filter projects
   */
  filterProjects(filterFn) {
    return this.projects.filter(filterFn);
  }

  /**
   * Update projects data and re-render
   */
  updateProjects(newProjects) {
    this.projects = newProjects;
    this.render();
  }
}

// Initialize when DOM is ready
let projectsManager;

document.addEventListener('DOMContentLoaded', async () => {
  // Try to load from Supabase first, fallback to static data
  let projectsData = null;

  // Check if Supabase API is available and configured
  if (typeof SupabaseAPI !== 'undefined') {
    const supabaseAPI = new SupabaseAPI();
    
    if (supabaseAPI.isConfigured()) {
      try {
        projectsData = await supabaseAPI.getProjects();
        if (projectsData) {
          console.log('Projects loaded from Supabase');
        }
      } catch (error) {
        console.warn('Failed to load from Supabase, using static data:', error);
      }
    }
  }

  // Fallback to static data if Supabase didn't provide data
  if (!projectsData && typeof PROJECTS_DATA !== 'undefined') {
    projectsData = PROJECTS_DATA;
    console.log('Projects loaded from static data');
  }

  if (projectsData) {
    projectsManager = new ProjectsManager(projectsData);
  } else {
    console.error('No project data available');
    const container = document.getElementById('projects-grid');
    if (container) {
      container.innerHTML = '<p>No projects available at the moment. Please check back later.</p>';
    }
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectsManager };
}

