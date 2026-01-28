"use client";

import { RepositoryDisplay } from "../../types/github";
import { useState, useMemo, useCallback } from "react";
import RepoRow from "./RepoRow";
import RepoTableHeader from "./RepoTableHeader";

interface RepoTableProps {
  repositories: RepositoryDisplay[];
}

type SortOption = "stars" | "recent";

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

  // Memoize filtered and sorted repos
  const sortedAndFilteredRepos = useMemo(() => {
    let filtered = repositories;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.language.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy === "stars") {
      return [...filtered].sort((a, b) => b.stars - a.stars);
    } else {
      return [...filtered].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
              {sortedAndFilteredRepos.map((repo, index) => (
                <RepoRow
                  key={repo.id}
                  repo={repo}
                  index={index}
                  sortBy={sortBy}
                />
              ))}
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
