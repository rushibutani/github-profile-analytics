"use client";

import { LanguageStats } from "../types/github";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LanguageChartProps {
  languages: LanguageStats[];
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (languages.length === 0) {
    return (
      <div className="bg-background border border-border rounded-lg p-6 animate-slide-up">
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Language Distribution
        </h2>
        <div className="flex items-center justify-center h-64 text-muted">
          <div className="text-center space-y-2">
            <svg
              className="w-16 h-16 mx-auto opacity-50"
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
            <p className="text-sm">No language data available</p>
          </div>
        </div>
      </div>
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

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-foreground text-background px-3 py-2 rounded shadow-lg text-xs">
          <p className="font-bold">{data.name}</p>
          <p>{data.value.toFixed(1)}%</p>
          <p className="text-[10px] opacity-80">{formatBytes(data.bytes)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-display font-extrabold text-foreground">
          Language Distribution
        </h2>
        <button
          className="group relative text-muted hover:text-foreground transition-colors"
          title="What this chart shows"
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
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Based on code bytes across repositories
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recharts Donut Chart */}
        <div className="flex items-center justify-center">
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
        <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
          {languages.map((lang, index) => (
            <div
              key={lang.language}
              className="flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer"
              style={{
                backgroundColor:
                  activeIndex === index
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {lang.language}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted font-mono">
                  {formatBytes(lang.bytes)}
                </span>
                <span className="text-sm font-mono font-bold text-accent min-w-[50px] text-right">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start gap-2 text-sm">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <div>
            <p className="font-semibold text-foreground mb-1">
              {getLanguageInsight()}
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Distribution reflects codebase composition across all repositories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
