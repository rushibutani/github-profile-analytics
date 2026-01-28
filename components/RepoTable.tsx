"use client";

import { RepositoryDisplay } from "../types/github";
import { useState, useMemo } from "react";

interface RepoTableProps {
  repositories: RepositoryDisplay[];
}

type SortOption = "stars" | "recent";

function getRepoStatus(repo: RepositoryDisplay): {
  label: string;
  color: string;
} {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceUpdate < 30) {
    return {
      label: "Active",
      color: "bg-success/10 text-success border-success/20",
    };
  } else if (daysSinceUpdate < 180) {
    return {
      label: "Maintained",
      color: "bg-primary/10 text-primary border-primary/20",
    };
  } else if (daysSinceUpdate < 365) {
    return {
      label: "Stale",
      color: "bg-warning/10 text-warning border-warning/20",
    };
  } else {
    return {
      label: "Archived",
      color: "bg-muted/10 text-muted border-muted/20",
    };
  }
}

export default function RepoTable({ repositories }: RepoTableProps) {
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedAndFilteredRepos = useMemo(() => {
    let filtered = repositories;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.language.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    if (sortBy === "stars") {
      return [...filtered].sort((a, b) => b.stars - a.stars);
    } else {
      return [...filtered].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }
  }, [repositories, sortBy, searchQuery]);

  if (repositories.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground/90 mb-4">
          Repository Insights
        </h2>
        <div className="flex items-center justify-center h-32 text-muted">
          <p className="text-sm">No public repositories found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground/90">
              Top Repositories
            </h2>
            <p className="text-xs text-muted mt-1">
              Public repositories sorted by{" "}
              {sortBy === "stars" ? "stars" : "activity"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pl-10 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Sort Filter */}
            <div className="flex gap-1 bg-surface/50 border border-border/50 rounded-xl p-1">
              <button
                onClick={() => setSortBy("stars")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  sortBy === "stars"
                    ? "bg-primary text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Most Starred
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  sortBy === "recent"
                    ? "bg-primary text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-muted">
          Showing {sortedAndFilteredRepos.length} of {repositories.length}{" "}
          repositories
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted">
                  Repository
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted hidden md:table-cell">
                  Language
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted">
                  Stars
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted hidden sm:table-cell">
                  Forks
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted hidden lg:table-cell">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredRepos.map((repo, index) => {
                const status = getRepoStatus(repo);
                const isTopRepo = index === 0 && sortBy === "stars";
                const isRecentRepo = index === 0 && sortBy === "recent";
                const isArchived = status.label === "Archived";

                return (
                  <tr
                    key={repo.id}
                    className={`border-b border-border/50 hover:bg-surface-2 transition-colors ${
                      isTopRepo || isRecentRepo ? "bg-accent-bg" : ""
                    } ${isArchived ? "opacity-50" : ""}`}
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                              isTopRepo || isRecentRepo
                                ? "text-primary hover:text-primary/80"
                                : "text-foreground hover:text-foreground/80"
                            }`}
                          >
                            {(isTopRepo || isRecentRepo) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            {repo.name}
                          </a>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                              status.color
                            }`}
                          >
                            {status.label}
                          </span>
                          {isTopRepo && (
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-accent/20 text-accent rounded border border-accent/30">
                              FEATURED
                            </span>
                          )}
                          {isRecentRepo && (
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-accent/20 text-accent rounded border border-accent/30">
                              LATEST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted line-clamp-1">
                          {repo.description || "No description available"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        <span className="text-xs text-foreground font-mono">
                          {repo.language}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 text-right ${
                        isTopRepo ? "text-accent font-bold" : ""
                      }`}
                    >
                      <span className="text-sm font-mono font-bold text-foreground">
                        {repo.stars.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                      <span className="text-sm font-mono text-muted">
                        {repo.forks.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                      <span
                        className={`text-xs font-mono ${
                          isRecentRepo
                            ? "text-accent font-medium"
                            : "text-muted"
                        }`}
                      >
                        {repo.updatedAt}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedAndFilteredRepos.length === 0 && (
          <div className="text-center py-8 text-muted">
            <p className="text-sm">No repositories match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
