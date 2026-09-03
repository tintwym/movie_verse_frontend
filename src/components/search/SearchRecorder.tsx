"use client";

import { useEffect } from "react";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export function SearchRecorder({ query }: { query: string }) {
  const { addSearch } = useSearchHistory();

  useEffect(() => {
    if (query.trim()) addSearch(query.trim());
  }, [query, addSearch]);

  return null;
}
