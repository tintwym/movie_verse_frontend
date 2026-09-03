"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchTab = "movies" | "people" | "tv";

interface SearchTabsProps {
  query: string;
  active: SearchTab;
}

const tabs: { id: SearchTab; label: string }[] = [
  { id: "movies", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "people", label: "People" },
];

export function SearchTabs({ query, active }: SearchTabsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/search?q=${encodeURIComponent(query)}&type=${tab.id}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            active === tab.id
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              : "border border-white/10 bg-white/5 text-zinc-400 hover:border-indigo-500/30 hover:text-white"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
