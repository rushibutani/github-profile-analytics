"use client";

import { RepositoryDisplay } from "../../../types/github";
import { useState, useCallback } from "react";
import RepoRow from "./RepoRow";
import RepoTableHeader from "./RepoTableHeader";
import { useFilteredRepos, SortOption } from "../../../lib/hooks";
import { Card, EmptyState } from "../../ui";

interface RepoTableProps {
  repositories: RepositoryDisplay[];
}

export default function RepoTable({ repositories }: RepoTableProps) {
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize callbacks to prevent child re-renders
  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Use custom hook for filtering and sorting
  const sortedAndFilteredRepos = useFilteredRepos(
    repositories,
    searchQuery,
    sortBy
  );

  if (repositories.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-medium text-foreground/90 mb-4">
          Repository Insights
        </h2>
        <EmptyState size="sm" title="No public repositories found" />
      </Card>
    );
  }

  return (
    <Card variant="interactive">
      <div className="space-y-4">
        {/* Header - Memoized Component */}
        <RepoTableHeader
          sortBy={sortBy}
          searchQuery={searchQuery}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
        />

        {/* Results count */}
        <div className="text-xs text-muted">
          Showing {sortedAndFilteredRepos.length} of {repositories.length}{" "}
          repositories
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Repository table"
        >
          <table className="w-full" aria-label="List of GitHub repositories">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="text-left py-3 px-2 sm:px-4 text-xs font-medium text-muted"
                  scope="col"
                >
                  Repository
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-medium text-muted hidden md:table-cell"
                  scope="col"
                >
                  Language
                </th>
                <th
                  className="text-right py-3 px-4 text-xs font-medium text-muted hidden md:table-cell"
                  scope="col"
                >
                  Stars
                </th>
                <th
                  className="text-right py-3 px-4 text-xs font-medium text-muted hidden sm:table-cell"
                  scope="col"
                >
                  Forks
                </th>
                <th
                  className="text-right py-3 px-4 text-xs font-medium text-muted hidden lg:table-cell"
                  scope="col"
                >
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredRepos.map((repo, index) => {
                // Compute variant in parent to avoid prop drilling
                let variant: "featured" | "latest" | "default" = "default";
                if (index === 0) {
                  variant = sortBy === "stars" ? "featured" : "latest";
                }

                return <RepoRow key={repo.id} repo={repo} variant={variant} />;
              })}
            </tbody>
          </table>
        </div>

        {sortedAndFilteredRepos.length === 0 && (
          <EmptyState size="sm" title="No repositories match your search" />
        )}
      </div>
    </Card>
  );
}
