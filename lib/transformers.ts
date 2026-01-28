import {
  GitHubUser,
  GitHubRepository,
  ProfileData,
  LanguageStats,
  RepositoryDisplay,
  ActivityMetrics,
  GitHubAnalytics,
  ContributionCalendar,
} from "../types/github";
import { getLanguageColor } from "./github-api";

/**
 * Calculate account age in human-readable format
 */
function calculateAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0) {
    return months > 0 ? `${years}y ${months}mo` : `${years}y`;
  }
  return months > 0 ? `${months}mo` : `${diffDays}d`;
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if repository is stale (not updated in 6+ months)
 */
function isRepositoryStale(updatedAt: string): boolean {
  const updated = new Date(updatedAt);
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate()
  );
  return updated < sixMonthsAgo;
}

/**
 * Transform GitHub user data to profile display format
 */
export function transformProfile(user: GitHubUser): ProfileData {
  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio || "",
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    accountAge: calculateAccountAge(user.created_at),
    location: user.location || "",
    company: user.company || "",
    blog: user.blog || "",
    twitterUsername: user.twitter_username || "",
    profileUrl: user.html_url,
    joinDate: formatDate(user.created_at),
  };
}

/**
 * Aggregate language statistics across all repositories
 */
export function aggregateLanguageStats(
  repositories: GitHubRepository[],
  languagesData: Map<string, Record<string, number>>
): LanguageStats[] {
  const languageTotals = new Map<string, number>();

  // Filter out forked repositories
  const ownRepos = repositories.filter((repo) => !repo.fork);

  // Aggregate language bytes
  ownRepos.forEach((repo) => {
    const repoLanguages = languagesData.get(repo.full_name);
    if (repoLanguages) {
      Object.entries(repoLanguages).forEach(([language, bytes]) => {
        const current = languageTotals.get(language) || 0;
        languageTotals.set(language, current + bytes);
      });
    }
  });

  // Calculate total bytes
  const totalBytes = Array.from(languageTotals.values()).reduce(
    (sum, bytes) => sum + bytes,
    0
  );

  // Transform to percentage-based stats
  const stats: LanguageStats[] = Array.from(languageTotals.entries())
    .map(([language, bytes]) => ({
      language,
      percentage: (bytes / totalBytes) * 100,
      bytes,
      color: getLanguageColor(language),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10); // Top 10 languages

  return stats;
}

/**
 * Transform repositories for display table
 */
export function transformRepositories(
  repositories: GitHubRepository[]
): RepositoryDisplay[] {
  return repositories
    .filter((repo) => !repo.fork) // Exclude forks
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description provided",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "Unknown",
      languageColor: getLanguageColor(repo.language || ""),
      updatedAt: formatDate(repo.updated_at),
      isStale: isRepositoryStale(repo.updated_at),
      url: repo.html_url,
    }))
    .sort((a, b) => b.stars - a.stars); // Sort by stars
}

/**
 * Calculate activity score and metrics
 */
export function calculateActivityMetrics(
  repositories: GitHubRepository[],
  contributions: ContributionCalendar
): ActivityMetrics {
  const now = new Date();
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate()
  );

  // Count active repositories (updated in last 6 months)
  const activeRepos = repositories.filter(
    (repo) => new Date(repo.updated_at) > threeMonthsAgo
  );

  // Calculate total stars
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // Find most active month
  const monthlyContributions = new Map<string, number>();
  contributions.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      const month = day.date.substring(0, 7); // YYYY-MM
      const current = monthlyContributions.get(month) || 0;
      monthlyContributions.set(month, current + day.count);
    });
  });

  const mostActiveMonth = Array.from(monthlyContributions.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const mostActiveMonthName = mostActiveMonth
    ? new Date(mostActiveMonth[0]).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  // Calculate average contributions per month
  const averageContributionsPerMonth = contributions.totalContributions / 12;

  // Determine recent activity level
  let recentActivityLevel: ActivityMetrics["recentActivityLevel"] = "none";
  if (averageContributionsPerMonth > 50) recentActivityLevel = "high";
  else if (averageContributionsPerMonth > 20) recentActivityLevel = "medium";
  else if (averageContributionsPerMonth > 5) recentActivityLevel = "low";

  // Calculate composite activity score (0-100)
  const contributionScore = Math.min(
    (contributions.totalContributions / 500) * 40,
    40
  );
  const starScore = Math.min((totalStars / 100) * 30, 30);
  const recentActivityScore = Math.min((activeRepos.length / 10) * 30, 30);

  const score = Math.round(contributionScore + starScore + recentActivityScore);

  return {
    score,
    totalContributions: contributions.totalContributions,
    averageContributionsPerMonth: Math.round(averageContributionsPerMonth),
    mostActiveMonth: mostActiveMonthName,
    recentActivityLevel,
    totalStars,
    activeReposCount: activeRepos.length,
  };
}

/**
 * Main transformer: combine all data into analytics dashboard data
 */
export function transformGitHubData(
  user: GitHubUser,
  repositories: GitHubRepository[],
  languagesData: Map<string, Record<string, number>>,
  contributions: ContributionCalendar
): GitHubAnalytics {
  return {
    profile: transformProfile(user),
    languages: aggregateLanguageStats(repositories, languagesData),
    repositories: transformRepositories(repositories),
    contributions,
    activity: calculateActivityMetrics(repositories, contributions),
  };
}
