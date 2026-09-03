"use client";

import type { Movie } from "@/lib/types";
import { MovieCard } from "./MovieCard";
import { Reveal } from "@/components/ui/Reveal";

interface MovieGridProps {
  movies: Movie[];
  mediaType?: "movie" | "tv";
}

export function MovieGrid({ movies, mediaType = "movie" }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, i) => {
        const itemType =
          movie.media_type === "tv" || movie.media_type === "movie"
            ? movie.media_type
            : mediaType;
        return (
          <Reveal key={`${itemType}-${movie.id}`} delay={(i % 12) * 45} direction="none">
            <div className="flex justify-center">
              <MovieCard
                movie={movie}
                mediaType={itemType}
                className="w-full max-w-[200px] sm:max-w-none"
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
