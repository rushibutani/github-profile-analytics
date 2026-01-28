export default function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>
            Built with Next.js · Data from{" "}
            <a
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              GitHub API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
