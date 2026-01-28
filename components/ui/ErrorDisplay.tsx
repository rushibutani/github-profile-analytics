import { ApiError } from "../../types/github";
import Link from "next/link";

interface ErrorDisplayProps {
  error: ApiError;
  username?: string;
}

export default function ErrorDisplay({ error, username }: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case "not_found":
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
      case "rate_limit":
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "network_error":
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case "not_found":
        return "User Not Found";
      case "rate_limit":
        return "Rate Limit Exceeded";
      case "network_error":
        return "Connection Error";
      default:
        return "Something Went Wrong";
    }
  };

  const getErrorSuggestion = () => {
    switch (error.type) {
      case "not_found":
        return "Double-check the username and try again. GitHub usernames are case-sensitive.";
      case "rate_limit":
        return "GitHub has a limit on how many searches can be done in a short time. Please wait a few minutes and try again.";
      case "network_error":
        return "Unable to connect to GitHub. Check your internet connection and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  return (
    <div className="bg-gradient-to-br from-card to-surface border border-border rounded-2xl p-12 text-center animate-fade-in shadow-lg">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-red-400 flex justify-center">{getErrorIcon()}</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {getErrorTitle()}
          </h2>
          <p className="text-muted text-base">{error.message}</p>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
          <p className="text-sm text-foreground leading-relaxed">
            {getErrorSuggestion()}
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-all inline-flex items-center gap-2 shadow-sm"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Again
          </Link>
          {username && error.type !== "not_found" && (
            <Link
              href={`/?user=${encodeURIComponent(username)}`}
              className="px-6 py-3 bg-surface border border-border text-foreground font-medium rounded-xl hover:bg-surface-2 transition-all inline-flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState() {
  const exampleUsers = [
    "torvalds",
    "gaearon",
    "tj",
    "sindresorhus",
    "kentcdodds",
  ];
  const randomExample =
    exampleUsers[Math.floor(Math.random() * exampleUsers.length)];

  return (
    <div className="bg-gradient-to-br from-card to-surface border border-border rounded-2xl p-12 text-center animate-fade-in shadow-lg">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-primary/60 flex justify-center">
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-display font-bold text-foreground">
            Ready to Analyze GitHub Profiles
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Get instant insights into contribution patterns, tech stack, and
            repository activity for any GitHub user
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 bg-accent/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all">
            <div className="text-accent font-mono font-bold text-2xl mb-2">
              📊
            </div>
            <div className="text-sm font-semibold text-foreground">
              Activity Metrics
            </div>
            <div className="text-xs text-muted mt-1">
              12-month contribution heatmap and trends
            </div>
          </div>
          <div className="p-5 bg-accent/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all">
            <div className="text-accent font-mono font-bold text-2xl mb-2">
              💻
            </div>
            <div className="text-sm font-semibold text-foreground">
              Tech Stack
            </div>
            <div className="text-xs text-muted mt-1">
              Language distribution with visual breakdown
            </div>
          </div>
          <div className="p-5 bg-accent/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all">
            <div className="text-accent font-mono font-bold text-2xl mb-2">
              🚀
            </div>
            <div className="text-sm font-semibold text-foreground">
              Repository Insights
            </div>
            <div className="text-xs text-muted mt-1">
              Stars, forks, and recent activity status
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <p className="text-sm text-muted mb-3">Try a popular developer:</p>
          <a
            href={`/?user=${randomExample}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-2 border border-border rounded-lg transition-all group"
          >
            <code className="text-primary text-sm font-mono font-semibold">
              {randomExample}
            </code>
            <svg
              className="w-4 h-4 text-muted group-hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
