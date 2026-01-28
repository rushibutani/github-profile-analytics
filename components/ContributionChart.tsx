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

  // Check if activity is low
  const isLowActivity = contributions.totalContributions < 100;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground/90">
            Contribution Activity
          </h2>
          <div className="text-sm text-muted">
            {contributions.totalContributions.toLocaleString()} contributions
          </div>
        </div>

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
                      className="w-[12px] h-[12px] rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:scale-110"
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
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-card px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg">
              <div className="font-semibold">
                {hoveredDay.count} contributions
              </div>
              <div className="text-[10px] opacity-75">
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
    0: "rgba(255, 255, 255, 0.03)",
    1: "rgba(100, 116, 139, 0.3)", // muted slate
    2: "rgba(100, 116, 139, 0.5)",
    3: "rgba(100, 116, 139, 0.7)",
    4: "rgba(34, 197, 94, 0.6)", // accent only for highest
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
