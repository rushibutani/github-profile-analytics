import { ActivityMetrics } from "../../types/github";

/**
 * Get color based on activity score
 */
export function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#9ca3af";
}

/**
 * Get activity level label
 */
export function getActivityLevelLabel(
  level: ActivityMetrics["recentActivityLevel"]
): string {
  const labels = {
    high: "Highly Active",
    medium: "Moderately Active",
    low: "Low Activity",
    none: "Low Activity",
  };
  return labels[level];
}

/**
 * Get activity level color
 */
export function getActivityLevelColor(
  level: ActivityMetrics["recentActivityLevel"]
): string {
  const colors = {
    high: "text-success",
    medium: "text-warning",
    low: "text-warning",
    none: "text-muted",
  };
  return colors[level];
}
