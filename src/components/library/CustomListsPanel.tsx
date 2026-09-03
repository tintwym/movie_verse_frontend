"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCustomLists } from "@/hooks/useCustomLists";
import { tmdbApi } from "@/lib/api/tmdb";
import type { Movie } from "@/lib/types";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { Button } from "@/components/ui/Button";

export function CustomListsPanel() {
  const { lists, createList, deleteList } = useCustomLists();
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const active = lists.find((l) => l.id === activeId) ?? lists[0] ?? null;

  useEffect(() => {
    if (active && !activeId) setActiveId(active.id);
  }, [active, activeId]);

  useEffect(() => {
    if (!active) {
      setMovies([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      active.movieIds.map((id) => tmdbApi.getMovie(id).catch(() => null))
    ).then((results) => {
      if (cancelled) return;
      setMovies(results.filter(Boolean) as Movie[]);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My Lists</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Custom collections saved on this device
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List name"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const list = createList(name);
                if (list) {
                  setActiveId(list.id);
                  setName("");
                }
              }
            }}
          />
          <Button
            onClick={() => {
              const list = createList(name);
              if (list) {
                setActiveId(list.id);
                setName("");
              }
            }}
          >
            Create
          </Button>
        </div>
      </div>

      {lists.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
          Create a list, then add movies from any movie page.
        </p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {lists.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => setActiveId(list.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active?.id === list.id
                    ? "bg-indigo-500 text-white"
                    : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                }`}
              >
                {list.name} ({list.movieIds.length})
              </button>
            ))}
          </div>

          {active && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{active.name}</h3>
              <button
                type="button"
                onClick={() => {
                  deleteList(active.id);
                  setActiveId(null);
                }}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> Delete list
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : movies.length === 0 ? (
            <p className="text-sm text-zinc-500">
              This list is empty. Open a{" "}
              <Link href="/trending" className="text-indigo-400 hover:underline">
                movie
              </Link>{" "}
              and use <strong>My Lists</strong>.
            </p>
          ) : (
            <MovieGrid movies={movies} />
          )}
        </>
      )}
    </section>
  );
}
