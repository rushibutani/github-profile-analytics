import { memo, ChangeEvent, useState, useEffect } from "react";
import { SearchIcon } from "../../ui";
import { SortOption, useDebounce } from "../../../lib/hooks";

interface RepoTableHeaderProps {
  sortBy: SortOption;
  searchQuery: string;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
}

// Memoized header component
const RepoTableHeader = memo(function RepoTableHeader({
  sortBy,
  searchQuery,
  onSortChange,
  onSearchChange,
}: RepoTableHeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Sync debounced value with parent
  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
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
          <label htmlFor="repo-search" className="sr-only">
            Search repositories
          </label>
          <input
            id="repo-search"
            type="text"
            value={localQuery}
            onChange={handleSearchChange}
            placeholder="Search repositories..."
            className="w-full sm:w-64 px-4 py-2 pl-10 bg-surface border border-border rounded-lg text-sm text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            aria-label="Search repositories by name, description, or language"
            aria-describedby="search-hint"
            autoComplete="off"
          />
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted/60"
            aria-hidden="true"
          />
          <span id="search-hint" className="sr-only">
            Search filters automatically as you type. Debounced by 300ms for
            better performance.
          </span>
        </div>

        {/* Sort */}
        <div
          className="flex gap-2 bg-surface rounded-lg p-1 border border-border"
          role="group"
          aria-label="Sort repositories"
        >
          <button
            onClick={() => onSortChange("stars")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              sortBy === "stars"
                ? "bg-primary text-background"
                : "text-muted hover:text-foreground"
            }`}
            aria-pressed={sortBy === "stars"}
            aria-label="Sort by stars"
          >
            ⭐ Stars
          </button>
          <button
            onClick={() => onSortChange("recent")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              sortBy === "recent"
                ? "bg-primary text-background"
                : "text-muted hover:text-foreground"
            }`}
            aria-pressed={sortBy === "recent"}
            aria-label="Sort by recently updated"
          >
            🕒 Recent
          </button>
        </div>
      </div>
    </div>
  );
});

export default RepoTableHeader;
