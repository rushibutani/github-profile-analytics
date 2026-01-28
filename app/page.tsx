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
      {/* Hero Section */}
      {!analytics && (
        <div className="border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              GitHub Profile Analytics
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Understand contribution patterns, tech focus, and repository
              activity — all in one dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub Analytics
              </h1>
              <p className="text-sm text-muted mt-1">
                Actionable GitHub insights for developers and recruiters
              </p>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username..."
                  className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  disabled={isPending}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted"
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
                className="px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
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
                    Analyzing
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <ContributionChart contributions={analytics.contributions} />
              <ActivityScore activity={analytics.activity} />
            </div>

            {/* Language Distribution */}
            <LanguageChart languages={analytics.languages} />

            {/* Repository Table */}
            <RepoTable repositories={analytics.repositories} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p>
              Data sourced from{" "}
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                GitHub REST API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
