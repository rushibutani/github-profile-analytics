"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProfileCard from "../components/features/ProfileCard";
import Footer from "./_components/Footer";
import { fetchGitHubAnalytics } from "./actions/github";
import type { GitHubAnalytics, ApiError } from "../types/github";
import ErrorDisplay, { EmptyState } from "../components/ui/ErrorDisplay";
import { ComponentErrorBoundary } from "../components/ui/ComponentErrorBoundary";
import {
  ActivityGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "../components/ui/Skeletons";
import { SearchIcon, SpinnerIcon, GitHubIcon } from "../components/ui";

// Lazy-load heavy chart components
const ContributionChart = dynamic(
  () => import("../components/features/ContributionChart"),
  {
    loading: () => (
      <div className="h-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
    ),
  }
);
const LanguageChart = dynamic(
  () => import("../components/features/LanguageChart"),
  {
    loading: () => (
      <div className="h-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
    ),
  }
);
const ActivityScore = dynamic(
  () => import("../components/features/ActivityScore"),
  {
    loading: () => (
      <div className="h-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
    ),
  }
);
const RepoTable = dynamic(
  () => import("../components/features/repositories/RepoTable"),
  {
    loading: () => (
      <div className="h-96 bg-card border border-border/50 rounded-2xl animate-pulse" />
    ),
  }
);

type PageState = "empty" | "loading" | "error" | "success";

export default function ClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUser = searchParams.get("user");

  const [username, setUsername] = useState(initialUser || "");
  const [searchValue, setSearchValue] = useState(initialUser || "");
  const [pageState, setPageState] = useState<PageState>(
    initialUser ? "loading" : "empty"
  );
  const [analytics, setAnalytics] = useState<GitHubAnalytics | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch analytics when username changes
  useEffect(() => {
    if (username) {
      fetchAnalytics(username);
    }
  }, []);

  const fetchAnalytics = async (user: string) => {
    setPageState("loading");
    setError(null);

    try {
      const result = await fetchGitHubAnalytics(user);

      if (result.error) {
        setError(result.error);
        setPageState("error");
      } else if (result.data) {
        setAnalytics(result.data);
        setPageState("success");
        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (err) {
      setError({
        type: "unknown",
        message: "An unexpected error occurred",
      });
      setPageState("error");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = searchValue.trim();

    if (!trimmedUsername) return;

    setUsername(trimmedUsername);
    // Update URL without navigation
    router.push(`/?user=${encodeURIComponent(trimmedUsername)}`, {
      scroll: false,
    });

    startTransition(() => {
      fetchAnalytics(trimmedUsername);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setUsername("");
    setPageState("empty");
    setAnalytics(null);
    setError(null);
    // Update URL without triggering server navigation
    if (searchParams.get("user")) {
      window.history.pushState({}, "", "/");
    }
    inputRef.current?.focus();
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with '/'
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      // Clear with Escape
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (searchValue) {
          setSearchValue("");
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchValue]);

  const isLoading = pageState === "loading" || isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to main content
      </a>

      {/* Consistent Sticky Header - Always Same Layout */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleClear}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                <GitHubIcon size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  GitHub Analytics
                </h1>
                <p className="text-xs text-muted">
                  Discover developer insights
                </p>
              </div>
            </button>

            {/* Search Form - Always Visible */}
            <form
              onSubmit={handleSearch}
              className="flex gap-2 w-full sm:w-auto"
              role="search"
            >
              <div className="relative flex-1 sm:w-80">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter GitHub username..."
                  className="w-full px-4 py-2.5 pl-10 bg-background border border-border rounded-xl text-foreground text-sm placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  disabled={isLoading}
                  aria-label="GitHub username"
                  autoComplete="off"
                  spellCheck="false"
                />
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted/60"
                  aria-hidden="true"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchValue.trim()}
                className="px-5 py-2.5 bg-primary text-background text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                aria-label="Analyze GitHub profile"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon aria-hidden="true" />
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
      <main
        id="main-content"
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Empty State */}
        {pageState === "empty" && (
          <div className="animate-fade-in">
            <EmptyState />
          </div>
        )}

        {/* Loading State */}
        {pageState === "loading" && (
          <div className="animate-fade-in space-y-6">
            <div className="h-48 bg-card border border-border/50 rounded-2xl animate-pulse" />
            <ActivityGridSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
          </div>
        )}

        {/* Error State */}
        {pageState === "error" && error && (
          <div className="animate-fade-in" ref={resultsRef}>
            <ErrorDisplay error={error} username={username} />
          </div>
        )}

        {/* Success State - Analytics Dashboard */}
        {pageState === "success" && analytics && (
          <div className="animate-fade-in space-y-6" ref={resultsRef}>
            {/* Profile Overview */}
            <ProfileCard profile={analytics.profile} />

            {/* Analytics Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ComponentErrorBoundary componentName="Activity Score">
                <ActivityScore activity={analytics.activity} />
              </ComponentErrorBoundary>
              <ComponentErrorBoundary componentName="Contribution Chart">
                <ContributionChart contributions={analytics.contributions} />
              </ComponentErrorBoundary>
            </div>

            {/* Language Distribution */}
            <ComponentErrorBoundary componentName="Language Chart">
              <LanguageChart languages={analytics.languages} />
            </ComponentErrorBoundary>

            {/* Repository Table */}
            <ComponentErrorBoundary componentName="Repository Table">
              <RepoTable repositories={analytics.repositories} />
            </ComponentErrorBoundary>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
