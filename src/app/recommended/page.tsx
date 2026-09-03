"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import { getRecommendedMovies } from "@/lib/api/tmdb";
import type { Movie } from "@/lib/types";

function RecommendedContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const [{ data: profile }, { data: interactions }, favRes, watchedRes] =
          await Promise.all([
            backendApi.auth.getProfile(),
            backendApi.interactions.getUserInteractions(),
            backendApi.interactions.getFavorites().catch(() => ({ data: [] as number[] })),
            backendApi.interactions.getWatched().catch(() => ({ data: [] as number[] })),
          ]);

        const excludeIds = interactions
          .map((i) => i.tmdbMovieId)
          .filter((id) => id > 0);

        const genreNames = profile.favouriteGenres?.map((g) => g.name) ?? [];
        const seedIds = [...new Set([...favRes.data, ...watchedRes.data])].slice(0, 5);

        setMovies(await getRecommendedMovies(genreNames, excludeIds, seedIds));
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn, authLoading, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-3xl font-bold text-white">Recommended For You</h1>
      <p className="mt-2 text-zinc-400">
        Based on your favorite genres, watch history, and similar titles
      </p>
      <div className="mt-10">
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="text-zinc-500">
            Favorite or watch a few movies to unlock better recommendations.
          </p>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </div>
    </div>
  );
}

export default function RecommendedPage() {
  return (
    <MainLayout>
      <RecommendedContent />
    </MainLayout>
  );
}
