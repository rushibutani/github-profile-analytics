"use client";

import { ActivityMetrics } from "../../types/github";
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
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#f59e0b";
    return "#9ca3af";
  };

  const getActivityLevelLabel = (
    level: ActivityMetrics["recentActivityLevel"]
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
    level: ActivityMetrics["recentActivityLevel"]
  ): string => {
    const colors = {
      high: "text-success",
      medium: "text-warning",
      low: "text-warning",
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
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground/90">
            Activity Score
          </h2>
          <div
            className={`text-sm font-medium ${getActivityLevelColor(activity.recentActivityLevel)}`}
          >
            {getActivityLevelLabel(activity.recentActivityLevel)}
          </div>
        </div>

        {/* Score Circle and Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recharts Radial Progress */}
          <div
            className="flex items-center justify-center relative"
            role="img"
            aria-label={`Activity score: ${scorePercentage} out of 100`}
          >
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
                  background={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={getScoreColor(scorePercentage)}
                  fillOpacity={0.9}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="text-4xl font-bold"
                  style={{ color: getScoreColor(scorePercentage) }}
                  aria-hidden="true"
                >
                  {scorePercentage}
                </div>
                <div className="text-xs text-muted mt-1" aria-hidden="true">
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Most Active Month</span>
            <span className="font-semibold text-foreground">
              {activity.mostActiveMonth}
            </span>
          </div>
        </div>

        {/* Guidance Message */}
        {(activity.recentActivityLevel === "none" ||
          activity.recentActivityLevel === "low") && (
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
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
            <div className="text-sm text-foreground space-y-1">
              <p className="font-medium">Low activity detected</p>
              <p className="text-xs text-muted">
                Regular contributions help build a stronger profile
              </p>
            </div>
          </div>
        )}
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
    <div className="space-y-2">
      <div className="text-muted">{icon}</div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
