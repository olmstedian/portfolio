// GitHub API Integration for Portfolio

class GitHubAPIError extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.name = 'GitHubAPIError';
    Object.assign(this, metadata);
  }
}

class GitHubAPI {
  constructor(username = 'olmstedian', options = {}) {
    const {
      token = null,
      cacheTimeout = 5 * 60 * 1000,
      tokenStorageKey = 'portfolio.githubToken',
      cacheStorageNamespace = 'portfolio.githubCache',
      fallbackCacheWindow = 24 * 60 * 60 * 1000
    } = options;

    this.username = username;
    this.baseURL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = cacheTimeout;
    this.tokenStorageKey = tokenStorageKey;
    this.token = token || this.resolveTokenFromEnvironment();
    this.cacheStorageNamespace = cacheStorageNamespace;
    this.fallbackCacheWindow = fallbackCacheWindow;
  }

  canUseLocalStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  resolveTokenFromEnvironment() {
    if (typeof window === 'undefined') {
      return null;
    }

    const configToken = window?.githubApiConfig?.token || window?.GITHUB_API_TOKEN;
    if (configToken) {
      return configToken;
    }

    if (typeof document !== 'undefined') {
      const metaToken = document.querySelector('meta[name="github-token"]');
      if (metaToken?.content) {
        return metaToken.content.trim();
      }
    }

    if (this.canUseLocalStorage()) {
      try {
        const storedValue = window.localStorage.getItem(this.tokenStorageKey);
        if (storedValue) {
          try {
            const parsed = JSON.parse(storedValue);
            if (typeof parsed === 'string') {
              return parsed;
            }
            if (parsed && typeof parsed === 'object' && parsed.token) {
              return parsed.token;
            }
          } catch (parseError) {
            return storedValue;
          }
        }
      } catch (storageError) {
        console.warn('GitHub API: failed to read stored token', storageError);
      }
    }

    return null;
  }

  getToken() {
    if (this.token) {
      return this.token;
    }
    this.token = this.resolveTokenFromEnvironment();
    return this.token;
  }

  setToken(token, { persist = true } = {}) {
    const trimmedToken = typeof token === 'string' ? token.trim() : null;
    this.token = trimmedToken || null;

    if (persist && this.token && this.canUseLocalStorage()) {
      try {
        window.localStorage.setItem(this.tokenStorageKey, JSON.stringify(this.token));
      } catch (error) {
        console.warn('GitHub API: failed to persist token', error);
      }
    }

    if (!this.token && this.canUseLocalStorage()) {
      try {
        window.localStorage.removeItem(this.tokenStorageKey);
      } catch (error) {
        console.warn('GitHub API: failed to clear stored token', error);
      }
    }

    this.cache.clear();
  }

  clearToken() {
    this.setToken(null);
  }

  getAuthHeaders() {
    const headers = {};
    const authToken = this.getToken();

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  async parseErrorResponse(response) {
    try {
      return await response.clone().json();
    } catch (jsonError) {
      try {
        const text = await response.clone().text();
        if (text) {
          return { message: text };
        }
      } catch (textError) {
        console.warn('GitHub API: failed to parse error response', textError);
      }
    }
    return null;
  }

  buildPersistentKey(identifier) {
    return `${this.cacheStorageNamespace}::${identifier}`;
  }

  getPersistentCache(cacheKey, { allowExpired = false } = {}) {
    const storageUtil = typeof Storage !== 'undefined' && Storage && typeof Storage.get === 'function'
      ? Storage
      : null;

    if (!this.canUseLocalStorage() || !storageUtil) {
      return null;
    }

    try {
      const record = storageUtil.get(cacheKey);
      if (!record || typeof record !== 'object') {
        return null;
      }

      const age = Date.now() - record.timestamp;
      if (!allowExpired && age > this.cacheTimeout) {
        return null;
      }

      if (allowExpired && age > this.fallbackCacheWindow) {
        return null;
      }

      return record;
    } catch (error) {
      console.warn('GitHub API: failed to read persistent cache', { cacheKey, error });
      return null;
    }
  }

  setPersistentCache(cacheKey, data) {
    const storageUtil = typeof Storage !== 'undefined' && Storage && typeof Storage.set === 'function'
      ? Storage
      : null;

    if (!this.canUseLocalStorage() || !storageUtil) {
      return;
    }

    try {
      storageUtil.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('GitHub API: failed to persist cache', { cacheKey, error });
    }
  }

  /**
   * Make API request with caching and error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = url;
    const persistentKey = this.buildPersistentKey(cacheKey);
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...this.getAuthHeaders(),
        ...(options.headers || {})
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorPayload = await this.parseErrorResponse(response);
        const rateLimitRemainingHeader = response.headers.get('x-ratelimit-remaining');
        const rateLimitResetHeader = response.headers.get('x-ratelimit-reset');
        const rateLimitRemaining = typeof rateLimitRemainingHeader === 'string'
          ? Number(rateLimitRemainingHeader)
          : null;
        const rateLimitReset = typeof rateLimitResetHeader === 'string'
          ? Number(rateLimitResetHeader)
          : null;
        const isRateLimit = response.status === 403 &&
          rateLimitRemainingHeader !== null &&
          Number.isFinite(rateLimitRemaining) &&
          rateLimitRemaining <= 0;

        const fallbackRecord = this.getPersistentCache(persistentKey, {
          allowExpired: isRateLimit
        });

        if (fallbackRecord) {
          console.warn('GitHub API: using cached data due to API error', {
            endpoint: url,
            status: response.status,
            reason: isRateLimit ? 'RATE_LIMIT' : 'HTTP_ERROR'
          });
          this.cache.set(cacheKey, {
            data: fallbackRecord.data,
            timestamp: fallbackRecord.timestamp
          });
          return fallbackRecord.data;
        }

        let errorMessage = errorPayload?.message || `GitHub API error: ${response.status} ${response.statusText}`;

        if (isRateLimit) {
          const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000) : null;
          const resetMessage = resetDate
            ? ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`
            : '';
          errorMessage = 'GitHub API rate limit exceeded. Please try again later or provide a personal access token.' + resetMessage;
        }

        throw new GitHubAPIError(errorMessage, {
          status: response.status,
          statusText: response.statusText,
          endpoint: url,
          payload: errorPayload,
          rateLimitRemaining,
          rateLimitReset,
          code: isRateLimit
            ? 'RATE_LIMIT'
            : response.status === 401
            ? 'UNAUTHORIZED'
            : 'HTTP_ERROR'
        });
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      this.setPersistentCache(persistentKey, data);

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

    const isRateLimit = error?.code === 'RATE_LIMIT' || /rate limit/i.test(error?.message || '');

    this.statsContainer.innerHTML = `
      <div class="error-container">
        <p class="error-message">Failed to load GitHub profile: ${error.message}</p>
        ${isRateLimit ? `
          <p class="error-hint">
            GitHub is temporarily limiting requests. Data may be unavailable for a short time.
          </p>
        ` : ''}
        <div class="error-actions">
          <button class="btn btn-secondary" data-action="retry-github">
            Try Again
          </button>
          <a class="btn btn-secondary" href="https://github.com/${this.api.username}" target="_blank" rel="noopener">
            View Profile
          </a>
        </div>
      </div>
    `;
    
    if (this.reposContainer) {
      this.reposContainer.innerHTML = `
        <div class="error-container">
          <p class="error-message">Failed to load repositories${isRateLimit ? ': GitHub API rate limit reached.' : ''}</p>
          <a class="btn btn-secondary" href="https://github.com/${this.api.username}?tab=repositories" target="_blank" rel="noopener">
            Browse on GitHub
          </a>
        </div>
      `;
    }

    this.bindErrorActions();
  }

  bindErrorActions() {
    if (!this.statsContainer) return;

    const retryButton = this.statsContainer.querySelector('[data-action="retry-github"]');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.renderProfile();
      });
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
  
  if (typeof window !== 'undefined') {
    window.githubAuthManager = {
      setToken(token, options) {
        githubAPI?.setToken(token, options);
        githubRenderer?.renderProfile();
      },
      clearToken() {
        githubAPI?.clearToken();
        githubRenderer?.renderProfile();
      },
      getToken() {
        return githubAPI?.getToken() || null;
      }
    };
  }

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
  module.exports = { GitHubAPI, GitHubProfileRenderer, GitHubAPIError };
}