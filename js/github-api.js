// GitHub API Integration for Portfolio

class GitHubAPI {
  constructor(username = 'olmstedian') {
    this.username = username;
    this.baseURL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Make API request with caching and error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = url;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile() {
    return await this.makeRequest(`/users/${this.username}`);
  }

  /**
   * Get user's repositories
   * @param {number} per_page - Number of repos per page
   * @param {string} sort - Sort method (created, updated, pushed, full_name)
   * @param {string} direction - Sort direction (asc, desc)
   */
  async getRepositories(per_page = 30, sort = 'updated', direction = 'desc') {
    return await this.makeRequest(
      `/users/${this.username}/repos?per_page=${per_page}&sort=${sort}&direction=${direction}`
    );
  }

  /**
   * Get user's contribution statistics
   */
  async getContributionStats() {
    try {
      // Note: GitHub doesn't provide contribution stats via API
      // This is a placeholder for custom implementation
      const repos = await this.getRepositories();
      
      const stats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: this.getLanguageStats(repos),
        recentActivity: repos.slice(0, 5)
      };

      return stats;
    } catch (error) {
      console.error('Failed to get contribution stats:', error);
      return null;
    }
  }

  /**
   * Get language statistics from repositories
   * @param {Array} repos - Array of repository objects
   */
  getLanguageStats(repos) {
    const languages = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Sort by usage count
    return Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8) // Top 8 languages
      .map(([language, count]) => ({ language, count }));
  }

  /**
   * Get featured repositories (pinned or most starred)
   * @param {number} limit - Number of featured repos to return
   */
  async getFeaturedRepositories(limit = 6) {
    try {
      const repos = await this.getRepositories();
      console.log('Raw repositories:', repos.length);
      console.log('Repository details:', repos.map(r => ({ name: r.name, fork: r.fork, private: r.private })));
      
      // Filter out forks and sort by stars/activity
      const featuredRepos = repos
        .filter(repo => !repo.fork && !repo.private)
        .sort((a, b) => {
          // Sort by stars first, then by recent activity
          const starDiff = b.stargazers_count - a.stargazers_count;
          if (starDiff !== 0) return starDiff;
          
          return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, limit)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          topics: repo.topics || [],
          homepage: repo.homepage
        }));

      console.log('Featured repositories after filtering:', featuredRepos);
      return featuredRepos;
    } catch (error) {
      console.error('Failed to get featured repositories:', error);
      return [];
    }
  }

  /**
   * Get repository languages for a specific repo
   * @param {string} repoName - Repository name
   */
  async getRepositoryLanguages(repoName) {
    try {
      return await this.makeRequest(`/repos/${this.username}/${repoName}/languages`);
    } catch (error) {
      console.error(`Failed to get languages for ${repoName}:`, error);
      return {};
    }
  }
}

// GitHub Profile Renderer
class GitHubProfileRenderer {
  constructor(apiInstance, statsContainerId) {
    this.api = apiInstance;
    this.statsContainer = document.getElementById(statsContainerId);
    this.reposContainer = document.getElementById('github-repos');
    this.loadingState = false;
  }

  /**
   * Render complete GitHub profile section
   */
  async renderProfile() {
    if (!this.statsContainer || !this.reposContainer) {
      console.error('GitHub containers not found', {
        stats: !!this.statsContainer,
        repos: !!this.reposContainer
      });
      return;
    }

    this.showLoading();

    try {
      console.log('Fetching GitHub data...');
      const [profile, repos, stats] = await Promise.all([
        this.api.getUserProfile(),
        this.api.getFeaturedRepositories(6),
        this.api.getContributionStats()
      ]);

      console.log('GitHub data fetched:', { profile: !!profile, repos: repos?.length, stats: !!stats });
      
      this.renderStats(profile, stats);
      this.renderRepositories(repos);
      
    } catch (error) {
      this.renderError(error);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Render GitHub statistics
   * @param {Object} profile - User profile data
   * @param {Object} stats - Contribution statistics
   */
  renderStats(profile, stats) {
    if (!this.statsContainer) return;

    const statsData = [
      { label: 'Public Repos', value: profile.public_repos },
      { label: 'Followers', value: profile.followers },
      { label: 'Following', value: profile.following },
      { label: 'Total Stars', value: stats?.totalStars || 0 }
    ];

    this.statsContainer.innerHTML = `
      <div class="github-profile-card glass-card">
        <div class="profile-header">
          <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="profile-avatar">
          <div class="profile-info">
            <h3>${profile.name || profile.login}</h3>
            <p class="profile-bio">${profile.bio || 'No bio available'}</p>
            <a href="${profile.html_url}" class="profile-link btn btn-secondary" target="_blank" rel="noopener">
              View on GitHub
            </a>
          </div>
        </div>
        <div class="stats-grid">
          ${statsData.map(stat => `
            <div class="stat-item">
              <div class="stat-value">${this.formatNumber(stat.value)}</div>
              <div class="stat-label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
        ${stats?.languages ? this.renderLanguageChart(stats.languages) : ''}
      </div>
    `;
  }

  /**
   * Render repositories grid
   * @param {Array} repos - Array of repository objects
   */
  renderRepositories(repos) {
    console.log('Rendering repositories:', repos?.length, 'repos');
    console.log('Repos container:', this.reposContainer);
    
    if (!this.reposContainer) {
      console.error('Repos container not found');
      return;
    }

    if (!repos || repos.length === 0) {
      this.reposContainer.innerHTML = `
        <div class="no-repos">
          <p>No public repositories found.</p>
        </div>
      `;
      return;
    }

    this.reposContainer.innerHTML = `
      <div class="repos-grid">
        ${repos.map((repo, index) => `
          <div class="github-repo-card" style="animation-delay: ${index * 0.1}s">
            <div class="github-repo-header">
              <span class="github-repo-icon">📁</span>
              <h3 class="github-repo-name">
                <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
              </h3>
              <span class="github-repo-visibility">Public</span>
            </div>
            
            <p class="github-repo-description">${repo.description || 'No description, website, or topics provided.'}</p>
            
            ${repo.topics && repo.topics.length > 0 ? `
              <div class="github-repo-topics">
                ${repo.topics.slice(0, 5).map(topic => `
                  <a class="github-topic-tag" href="#">${topic}</a>
                `).join('')}
                ${repo.topics.length > 5 ? `<span class="github-topics-more">+${repo.topics.length - 5} more</span>` : ''}
              </div>
            ` : ''}
            
            <div class="github-repo-footer">
              ${repo.language ? `
                <span class="github-repo-language">
                  <span class="github-language-color" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                  ${repo.language}
                </span>
              ` : ''}
              
              <a class="github-repo-stat" href="${repo.html_url}/stargazers">
                <span class="github-stat-icon">⭐</span>
                ${this.formatNumber(repo.stargazers_count)}
              </a>
              
              <a class="github-repo-stat" href="${repo.html_url}/network/members">
                <span class="github-stat-icon">🍴</span>
                ${this.formatNumber(repo.forks_count)}
              </a>
              
              <span class="github-repo-updated">Updated ${this.getRelativeTime(repo.updated_at)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    console.log('Repository HTML generated');
    
    // Animate repository cards
    this.animateRepoCards();
  }

  /**
   * Render language usage chart
   * @param {Array} languages - Array of language objects
   */
  renderLanguageChart(languages) {
    const total = languages.reduce((sum, lang) => sum + lang.count, 0);
    
    return `
      <div class="languages-section">
        <h4>Top Languages</h4>
        <div class="languages-chart">
          ${languages.map(lang => `
            <div class="language-item">
              <div class="language-bar">
                <div class="language-fill" style="width: ${(lang.count / total) * 100}%"></div>
              </div>
              <span class="language-name">${lang.language}</span>
              <span class="language-count">${lang.count}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.statsContainer) return;
    
    this.loadingState = true;
    this.statsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading pulse"></div>
        <p>Loading GitHub profile...</p>
      </div>
    `;
    
    if (this.reposContainer) {
      this.reposContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading pulse"></div>
          <p>Loading repositories...</p>
        </div>
      `;
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.loadingState = false;
  }

  /**
   * Render error state
   * @param {Error} error - Error object
   */
  renderError(error) {
    if (!this.statsContainer) return;

    this.statsContainer.innerHTML = `
      <div class="error-container">
        <p class="error-message">Failed to load GitHub profile: ${error.message}</p>
        <button class="btn btn-secondary" onclick="githubRenderer.renderProfile()">
          Try Again
        </button>
      </div>
    `;
    
    if (this.reposContainer) {
      this.reposContainer.innerHTML = `
        <div class="error-container">
          <p class="error-message">Failed to load repositories</p>
        </div>
      `;
    }
  }

  /**
   * Animate repository cards with stagger effect
   */
  animateRepoCards() {
    const cards = document.querySelectorAll('.repo-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
  }

  /**
   * Format number with appropriate suffixes
   * @param {number} num - Number to format
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Get relative time string
   * @param {string} dateString - ISO date string
   */
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }

  /**
   * Check if repository was recently updated (within last 30 days)
   * @param {string} dateString - ISO date string
   */
  isRecentlyUpdated(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diffInDays <= 30;
  }

  /**
   * Get color for programming language
   * @param {string} language - Programming language name
   */
  getLanguageColor(language) {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Ruby': '#701516',
      'PHP': '#4F5D95',
      'Swift': '#fa7343',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Shell': '#89e051',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Vue': '#2c3e50',
      'React': '#61dafb'
    };
    return colors[language] || '#586069';
  }
}

// Initialize GitHub integration when DOM is ready
let githubAPI;
let githubRenderer;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize GitHub API and renderer
  githubAPI = new GitHubAPI('olmstedian'); // Your GitHub username
  githubRenderer = new GitHubProfileRenderer(githubAPI, 'github-stats');
  
  // Load GitHub profile when the section comes into view
  const githubSection = document.getElementById('github');
  if (githubSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !githubRenderer.loadingState) {
          githubRenderer.renderProfile();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(githubSection);
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GitHubAPI, GitHubProfileRenderer };
}