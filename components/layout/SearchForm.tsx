"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, SpinnerIcon } from "../ui";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("user") || "");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount (for keyboard users)
  useEffect(() => {
    if (!searchParams.get("user")) {
      inputRef.current?.focus();
    }
  }, [searchParams]);

  // Global keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input when '/' is pressed (like GitHub)
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if already in an input
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      // Clear search with Escape
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setUsername("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    startTransition(() => {
      router.push(`/?user=${encodeURIComponent(username.trim())}`);
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-2 w-full sm:w-auto"
      role="search"
    >
      <div className="relative flex-1 sm:w-80">
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          className="w-full px-4 py-2.5 pl-10 bg-card border border-border rounded-xl text-foreground text-sm placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          disabled={isPending}
          aria-label="GitHub username"
          aria-describedby="search-hint"
          autoComplete="off"
          spellCheck="false"
        />
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted/60"
          aria-hidden="true"
        />
        <span id="search-hint" className="sr-only">
          Press / to focus search. Press Escape to clear.
        </span>
      </div>
      <button
        type="submit"
        disabled={isPending || !username.trim()}
        className="px-5 py-2.5 bg-primary text-background text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="Analyze GitHub profile"
      >
        {isPending ? (
          <>
            <SpinnerIcon aria-hidden="true" />
            <span className="hidden sm:inline">Analyzing</span>
            <span className="sr-only">Analyzing profile, please wait</span>
          </>
        ) : (
          "Analyze"
        )}
      </button>
    </form>
  );
}
