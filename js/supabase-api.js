// Supabase API Integration for Portfolio
// Fetches projects from Supabase instead of static data

class SupabaseAPI {
  constructor() {
    // Use the same Supabase config as admin
    // In production, you might want separate configs for public access
    this.supabaseUrl = 'https://iraexyvraqmzqzglopph.supabase.co';
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWV4eXZyYXFtenF6Z2xvcHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTE5NDAsImV4cCI6MjA3ODk2Nzk0MH0.Q5UUnvlOwEYUIAB3J6CQHb2Meg7htnX_BS4J7RqwEXQ';
    this.client = null;
    this.init();
  }

  init() {
    // Initialize Supabase client if available
    if (typeof window.supabase !== 'undefined') {
      this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
    } else {
      console.warn('Supabase client not loaded. Loading from CDN...');
      this.loadSupabaseClient();
    }
  }

  loadSupabaseClient() {
    // Dynamically load Supabase client if not already loaded
    if (document.querySelector('script[src*="@supabase/supabase-js"]')) {
      // Already loading or loaded
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
    };
    document.head.appendChild(script);
  }

  /**
   * Fetch all active projects from Supabase
   */
  async getProjects() {
    if (!this.client) {
      await this.waitForClient();
    }

    try {
      const { data, error } = await this.client
        .from('projects')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        return null; // Return null to fallback to static data
      }

      // Transform Supabase data to match the expected format
      return data.map(project => this.transformProject(project));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return null;
    }
  }

  /**
   * Transform Supabase project data to match portfolio format
   */
  transformProject(project) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies || [],
      github: project.github,
      demo: project.demo,
      featured: project.featured || false,
      macosWindow: project.macos_window || false,
      confidential: project.confidential || false,
      classification: project.classification,
      roles: project.roles || [],
      development: project.development_status || project.development_timeline
        ? {
            status: project.development_status,
            timeline: project.development_timeline,
          }
        : undefined,
    };
  }

  /**
   * Wait for Supabase client to be available
   */
  async waitForClient(maxAttempts = 10, delay = 100) {
    for (let i = 0; i < maxAttempts; i++) {
      if (this.client) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Supabase client failed to load');
  }

  /**
   * Check if Supabase is configured
   */
  isConfigured() {
    return this.supabaseUrl && this.supabaseUrl.includes('supabase.co') && 
           this.supabaseAnonKey && this.supabaseAnonKey.length > 50;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SupabaseAPI };
}

