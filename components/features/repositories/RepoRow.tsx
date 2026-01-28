import { memo } from "react";
import { RepositoryDisplay } from "../../../types/github";
import { STALENESS_DAYS } from "../../../lib/constants/thresholds";
import { Badge } from "../../ui";

interface RepoRowProps {
  repo: RepositoryDisplay;
  variant?: "featured" | "latest" | "default";
}

// Memoized row component to prevent unnecessary re-renders
const RepoRow = memo(function RepoRow({
  repo,
  variant = "default",
}: RepoRowProps) {
  const status = getRepoStatus(repo);
  const isTopRepo = variant === "featured";
  const isRecentRepo = variant === "latest";
  const isArchived = status.label === "Archived";

  return (
    <tr
      className={`border-b border-border/50 hover:bg-surface-2 transition-colors ${
        isTopRepo || isRecentRepo ? "bg-accent-bg" : ""
      } ${isArchived ? "opacity-50" : ""}`}
    >
      <td className="py-3 px-2 sm:py-4 sm:px-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded ${
                isTopRepo || isRecentRepo
                  ? "text-primary hover:text-primary/80"
                  : "text-foreground hover:text-foreground/80"
              }`}
              aria-label={`${repo.name} repository - ${repo.stars} stars`}
            >
              {(isTopRepo || isRecentRepo) && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              {repo.name}
            </a>
            <Badge variant={status.variant as any}>{status.label}</Badge>
            {isTopRepo && <Badge variant="featured">FEATURED</Badge>}
            {isRecentRepo && (
              <span
                className="px-2 py-0.5 text-[10px] font-mono bg-accent/20 text-accent rounded border border-accent/30"
                aria-label="Latest update"
              >
                LATEST
              </span>
            )}
          </div>
          <p className="text-xs text-muted line-clamp-2 sm:line-clamp-1">
            {repo.description || "No description available"}
          </p>
          {/* Mobile-only stats */}
          <div className="flex items-center gap-4 md:hidden text-xs text-muted">
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: repo.languageColor }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
            <span aria-label={`${repo.stars} stars`}>
              ⭐ {repo.stars.toLocaleString()}
            </span>
            <span className="sm:hidden" aria-label={`${repo.forks} forks`}>
              🍴 {repo.forks.toLocaleString()}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: repo.languageColor }}
            aria-hidden="true"
          />
          <span className="text-xs text-foreground font-mono">
            {repo.language}
          </span>
        </div>
      </td>
      <td
        className={`py-4 px-4 text-right hidden md:table-cell ${
          isTopRepo ? "text-accent font-bold" : ""
        }`}
      >
        <span
          className="text-sm font-mono font-bold text-foreground"
          aria-label={`${repo.stars} stars`}
        >
          {repo.stars.toLocaleString()}
        </span>
      </td>
      <td className="py-4 px-4 text-right hidden sm:table-cell">
        <span
          className="text-sm font-mono text-muted"
          aria-label={`${repo.forks} forks`}
        >
          {repo.forks.toLocaleString()}
        </span>
      </td>
      <td className="py-4 px-4 text-right hidden lg:table-cell">
        <span
          className={`text-xs font-mono ${
            isRecentRepo ? "text-accent font-medium" : "text-muted"
          }`}
          aria-label={`Last updated: ${repo.updatedAt}`}
        >
          {repo.updatedAt}
        </span>
      </td>
    </tr>
  );
});

function getRepoStatus(repo: RepositoryDisplay): {
  label: string;
  variant: string;
} {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate < STALENESS_DAYS.ACTIVE) {
    return {
      label: "Active",
      variant: "active",
    };
  } else if (daysSinceUpdate < STALENESS_DAYS.MODERATE) {
    return {
      label: "Maintained",
      variant: "moderate",
    };
  } else if (daysSinceUpdate < 365) {
    return {
      label: "Stale",
      variant: "stale",
    };
  } else {
    return {
      label: "Archived",
      variant: "archived",
    };
  }
}

export default RepoRow;
