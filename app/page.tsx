import { Suspense } from "react";
import type { Metadata } from "next";
import ClientPage from "./ClientPage";
import { fetchGitHubAnalytics } from "./actions/github";

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

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ClientPage />
    </Suspense>
  );
}
