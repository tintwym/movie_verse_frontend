"use client";

import Link from "next/link";
import { Clock, X } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/Button";

export function SearchHistoryPanel() {
  const { history, clearHistory, removeSearch } = useSearchHistory();

  if (history.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-zinc-400">No recent searches yet.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Try searching for a movie, show, or actor.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Recent searches
        </h2>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          Clear all
        </Button>
      </div>
      <ul className="space-y-2">
        {history.map((query) => (
          <li
            key={query}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-indigo-500/30 hover:bg-white/10"
          >
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="flex flex-1 items-center gap-3 text-white"
            >
              <Clock className="h-4 w-4 text-zinc-500" />
              {query}
            </Link>
            <button
              type="button"
              onClick={() => removeSearch(query)}
              className="rounded-lg p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${query}`}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
