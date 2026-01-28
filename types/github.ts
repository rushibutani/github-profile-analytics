// GitHub API Response Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  size: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

// Transformed Data Types for UI Components
export interface ProfileData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  accountAge: string;
  location: string;
  company: string;
  blog: string;
  twitterUsername: string;
  profileUrl: string;
  joinDate: string;
}

export interface LanguageStats {
  language: string;
  percentage: number;
  bytes: number;
  color: string;
}

export interface RepositoryDisplay {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  updatedAt: string;
  isStale: boolean;
  url: string;
}

export interface ActivityMetrics {
  score: number;
  totalContributions: number;
  averageContributionsPerMonth: number;
  mostActiveMonth: string;
  recentActivityLevel: "high" | "medium" | "low" | "none";
  totalStars: number;
  activeReposCount: number;
}

export interface GitHubAnalytics {
  profile: ProfileData;
  languages: LanguageStats[];
  repositories: RepositoryDisplay[];
  contributions: ContributionCalendar;
  activity: ActivityMetrics;
}

export interface ApiError {
  message: string;
  status: number;
  type: "not_found" | "rate_limit" | "server_error" | "network_error";
}
