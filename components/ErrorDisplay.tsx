import { ApiError } from "../types/github";

interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
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
        return "GitHub API has a rate limit. Please wait a few minutes and try again.";
      case "network_error":
        return "Unable to connect to GitHub. Check your internet connection and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-12 text-center animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-red-400 flex justify-center">{getErrorIcon()}</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {getErrorTitle()}
          </h2>
          <p className="text-muted">{error.message}</p>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-foreground">{getErrorSuggestion()}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 transition-all inline-flex items-center gap-2"
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
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState() {
  const exampleUsers = ["torvalds", "gaearon", "tj", "sindresorhus"];
  const randomExample =
    exampleUsers[Math.floor(Math.random() * exampleUsers.length)];

  return (
    <div className="bg-background border border-border rounded-lg p-12 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-muted flex justify-center">
          <svg
            className="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Ready to Analyze GitHub Profiles
          </h2>
          <p className="text-muted text-base">
            Get instant insights into contribution patterns, tech stack, and
            repository activity
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
            <div className="text-accent font-mono font-bold text-xl mb-1">
              📊
            </div>
            <div className="text-sm font-medium text-foreground">
              Activity Metrics
            </div>
            <div className="text-xs text-muted mt-1">
              12-month contribution analysis
            </div>
          </div>
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
            <div className="text-accent font-mono font-bold text-xl mb-1">
              💻
            </div>
            <div className="text-sm font-medium text-foreground">
              Tech Stack
            </div>
            <div className="text-xs text-muted mt-1">
              Language distribution insights
            </div>
          </div>
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
            <div className="text-accent font-mono font-bold text-xl mb-1">
              🚀
            </div>
            <div className="text-sm font-medium text-foreground">
              Repository Insights
            </div>
            <div className="text-xs text-muted mt-1">
              Stars, forks, and activity status
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted mb-2">Try an example:</p>
          <code className="px-3 py-1 bg-muted/20 text-accent text-sm font-mono rounded">
            {randomExample}
          </code>
        </div>
      </div>
    </div>
  );
}
