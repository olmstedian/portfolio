import { LanguageStat } from "@/lib/github-api"

interface LanguageChartProps {
  languages: LanguageStat[]
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const total = languages.reduce((sum, lang) => sum + lang.count, 0)

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold mb-4">Top Languages</h4>
      <div className="space-y-2">
        {languages.map((lang) => {
          const percentage = (lang.count / total) * 100
          return (
            <div key={lang.language} className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium min-w-[100px] text-left">
                {lang.language}
              </span>
              <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                {lang.count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
