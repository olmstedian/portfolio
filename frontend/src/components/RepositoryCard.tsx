import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitHubRepository, formatNumber, getRelativeTime, getLanguageColor } from "@/lib/github-api"
import { Github, Star, GitFork, ExternalLink } from "lucide-react"

interface RepositoryCardProps {
  repository: GitHubRepository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Github className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <h3 className="font-semibold text-lg truncate">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {repository.name}
              </a>
            </h3>
          </div>
          <Badge variant="outline" className="flex-shrink-0">
            Public
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {repository.description || 'No description, website, or topics provided.'}
        </p>

        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {repository.topics.slice(0, 5).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs"
              >
                {topic}
              </Badge>
            ))}
            {repository.topics.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{repository.topics.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
          {repository.language && (
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repository.language) }}
              />
              <span>{repository.language}</span>
            </div>
          )}

          <a
            href={`${repository.html_url}/stargazers`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Star className="h-4 w-4" />
            {formatNumber(repository.stargazers_count)}
          </a>

          <a
            href={`${repository.html_url}/network/members`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <GitFork className="h-4 w-4" />
            {formatNumber(repository.forks_count)}
          </a>

          <span className="ml-auto">
            Updated {getRelativeTime(repository.updated_at)}
          </span>
        </div>

        {repository.homepage && (
          <a
            href={repository.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Visit website
          </a>
        )}
      </CardContent>
    </Card>
  )
}
