import { Github } from "lucide-react"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { GitHubAPI, GitHubProfile as GitHubProfileType, GitHubRepository, ContributionStats, GitHubAPIError } from "@/lib/github-api"
import { GitHubProfile } from "./GitHubProfile"
import { RepositoryGrid } from "./RepositoryGrid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-provider"
import { formatTranslation } from "@/lib/i18n"

export function GitHubSection() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GitHubAPIError | null>(null)
  const [profile, setProfile] = useState<GitHubProfileType | null>(null)
  const [repos, setRepos] = useState<GitHubRepository[]>([])
  const [stats, setStats] = useState<ContributionStats | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; ageHours: number } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const githubAPI = useMemo(() => new GitHubAPI('olmstedian'), [])

  const loadGitHubData = useCallback(async () => {
    if (hasLoaded || loading) return

    setLoading(true)
    setError(null)

    try {
      // Check cache info before loading
      const profileCacheInfo = githubAPI.getCacheInfo(`/users/olmstedian`)
      if (profileCacheInfo) {
        setCacheInfo(profileCacheInfo)
      }

      // Load data with individual error handling to use cache when possible
      const loadWithFallback = async <T,>(
        loader: () => Promise<T>,
        fallback: (err: GitHubAPIError) => T | null
      ): Promise<T | null> => {
        try {
          return await loader()
        } catch (err) {
          if (err instanceof GitHubAPIError && err.code === 'RATE_LIMIT') {
            const fallbackData = fallback(err)
            if (fallbackData !== null) {
              console.warn('GitHub API: Using cached data due to rate limit')
              return fallbackData
            }
          }
          throw err
        }
      }

      // Try to load all data, using cache if rate limited
      const results = await Promise.allSettled([
        loadWithFallback(
          () => githubAPI.getUserProfile(),
          () => null
        ),
        loadWithFallback(
          () => githubAPI.getFeaturedRepositories(6),
          () => null
        ),
        loadWithFallback(
          () => githubAPI.getContributionStats(),
          () => null
        ),
      ])

      // Check if we have any successful results
      const profileResult = results[0]
      const reposResult = results[1]
      const statsResult = results[2]

      if (profileResult.status === 'fulfilled' && profileResult.value) {
        setProfile(profileResult.value)
      }
      if (reposResult.status === 'fulfilled' && reposResult.value) {
        setRepos(reposResult.value)
      }
      if (statsResult.status === 'fulfilled' && statsResult.value) {
        setStats(statsResult.value)
      }

      // Set error if all requests failed
      const allFailed = results.every(
        (result) => result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value === null)
      )

      if (allFailed) {
        const firstError = results.find((r) => r.status === 'rejected')
        if (firstError && firstError.status === 'rejected') {
          setError(
            firstError.reason instanceof GitHubAPIError
              ? firstError.reason
              : new GitHubAPIError('Failed to load GitHub data')
          )
        } else {
          setError(new GitHubAPIError('Failed to load GitHub data'))
        }
      } else {
        // At least some data loaded successfully, clear error
        setError(null)
        setHasLoaded(true)
      }

      // Update cache info after loading
      const updatedCacheInfo = githubAPI.getCacheInfo(`/users/olmstedian`)
      if (updatedCacheInfo) {
        setCacheInfo(updatedCacheInfo)
      } else {
        setCacheInfo(null) // Fresh data, not from cache
      }
    } catch (err) {
      console.error('Failed to load GitHub data:', err)
      setError(err instanceof GitHubAPIError ? err : new GitHubAPIError('Failed to load GitHub data'))
    } finally {
      setLoading(false)
    }
  }, [githubAPI, hasLoaded, loading])

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded && !loading) {
            loadGitHubData()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasLoaded, loading, loadGitHubData])

  const handleRetry = () => {
    setHasLoaded(false)
    loadGitHubData()
  }

  return (
    <section ref={sectionRef} id="github" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t.github.title}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            {t.github.subtitle}
          </p>
          {cacheInfo && cacheInfo.cached && (
            <p className="text-xs text-muted-foreground/70 mt-2">
              {formatTranslation(t.github.cached, { hours: String(cacheInfo.ageHours) })}
            </p>
          )}
        </div>

        <div className="mx-auto max-w-7xl space-y-8">
          {loading && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">{t.github.loading}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-2">
                    <Github className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-destructive font-medium text-lg">
                    {error.code === 'RATE_LIMIT' 
                      ? t.github.rateLimit
                      : t.github.error}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {error.code === 'RATE_LIMIT' 
                      ? error.message.includes('resets at')
                        ? error.message
                        : t.github.rateLimitDesc
                      : error.message}
                  </p>
                  {error.code === 'RATE_LIMIT' && (
                    <div className="bg-muted/50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Tip:</strong> To avoid rate limits, you can:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Wait a few minutes and try again</li>
                        <li>Visit GitHub directly using the button below</li>
                        <li>Add a GitHub personal access token (requires code changes)</li>
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                    {error.code !== 'RATE_LIMIT' && (
                      <Button 
                        onClick={handleRetry} 
                        variant="outline"
                        className={cn(
                          "gap-2 font-medium",
                          "bg-background/50 backdrop-blur-sm",
                          "border-2 border-primary/30",
                          "hover:bg-primary/10 hover:border-primary/60",
                          "hover:text-primary",
                          "shadow-sm hover:shadow-md",
                          "hover:scale-105 active:scale-95",
                          "transition-all duration-300"
                        )}
                      >
                        <Github className="h-4 w-4" />
                        {t.github.tryAgain}
                      </Button>
                    )}
                    <Button 
                      asChild 
                      variant="default"
                      className={cn(
                        "gap-2 font-medium",
                        "bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200",
                        "text-white dark:text-slate-900",
                        "hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-200 dark:hover:to-slate-300",
                        "shadow-md hover:shadow-lg",
                        "hover:scale-105 active:scale-95",
                        "transition-all duration-300",
                        "border-0"
                      )}
                    >
                      <a
                        href="https://github.com/olmstedian"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        {t.github.viewOnGitHub}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && profile && (
            <>
              <GitHubProfile profile={profile} stats={stats} />

              <div>
                <h3 className="text-2xl font-bold mb-6">{t.github.featuredRepos}</h3>
                {repos.length === 0 ? (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <p>{t.github.noRepos}</p>
                      <Button 
                        asChild 
                        variant="default"
                        className={cn(
                          "mt-4 gap-2 font-medium",
                          "bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200",
                          "text-white dark:text-slate-900",
                          "hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-200 dark:hover:to-slate-300",
                          "shadow-md hover:shadow-lg",
                          "hover:scale-105 active:scale-95",
                          "transition-all duration-300",
                          "border-0"
                        )}
                      >
                        <a
                          href="https://github.com/olmstedian?tab=repositories"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          {t.github.browseOnGitHub}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <RepositoryGrid repositories={repos} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

