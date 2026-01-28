import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { fetchGitHubAnalytics } from "./actions/github";
import ProfileCard from "../components/features/ProfileCard";
import HeroSection from "./_components/HeroSection";
import SearchHeader from "./_components/SearchHeader";
import Footer from "./_components/Footer";

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
const RepoTable = dynamic(
  () => import("../components/features/repositories/RepoTable"),
  {
    loading: () => (
      <div className="h-96 bg-card border border-border/50 rounded-2xl animate-pulse" />
    ),
  }
);
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
