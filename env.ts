/**
 * Environment variables with runtime validation
 * This ensures type safety and catches missing variables at startup
 */

// Simple validation without external dependencies
function validateEnv() {
  const errors: string[] = [];

  // Optional: GitHub token for higher rate limits
  const githubToken = process.env.GITHUB_TOKEN;

  // Validate GitHub token format if provided
  if (githubToken && githubToken.trim() === "") {
    errors.push("GITHUB_TOKEN cannot be empty if provided");
  }

  // Validate NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && !["development", "production", "test"].includes(nodeEnv)) {
    errors.push(`Invalid NODE_ENV: ${nodeEnv}`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }

  return {
    GITHUB_TOKEN: githubToken,
    NODE_ENV:
      (nodeEnv as "development" | "production" | "test") || "development",
  };
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment access
export type Env = typeof env;
