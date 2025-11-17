import { GitHubRepository } from "@/lib/github-api"
import { RepositoryCard } from "./RepositoryCard"

interface RepositoryGridProps {
  repositories: GitHubRepository[]
}

export function RepositoryGrid({ repositories }: RepositoryGridProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No public repositories found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  )
}
