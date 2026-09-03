"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { MovieGridSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthProvider";
import { tmdbApi } from "@/lib/api/tmdb";
import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface UserMovieListContentProps {
  title: string;
  subtitle: string;
  fetchIds: () => Promise<number[]>;
  emptyMessage?: string;
  emptyCta?: { label: string; href: string };
}

async function resolveCatalogItem(id: number): Promise<Movie | null> {
  try {
    const movie = await tmdbApi.getMovie(id);
    return { ...movie, media_type: "movie" };
  } catch {
    /* try TV */
  }
  try {
    const show = await tmdbApi.getTV(id);
    return { ...show, media_type: "tv" };
  } catch {
    return null;
  }
}

function UserMovieListContent({
  title,
  subtitle,
  fetchIds,
  emptyMessage = "No movies yet.",
  emptyCta,
}: UserMovieListContentProps) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchIds()
      .then(async (ids) => {
        if (cancelled) return;
        const results = await Promise.all(ids.map((id) => resolveCatalogItem(id)));
        setMovies(results.filter(Boolean) as Movie[]);
      })
      .catch(() => {
        if (!cancelled) setMovies([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authLoading, router, title]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-zinc-400">{subtitle}</p>
      <div className="mt-10">
        {loading ? (
          <MovieGridSkeleton count={6} />
        ) : movies.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-zinc-400">{emptyMessage}</p>
            {emptyCta && (
              <Link href={emptyCta.href} className="mt-6 inline-block">
                <Button>{emptyCta.label}</Button>
              </Link>
            )}
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </div>
    </div>
  );
}

export { UserMovieListContent };
