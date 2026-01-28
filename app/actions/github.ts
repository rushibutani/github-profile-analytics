"use server";

import {
  fetchUserProfile,
  fetchUserRepositories,
  fetchRepositoryLanguages,
  generateContributionCalendar,
  GitHubApiError,
} from "../../lib/github-api";
import { transformGitHubData } from "../../lib/transformers";
import { GitHubAnalytics, ApiError } from "../../types/github";

export interface FetchProgress {
  stage: "profile" | "repos" | "languages" | "contributions" | "complete";
  current?: number;
  total?: number;
  message: string;
}

export async function fetchGitHubAnalytics(username: string): Promise<{
  data?: GitHubAnalytics;
  error?: ApiError;
  progress?: FetchProgress;
}> {
  try {
    // Validate input
    if (!username || username.trim().length === 0) {
      return {
        error: {
          message: "Please enter a valid GitHub username",
          status: 400,
          type: "not_found",
        },
      };
    }

    // Sanitize username
    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9-]/g, "");

    if (cleanUsername !== username.trim()) {
      return {
        error: {
          message: "Username contains invalid characters",
          status: 400,
          type: "not_found",
        },
      };
    }

    // Fetch user profile
    const user = await fetchUserProfile(cleanUsername);

    // Fetch repositories
    const repositories = await fetchUserRepositories(cleanUsername);

    // Fetch language data for each repository (non-forked only)
    const languagesData = new Map<string, Record<string, number>>();
    const nonForkedRepos = repositories.filter((repo) => !repo.fork);

    // Limit to top 10 repos to conserve API rate limit (60/hour without token)
    // With a GitHub token, you get 5000/hour, so this is very conservative
    const reposToAnalyze = nonForkedRepos.slice(0, 10);

    // Track language fetching progress
    let completedRepos = 0;
    const totalRepos = reposToAnalyze.length;

    // Fetch languages with timeout and better error handling
    const languagePromises = reposToAnalyze.map(async (repo) => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        const languages = (await Promise.race([
          fetchRepositoryLanguages(cleanUsername, repo.name),
          timeoutPromise,
        ])) as Record<string, number>;

        languagesData.set(repo.full_name, languages);
        completedRepos++;
      } catch (error) {
        // Skip repositories with language fetch errors (timeout or API error)
        // This is expected behavior - some repos may not have language data
        completedRepos++;
      }
    });

    // Wait for all language fetches with overall timeout
    await Promise.race([
      Promise.all(languagePromises),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Language fetch timeout")), 20000)
      ),
    ]).catch(() => {
      // If overall timeout, continue with partial data
      // Better to show something than nothing
    });

    // Generate contribution calendar
    const contributions = await generateContributionCalendar(repositories);

    // Transform all data
    const analytics = transformGitHubData(
      user,
      repositories,
      languagesData,
      contributions
    );

    return { data: analytics };
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return {
        error: {
          message: error.message,
          status: error.status,
          type: error.type,
        },
      };
    }

    return {
      error: {
        message: "An unexpected error occurred",
        status: 500,
        type: "server_error",
      },
    };
  }
}
