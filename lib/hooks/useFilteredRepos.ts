import { useMemo } from "react";

export type SortOption = "stars" | "recent";

export interface Repository {
  id: number;
  name: string;
  description: string;
  stars: number;
  language: string;
  updatedAt: string;
}

/**
 * Custom hook to filter and sort repositories
 */
export function useFilteredRepos<T extends Repository>(
  repositories: T[],
  searchQuery: string,
  sortBy: SortOption
): T[] {
  return useMemo(() => {
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
}
