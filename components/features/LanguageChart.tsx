"use client";

import { LanguageStats } from "../../types/github";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatBytes } from "../../lib/utils/formatting";
import { Card, EmptyState } from "../ui";

interface LanguageChartProps {
  languages: LanguageStats[];
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (languages.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-medium text-foreground/90 mb-4">
          Language Distribution
        </h2>
        <EmptyState
          size="md"
          title="No language data available"
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          }
        />
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData = languages.map((lang) => ({
    name: lang.language,
    value: lang.percentage,
    bytes: lang.bytes,
    color: lang.color,
  }));

  // Determine primary language focus for insight
  const primaryLanguage = languages[0];
  const getLanguageInsight = (): string => {
    if (languages.length === 1) {
      return `Specialized in ${primaryLanguage.language} development`;
    }
    if (primaryLanguage.percentage > 50) {
      return `Primary focus: ${primaryLanguage.language}-based development`;
    }
    const topTwo = languages
      .slice(0, 2)
      .map((l) => l.language)
      .join(" and ");
    return `Versatile developer working with ${topTwo}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-foreground text-card px-3 py-2 rounded-lg shadow-lg text-xs">
          <p className="font-semibold">{data.name}</p>
          <p>{data.value.toFixed(1)}%</p>
          <p className="text-[10px] opacity-75">{formatBytes(data.bytes)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="interactive">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-foreground/90">
          Language Distribution
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recharts Donut Chart */}
        <div
          className="flex items-center justify-center"
          role="img"
          aria-label="Language distribution pie chart"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.3
                    }
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Language List */}
        <div
          className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin"
          role="list"
          aria-label="Programming languages used"
        >
          {languages.map((lang, index) => (
            <button
              key={lang.language}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-2"
              style={{
                backgroundColor:
                  activeIndex === index
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              aria-label={`${lang.language}: ${lang.percentage.toFixed(1)}% (${formatBytes(lang.bytes)})`}
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: lang.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-foreground">
                  {lang.language}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">
                  {formatBytes(lang.bytes)}
                </span>
                <span className="text-sm font-semibold text-foreground min-w-[50px] text-right">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted">{getLanguageInsight()}</p>
      </div>
    </Card>
  );
}
