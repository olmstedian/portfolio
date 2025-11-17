// GitHub API Integration for React Frontend

export interface GitHubProfile {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepository {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  homepage: string | null
  fork?: boolean
  private?: boolean
}

export interface LanguageStat {
  language: string
  count: number
}

export interface ContributionStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  languages: LanguageStat[]
  recentActivity: GitHubRepository[]
}

export class GitHubAPIError extends Error {
  code?: string
  status?: number
  rateLimitReset?: number

  constructor(message: string, metadata?: { code?: string; status?: number; rateLimitReset?: number }) {
    super(message)
    this.name = 'GitHubAPIError'
    this.code = metadata?.code
    this.status = metadata?.status
    this.rateLimitReset = metadata?.rateLimitReset
  }
}

export class GitHubAPI {
  private username: string
  private baseURL = 'https://api.github.com'
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours (daily cache)
  private persistentCacheKey = 'portfolio.githubCache'
  private token: string | null = null

  constructor(username: string = 'olmstedian', token?: string) {
    this.username = username
    this.token = token || this.resolveTokenFromEnvironment()
    this.loadPersistentCache()
  }

  /**
   * Load cache from localStorage on initialization
   */
  private loadPersistentCache(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.persistentCacheKey)
      if (stored) {
        const cacheData = JSON.parse(stored) as Record<string, { data: unknown; timestamp: number }>
        const now = Date.now()
        
        // Load valid (non-expired) cache entries
        Object.entries(cacheData).forEach(([key, value]) => {
          if (now - value.timestamp < this.cacheTimeout) {
            this.cache.set(key, value)
          }
        })
      }
    } catch (error) {
      console.warn('GitHub API: failed to load persistent cache', error)
    }
  }

  /**
   * Save cache to localStorage
   */
  private savePersistentCache(): void {
    if (typeof window === 'undefined') return

    try {
      const cacheObject: Record<string, { data: unknown; timestamp: number }> = {}
      this.cache.forEach((value, key) => {
        cacheObject[key] = value
      })
      localStorage.setItem(this.persistentCacheKey, JSON.stringify(cacheObject))
    } catch (error) {
      console.warn('GitHub API: failed to save persistent cache', error)
      // If storage is full, try to clear old entries
      try {
        const now = Date.now()
        const cacheObject: Record<string, { data: unknown; timestamp: number }> = {}
        this.cache.forEach((value, key) => {
          // Only keep entries that are less than 12 hours old
          if (now - value.timestamp < 12 * 60 * 60 * 1000) {
            cacheObject[key] = value
          }
        })
        localStorage.setItem(this.persistentCacheKey, JSON.stringify(cacheObject))
      } catch (clearError) {
        console.warn('GitHub API: failed to clear old cache entries', clearError)
      }
    }
  }

  private resolveTokenFromEnvironment(): string | null {
    if (typeof window === 'undefined') return null

    // Check for token in environment variables or config
    const windowWithConfig = window as Window & {
      githubApiConfig?: { token?: string }
      GITHUB_API_TOKEN?: string
    }
    const configToken = windowWithConfig?.githubApiConfig?.token || windowWithConfig?.GITHUB_API_TOKEN
    if (configToken) return configToken

    // Check for meta tag
    const metaToken = document.querySelector('meta[name="github-token"]')
    if (metaToken?.getAttribute('content')) {
      return metaToken.getAttribute('content')?.trim() || null
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem('portfolio.githubToken')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return typeof parsed === 'string' ? parsed : parsed?.token || null
        } catch {
          return stored
        }
      }
    } catch (error) {
      console.warn('GitHub API: failed to read stored token', error)
    }

    return null
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  /**
   * Get cached data (even if expired) from persistent storage
   */
  private getCachedDataFromStorage<T>(cacheKey: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.persistentCacheKey)
      if (stored) {
        const cacheData = JSON.parse(stored) as Record<string, { data: unknown; timestamp: number }>
        const cached = cacheData[cacheKey]
        if (cached) {
          // Load into in-memory cache
          this.cache.set(cacheKey, cached)
          return cached.data as T
        }
      }
    } catch (error) {
      console.warn('GitHub API: failed to read persistent cache', error)
    }

    return null
  }

  private async makeRequest<T>(endpoint: string, useDailyCache: boolean = true): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = url
    const cacheTimeout = useDailyCache ? this.cacheTimeout : 5 * 60 * 1000 // Use daily cache for GitHub data, 5min for other requests

    // Check in-memory cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.data as T
      }
    }

    // Check persistent cache (localStorage) for daily cache
    if (useDailyCache && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.persistentCacheKey)
        if (stored) {
          const cacheData = JSON.parse(stored) as Record<string, { data: unknown; timestamp: number }>
          const cached = cacheData[cacheKey]
          if (cached && Date.now() - cached.timestamp < cacheTimeout) {
            // Load into in-memory cache
            this.cache.set(cacheKey, cached)
            return cached.data as T
          }
        }
      } catch (error) {
        console.warn('GitHub API: failed to read persistent cache', error)
      }
    }

    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
        const rateLimitReset = response.headers.get('x-ratelimit-reset')
        const isRateLimit = response.status === 429 || 
          (response.status === 403 && 
           rateLimitRemaining !== null && 
           parseInt(rateLimitRemaining) <= 0)

        // If rate limited, try to return cached data even if expired
        if (isRateLimit && useDailyCache) {
          const cachedData = this.getCachedDataFromStorage<T>(cacheKey)
          if (cachedData !== null) {
            // Get age from cache entry (now loaded in memory)
            const cacheEntry = this.cache.get(cacheKey)
            const ageHours = cacheEntry 
              ? Math.round((Date.now() - cacheEntry.timestamp) / (60 * 60 * 1000))
              : 0
            console.warn('GitHub API: Rate limited, using cached data', {
              ageHours: ageHours > 0 ? ageHours : 0,
              age: ageHours > 0 ? `${ageHours}h` : '<1h'
            })
            return cachedData
          }
        }

        let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`

        if (isRateLimit) {
          const resetDate = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000) : null
          const resetMessage = resetDate
            ? ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`
            : ''
          errorMessage = 'GitHub API rate limit exceeded. Please try again later or provide a personal access token.' + resetMessage
        }

        throw new GitHubAPIError(errorMessage, {
          code: isRateLimit ? 'RATE_LIMIT' : response.status === 401 ? 'UNAUTHORIZED' : 'HTTP_ERROR',
          status: response.status,
          rateLimitReset: rateLimitReset ? parseInt(rateLimitReset) : undefined,
        })
      }

      const data = await response.json()

      // Cache the response (both in-memory and persistent)
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      }
      this.cache.set(cacheKey, cacheEntry)
      
      // Save to persistent cache if using daily cache
      if (useDailyCache) {
        this.savePersistentCache()
      }

      return data as T
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error
      }
      console.error('GitHub API request failed:', error)
      throw new GitHubAPIError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getUserProfile(): Promise<GitHubProfile> {
    return this.makeRequest<GitHubProfile>(`/users/${this.username}`, true)
  }

  async getRepositories(per_page: number = 30, sort: string = 'updated', direction: string = 'desc'): Promise<GitHubRepository[]> {
    return this.makeRequest<GitHubRepository[]>(
      `/users/${this.username}/repos?per_page=${per_page}&sort=${sort}&direction=${direction}`,
      true
    )
  }

  async getFeaturedRepositories(limit: number = 6): Promise<GitHubRepository[]> {
    try {
      const repos = await this.getRepositories()

      const featuredRepos = repos
        .filter((repo) => !repo.fork && !repo.private)
        .sort((a, b) => {
          const starDiff = b.stargazers_count - a.stargazers_count
          if (starDiff !== 0) return starDiff
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })
        .slice(0, limit)
        .map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          topics: repo.topics || [],
          homepage: repo.homepage || null,
        }))

      return featuredRepos
    } catch (error) {
      console.error('Failed to get featured repositories:', error)
      return []
    }
  }

  getLanguageStats(repos: GitHubRepository[]): LanguageStat[] {
    const languages: Record<string, number> = {}

    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([language, count]) => ({ language, count }))
  }

  async getContributionStats(): Promise<ContributionStats> {
    try {
      const repos = await this.getRepositories()

      const stats: ContributionStats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: this.getLanguageStats(repos),
        recentActivity: repos.slice(0, 5),
      }

      return stats
    } catch (error) {
      console.error('Failed to get contribution stats:', error)
      throw error
    }
  }

  setToken(token: string | null, persist: boolean = true) {
    this.token = token ? token.trim() : null

    if (persist && this.token) {
      try {
        localStorage.setItem('portfolio.githubToken', JSON.stringify(this.token))
      } catch (error) {
        console.warn('GitHub API: failed to persist token', error)
      }
    } else if (!this.token) {
      try {
        localStorage.removeItem('portfolio.githubToken')
      } catch (error) {
        console.warn('GitHub API: failed to clear stored token', error)
      }
    }

    this.cache.clear()
  }

  clearToken() {
    this.setToken(null)
  }

  /**
   * Get cache information for a specific endpoint
   */
  getCacheInfo(endpoint: string): { cached: boolean; age: number; ageHours: number } | null {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = url

    // Check in-memory cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        const age = Date.now() - cached.timestamp
        return {
          cached: true,
          age,
          ageHours: Math.round(age / (60 * 60 * 1000))
        }
      }
    }

    // Check persistent cache
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.persistentCacheKey)
        if (stored) {
          const cacheData = JSON.parse(stored) as Record<string, { data: unknown; timestamp: number }>
          const cached = cacheData[cacheKey]
          if (cached) {
            const age = Date.now() - cached.timestamp
            return {
              cached: true,
              age,
              ageHours: Math.round(age / (60 * 60 * 1000))
            }
          }
        }
      } catch {
        // Ignore cache read errors
      }
    }

    return null
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear()
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.persistentCacheKey)
      } catch (error) {
        console.warn('GitHub API: failed to clear persistent cache', error)
      }
    }
  }
}

// Utility functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }

  return 'Just now'
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#fa7343',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#2c3e50',
    React: '#61dafb',
  }
  return colors[language] || '#586069'
}
