import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
        </div>

        <p className="text-muted text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary text-background rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Go Home
          </Link>
          <Link
            href="/?user=torvalds"
            className="px-6 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            View Example
          </Link>
        </div>
      </div>
    </div>
  );
}
