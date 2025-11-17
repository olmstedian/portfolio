import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitHubProfile as GitHubProfileType, ContributionStats } from "@/lib/github-api"
import { LanguageChart } from "./LanguageChart"
import { Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "./AnimatedCounter"
import { MagneticButton } from "./MagneticButton"

interface GitHubProfileProps {
  profile: GitHubProfileType
  stats: ContributionStats | null
}

export function GitHubProfile({ profile, stats }: GitHubProfileProps) {
  const statsData = [
    { label: 'Public Repos', value: profile.public_repos },
    { label: 'Followers', value: profile.followers },
    { label: 'Following', value: profile.following },
    { label: 'Total Stars', value: stats?.totalStars || 0 },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={profile.avatar_url}
            alt={profile.name || profile.login}
            className="w-24 h-24 rounded-full border-2 border-primary/20 shadow-lg"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{profile.name || profile.login}</h3>
            <p className="text-muted-foreground mb-4">
              {profile.bio || 'No bio available'}
            </p>
            <MagneticButton strength={0.3}>
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
                  "group/button border-0"
                )}
              >
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    "group-hover/button:rotate-12"
                  )} />
                  <span>View on GitHub</span>
                  <ExternalLink className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    "group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                  )} />
                </a>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="text-2xl font-bold text-primary mb-1">
                <AnimatedCounter value={stat.value} duration={2000} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        {stats?.languages && stats.languages.length > 0 && (
          <LanguageChart languages={stats.languages} />
        )}
      </CardContent>
    </Card>
  )
}
