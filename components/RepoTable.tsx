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
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    };
  } else if (daysSinceUpdate < 180) {
    return {
      label: "Maintained",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
  } else if (daysSinceUpdate < 365) {
    return {
      label: "Stale",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
  } else {
    return {
      label: "Archived",
      color: "bg-muted/20 text-muted border-muted/20",
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
      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Repository Insights
        </h2>
        <div className="flex items-center justify-center h-32 text-muted">
          <p className="text-sm">No public repositories found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-up">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Repository Insights
            </h2>
            <p className="text-xs text-muted mt-1">
              Public repositories sorted by relevance and activity
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
                className="w-full sm:w-64 px-4 py-2 pl-10 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
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
            <div className="flex gap-2 bg-background border border-border rounded-lg p-1">
              <button
                onClick={() => setSortBy("stars")}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  sortBy === "stars"
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Most Starred
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  sortBy === "recent"
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-muted font-mono">
          Showing {sortedAndFilteredRepos.length} of {repositories.length}{" "}
          repositories
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase tracking-wider">
                  Repository
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">
                  Language
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted uppercase tracking-wider">
                  Stars
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">
                  Forks
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredRepos.map((repo, index) => {
                const status = getRepoStatus(repo);
                const isTopRepo = index === 0 && sortBy === "stars";
                const isRecentRepo = index === 0 && sortBy === "recent";

                return (
                  <tr
                    key={repo.id}
                    className={`border-b border-border/50 hover:bg-accent/5 transition-colors ${
                      isTopRepo || isRecentRepo ? "bg-accent/5" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
                          >
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
                              MOST STARRED
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
