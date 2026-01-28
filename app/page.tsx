import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { fetchGitHubAnalytics } from "./actions/github";
import ProfileCard from "../components/features/ProfileCard";

// Lazy-load heavy chart components for better performance
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
const RepoTable = dynamic(() => import("../components/features/RepoTable"), {
  loading: () => (
    <div className="h-96 bg-card border border-border/50 rounded-2xl animate-pulse" />
  ),
});
import ErrorDisplay, { EmptyState } from "../components/ui/ErrorDisplay";
import {
  DashboardSkeleton,
  ActivityGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "../components/ui/Skeletons";
import SearchForm from "../components/layout/SearchForm";
import { ComponentErrorBoundary } from "../components/ui/ComponentErrorBoundary";

interface PageProps {
  searchParams: Promise<{ user?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const username = params.user;

  if (!username) {
    return {
      title: "GitHub Profile Analytics | Developer Insights Dashboard",
      description:
        "Transform GitHub data into meaningful insights. Analyze contributions, languages, and repository activity.",
    };
  }

  // Try to fetch basic info for better metadata (silent fail)
  try {
    const result = await fetchGitHubAnalytics(username);
    if (result.data) {
      const { profile } = result.data;
      return {
        title: `${profile.name} (@${profile.username}) | GitHub Analytics`,
        description: `GitHub profile analytics for ${profile.name}. ${profile.publicRepos} repositories, ${profile.followers} followers. View contribution patterns and language distribution.`,
        openGraph: {
          title: `${profile.name}'s GitHub Analytics`,
          description:
            profile.bio ||
            `View ${profile.name}'s GitHub profile analytics and insights`,
          images: [profile.avatarUrl],
        },
      };
    }
  } catch (error) {
    // Silent fail - use default metadata
  }

  return {
    title: `@${username} | GitHub Profile Analytics`,
    description: `View GitHub profile analytics and insights for @${username}`,
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const username = params.user;

  // If no username, show empty state
  if (!username) {
    return (
      <div className="min-h-screen bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Skip to main content
        </a>
        <HeroSection />
        <SearchHeader />
        <main
          id="main-content"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <EmptyState />
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch analytics server-side
  const result = await fetchGitHubAnalytics(username);

  // Handle error state
  if (result.error) {
    return (
      <div className="min-h-screen bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Skip to main content
        </a>
        <SearchHeader hasResults />
        <main
          id="main-content"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <ErrorDisplay error={result.error} username={username} />
        </main>
        <Footer />
      </div>
    );
  }

  // Render analytics dashboard
  const analytics = result.data!;

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to main content
      </a>
      <SearchHeader hasResults />
      <main
        id="main-content"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="space-y-6">
          {/* Profile Overview - Fast to load */}
          <ProfileCard profile={analytics.profile} />

          {/* Analytics Grid - May take time */}
          <Suspense fallback={<ActivityGridSkeleton />}>
            <div className="grid lg:grid-cols-2 gap-6">
              <ComponentErrorBoundary componentName="Activity Score">
                <ActivityScore activity={analytics.activity} />
              </ComponentErrorBoundary>
              <ComponentErrorBoundary componentName="Contribution Chart">
                <ContributionChart contributions={analytics.contributions} />
              </ComponentErrorBoundary>
            </div>
          </Suspense>

          {/* Language Distribution - Depends on language fetch */}
          <Suspense fallback={<ChartSkeleton />}>
            <ComponentErrorBoundary componentName="Language Chart">
              <LanguageChart languages={analytics.languages} />
            </ComponentErrorBoundary>
          </Suspense>

          {/* Repository Table */}
          <Suspense fallback={<TableSkeleton />}>
            <ComponentErrorBoundary componentName="Repository Table">
              <RepoTable repositories={analytics.repositories} />
            </ComponentErrorBoundary>
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-surface/50 to-transparent border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface/80 mb-6">
          <svg
            className="w-8 h-8 text-foreground/60"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          GitHub Profile Analytics
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto">
          Discover insights about any GitHub profile — contributions, languages,
          and project highlights
        </p>
      </div>
    </div>
  );
}

function SearchHeader({ hasResults = false }: { hasResults?: boolean }) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {hasResults && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-foreground/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
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

function Footer() {
  return (
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
  );
}
