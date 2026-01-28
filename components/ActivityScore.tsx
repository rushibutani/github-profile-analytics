"use client";

import { ActivityMetrics } from "../types/github";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface ActivityScoreProps {
  activity: ActivityMetrics;
}

export default function ActivityScore({ activity }: ActivityScoreProps) {
  const scorePercentage = activity.score;

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "#00ff88";
    if (score >= 40) return "#fbbf24";
    return "#94a3b8";
  };

  const getActivityLevelLabel = (
    level: ActivityMetrics["recentActivityLevel"],
  ): string => {
    const labels = {
      high: "Highly Active",
      medium: "Moderately Active",
      low: "Low Activity",
      none: "Low Activity",
    };
    return labels[level];
  };

  const getActivityLevelColor = (
    level: ActivityMetrics["recentActivityLevel"],
  ): string => {
    const colors = {
      high: "text-green-400",
      medium: "text-yellow-400",
      low: "text-orange-400",
      none: "text-muted",
    };
    return colors[level];
  };

  // Prepare data for Recharts
  const chartData = [
    {
      name: "Activity",
      value: scorePercentage,
      fill: getScoreColor(scorePercentage),
    },
  ];

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-extrabold text-foreground">
              Activity Score
            </h2>
            <button
              className="group relative text-muted hover:text-foreground transition-colors"
              title="Learn about activity score"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Composite metric based on contributions
              </span>
            </button>
          </div>
          <div
            className={`text-sm font-medium ${getActivityLevelColor(activity.recentActivityLevel)} opacity-80`}
          >
            {getActivityLevelLabel(activity.recentActivityLevel)}
          </div>
        </div>

        {/* Score Circle and Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recharts Radial Progress */}
          <div className="flex items-center justify-center relative">
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "rgba(255, 255, 255, 0.03)" }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={getScoreColor(scorePercentage)}
                  fillOpacity={0.6}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="text-3xl font-mono font-medium opacity-70"
                  style={{ color: getScoreColor(scorePercentage) }}
                >
                  {scorePercentage}
                </div>
                <div className="text-xs text-muted uppercase tracking-wider mt-1">
                  Score
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Total Contributions"
              value={activity.totalContributions.toLocaleString()}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Avg / Month"
              value={activity.averageContributionsPerMonth.toString()}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Total Stars"
              value={activity.totalStars.toLocaleString()}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Active Repos"
              value={activity.activeReposCount.toString()}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Most Active Month */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Most Active Month</span>
            <span className="text-sm font-mono font-bold text-accent">
              {activity.mostActiveMonth}
            </span>
          </div>
        </div>

        {/* Guidance Message */}
        <div className="pt-4 border-t border-border">
          {activity.recentActivityLevel === "none" ||
          activity.recentActivityLevel === "low" ? (
            <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-foreground leading-relaxed space-y-2">
                <p className="font-semibold">Low activity detected</p>
                <p className="text-xs text-muted">
                  Push code regularly, maintain active repositories, and engage
                  with the community to improve contribution insights.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-medium text-foreground">
                About this score:
              </span>{" "}
              Reflects platform activity patterns including contribution
              frequency, repository maintenance, and community engagement. This
              metric measures GitHub activity, not developer capability.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="p-4 bg-accent/5 rounded-lg border border-border/50 space-y-2">
      <div className="text-muted">{icon}</div>
      <div className="text-2xl font-mono font-bold text-foreground">
        {value}
      </div>
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
