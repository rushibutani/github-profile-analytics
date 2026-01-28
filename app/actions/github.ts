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
import { REPO_LIMITS } from "../../lib/constants/thresholds";
import { logger } from "../../lib/utils/logger";

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
  let cleanUsername = username; // Declare in outer scope for error logging

  try {
    // Validate input
    if (!username || username.trim().length === 0) {
      return {
        error: {
          message: "Please enter a GitHub username",
          status: 400,
          type: "not_found",
        },
      };
    }

    // Sanitize username to prevent injection
    cleanUsername = username.trim().replace(/[^a-zA-Z0-9-]/g, "");

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
    logger.info("Fetching GitHub profile", { username: cleanUsername });
    const user = await fetchUserProfile(cleanUsername);

    // Fetch repositories
    const repositories = await fetchUserRepositories(cleanUsername);

    // Fetch language data for each repository (non-forked only)
    const languagesData = new Map<string, Record<string, number>>();
    const nonForkedRepos = repositories.filter((repo) => !repo.fork);

    // Limit to top repos to conserve API rate limit
    const reposToAnalyze = nonForkedRepos.slice(
      0,
      REPO_LIMITS.API_ANALYSIS_LIMIT
    );

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
        // Log but don't fail - some repos may not have language data
        logger.warn("Failed to fetch repository languages", {
          username: cleanUsername,
          repo: repo.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
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
      logger.error("GitHub API error", error, {
        username: cleanUsername,
        status: error.status,
        type: error.type,
      });
      return {
        error: {
          message: error.message,
          status: error.status,
          type: error.type,
        },
      };
    }

    logger.error("Unexpected error in fetchGitHubAnalytics", error as Error, {
      username: cleanUsername,
    });
    return {
      error: {
        message: "An unexpected error occurred",
        status: 500,
        type: "server_error",
      },
    };
  }
}
