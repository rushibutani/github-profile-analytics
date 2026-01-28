"use client";

import { useState, useTransition } from "react";
import { fetchGitHubAnalytics } from "./actions/github";
import { GitHubAnalytics, ApiError } from "../types/github";
import ProfileCard from "../components/ProfileCard";
import ContributionChart from "../components/ContributionChart";
import LanguageChart from "../components/LanguageChart";
import RepoTable from "../components/RepoTable";
import ActivityScore from "../components/ActivityScore";
import ErrorDisplay, { EmptyState } from "../components/ErrorDisplay";
import { DashboardSkeleton } from "../components/Skeletons";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [analytics, setAnalytics] = useState<GitHubAnalytics | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    setError(null);
    setAnalytics(null);

    startTransition(async () => {
      const result = await fetchGitHubAnalytics(username.trim());

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setAnalytics(result.data);
      }
    });
  };

  const handleRetry = () => {
    setError(null);
    if (username.trim()) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Only shown when no results */}
      {!analytics && (
        <div className="bg-gradient-to-b from-surface/50 to-transparent border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface/80 mb-6">
              <svg
                className="w-8 h-8 text-foreground/60"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              GitHub Profile Analytics
            </h1>
            <p className="text-lg text-muted max-w-xl mx-auto">
              Discover insights about any GitHub profile — contributions,
              languages, and project highlights
            </p>
          </div>
        </div>
      )}

      {/* Search Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {analytics && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-foreground/60"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <h1 className="text-lg font-medium text-foreground/90">
                  GitHub Analytics
                </h1>
              </div>
            )}

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex gap-2 w-full sm:w-auto"
            >
              <div className="relative flex-1 sm:w-80">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-4 py-2.5 pl-10 bg-card border border-border rounded-xl text-foreground text-sm placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  disabled={isPending}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted/60"
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
              <button
                type="submit"
                disabled={isPending || !username.trim()}
                className="px-5 py-2.5 bg-primary text-background text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Analyzing</span>
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPending && <DashboardSkeleton />}

        {!isPending && error && (
          <ErrorDisplay error={error} onRetry={handleRetry} />
        )}

        {!isPending && !error && !analytics && <EmptyState />}

        {!isPending && !error && analytics && (
          <div className="space-y-6">
            {/* Profile Overview */}
            <ProfileCard profile={analytics.profile} />

            {/* Analytics Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ActivityScore activity={analytics.activity} />
              <ContributionChart contributions={analytics.contributions} />
            </div>

            {/* Language Distribution */}
            <LanguageChart languages={analytics.languages} />

            {/* Repository Table */}
            <RepoTable repositories={analytics.repositories} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <p>
              Built with Next.js · Data from{" "}
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                GitHub API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
