/**
 * Get contribution level color for heatmap
 */
export function getLevelColor(level: 0 | 1 | 2 | 3 | 4): string {
  const colors = {
    0: "rgba(255, 255, 255, 0.03)",
    1: "rgba(100, 116, 139, 0.3)",
    2: "rgba(100, 116, 139, 0.5)",
    3: "rgba(100, 116, 139, 0.7)",
    4: "rgba(34, 197, 94, 0.6)",
  };
  return colors[level];
}
