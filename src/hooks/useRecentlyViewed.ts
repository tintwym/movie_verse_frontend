"use client";

import { useCallback, useEffect, useState } from "react";
import type { Movie } from "@/lib/types";
import { movieTitle } from "@/lib/types";

const STORAGE_KEY = "mv_recently_viewed";
const MAX_ITEMS = 12;

export interface RecentMovie {
  id: number;
  title: string;
  poster_path?: string | null;
  vote_average?: number;
  mediaType: "movie" | "tv";
  viewedAt: number;
}

function readStore(): RecentMovie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentMovie[]) : [];
  } catch {
    return [];
  }
}

function writeStore(items: RecentMovie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function recordRecentlyViewed(
  movie: Movie,
  mediaType: "movie" | "tv" = "movie"
) {
  if (typeof window === "undefined") return;
  const next: RecentMovie = {
    id: movie.id,
    title: movieTitle(movie),
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    mediaType,
    viewedAt: Date.now(),
  };
  const filtered = readStore().filter(
    (item) => !(item.id === movie.id && item.mediaType === mediaType)
  );
  writeStore([next, ...filtered]);
  window.dispatchEvent(new Event("mv-recent-updated"));
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentMovie[]>([]);

  const refresh = useCallback(() => {
    setItems(readStore());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("mv-recent-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("mv-recent-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return items;
}
