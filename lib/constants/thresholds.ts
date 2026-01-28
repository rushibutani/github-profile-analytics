/**
 * Activity score thresholds
 */
export const ACTIVITY_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
  LOW: 0,
} as const;

/**
 * Repository analysis limits
 */
export const REPO_LIMITS = {
  API_ANALYSIS_LIMIT: 10,
  DISPLAY_TOP_LANGUAGES: 10,
} as const;

/**
 * Staleness thresholds (in days)
 */
export const STALENESS_DAYS = {
  ACTIVE: 30,
  MODERATE: 180,
} as const;

/**
 * Activity level thresholds
 */
export const ACTIVITY_LEVEL_THRESHOLDS = {
  HIGH: 50,
  MEDIUM: 20,
  LOW: 5,
} as const;

/**
 * Activity score calculation weights
 */
export const ACTIVITY_SCORE_WEIGHTS = {
  CONTRIBUTION_MAX: 40,
  CONTRIBUTION_DIVISOR: 500,
  STAR_MAX: 30,
  STAR_DIVISOR: 100,
  RECENT_ACTIVITY_MAX: 30,
  RECENT_ACTIVITY_DIVISOR: 10,
} as const;
