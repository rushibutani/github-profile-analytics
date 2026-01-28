import { Suspense } from "react";
import SearchForm from "../../components/layout/SearchForm";
import { GitHubIcon } from "../../components/ui";

interface SearchHeaderProps {
  hasResults?: boolean;
}

export default function SearchHeader({
  hasResults = false,
}: SearchHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {hasResults && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                <GitHubIcon size={16} className="text-foreground/60" />
              </div>
              <h1 className="text-lg font-medium text-foreground/90">
                GitHub Analytics
              </h1>
            </div>
          )}
          <Suspense
            fallback={
              <div className="h-10 w-80 bg-surface/50 animate-pulse rounded-xl" />
            }
          >
            <SearchForm />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
