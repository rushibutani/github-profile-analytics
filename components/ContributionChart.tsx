"use client";

import { ContributionCalendar } from "../types/github";
import { useState } from "react";

interface ContributionChartProps {
  contributions: ContributionCalendar;
}

export default function ContributionChart({
  contributions,
}: ContributionChartProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
  } | null>(null);

  // Get month labels for the x-axis
  const monthLabels = getMonthLabels(contributions);

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-foreground">
            Contribution Activity
          </h2>
          <div className="text-sm text-muted font-mono">
            {contributions.totalContributions.toLocaleString()} contributions in
            the last year
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted leading-relaxed flex items-start gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
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
          <span>
            Each square represents a day. Darker colors indicate more
            contributions on that date.
          </span>
        </p>

        {/* Heatmap */}
        <div className="relative">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-2 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-[10px] text-muted font-mono"
                style={{ width: `${label.width * 15}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] text-[10px] text-muted font-mono justify-around pr-2">
              <div>Mon</div>
              <div className="opacity-0">Wed</div>
              <div>Wed</div>
              <div className="opacity-0">Fri</div>
              <div>Fri</div>
              <div className="opacity-0">Sun</div>
              <div>Sun</div>
            </div>

            {/* Weeks */}
            <div className="flex gap-[3px] overflow-x-auto pb-2">
              {contributions.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.contributionDays.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-[12px] h-[12px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-accent"
                      style={{
                        backgroundColor: getLevelColor(day.level),
                      }}
                      onMouseEnter={() =>
                        setHoveredDay({ date: day.date, count: day.count })
                      }
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.count} contributions on ${formatDate(day.date)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {hoveredDay && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background px-3 py-2 rounded text-xs font-mono whitespace-nowrap shadow-lg">
              <div className="font-bold">{hoveredDay.count} contributions</div>
              <div className="text-[10px] opacity-80">
                {formatDate(hoveredDay.date)}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted">Less</div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: getLevelColor(level as 0 | 1 | 2 | 3 | 4),
                }}
              />
            ))}
          </div>
          <div className="text-xs text-muted">More</div>
        </div>
      </div>
    </div>
  );
}

function getLevelColor(level: 0 | 1 | 2 | 3 | 4): string {
  const colors = {
    0: "rgba(255, 255, 255, 0.05)",
    1: "rgba(0, 255, 136, 0.2)",
    2: "rgba(0, 255, 136, 0.4)",
    3: "rgba(0, 255, 136, 0.6)",
    4: "rgba(0, 255, 136, 0.9)",
  };
  return colors[level];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getMonthLabels(
  contributions: ContributionCalendar,
): Array<{ month: string; width: number }> {
  const labels: Array<{ month: string; width: number }> = [];
  let currentMonth = "";
  let weekCount = 0;

  contributions.weeks.forEach((week) => {
    if (week.contributionDays.length > 0) {
      const date = new Date(week.contributionDays[0].date);
      const month = date.toLocaleDateString("en-US", { month: "short" });

      if (month !== currentMonth) {
        if (currentMonth && weekCount > 0) {
          labels.push({ month: currentMonth, width: weekCount });
        }
        currentMonth = month;
        weekCount = 1;
      } else {
        weekCount++;
      }
    }
  });

  if (currentMonth && weekCount > 0) {
    labels.push({ month: currentMonth, width: weekCount });
  }

  return labels;
}
