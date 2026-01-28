'use server';

import {
  fetchUserProfile,
  fetchUserRepositories,
  fetchRepositoryLanguages,
  generateContributionCalendar,
  GitHubApiError,
} from '../../lib/github-api';
import { transformGitHubData } from '../../lib/transformers';
import { GitHubAnalytics, ApiError } from '../../types/github';

export async function fetchGitHubAnalytics(
  username: string
): Promise<{ data?: GitHubAnalytics; error?: ApiError }> {
  try {
    // Validate input
    if (!username || username.trim().length === 0) {
      return {
        error: {
          message: 'Please enter a valid GitHub username',
          status: 400,
          type: 'not_found',
        },
      };
    }

    // Sanitize username
    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9-]/g, '');
    
    if (cleanUsername !== username.trim()) {
      return {
        error: {
          message: 'Username contains invalid characters',
          status: 400,
          type: 'not_found',
        },
      };
    }

    // Fetch user profile
    const user = await fetchUserProfile(cleanUsername);

    // Fetch repositories
    const repositories = await fetchUserRepositories(cleanUsername);

    // Fetch language data for each repository (non-forked only)
    const languagesData = new Map<string, Record<string, number>>();
    const nonForkedRepos = repositories.filter(repo => !repo.fork);
    
    // Limit to top 30 repos to avoid excessive API calls
    const reposToAnalyze = nonForkedRepos.slice(0, 30);
    
    await Promise.all(
      reposToAnalyze.map(async (repo) => {
        try {
          const languages = await fetchRepositoryLanguages(
            cleanUsername,
            repo.name
          );
          languagesData.set(repo.full_name, languages);
        } catch (error) {
          // Skip repositories with language fetch errors
          console.error(`Failed to fetch languages for ${repo.name}:`, error);
        }
      })
    );

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
        message: 'An unexpected error occurred',
        status: 500,
        type: 'server_error',
      },
    };
  }
}
