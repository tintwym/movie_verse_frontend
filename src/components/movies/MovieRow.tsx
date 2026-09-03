"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/types";
import { MovieCard } from "./MovieCard";
import { Reveal } from "@/components/ui/Reveal";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  href?: string;
  mediaType?: "movie" | "tv";
}

export function MovieRow({ title, movies, href, mediaType = "movie" }: MovieRowProps) {
  if (!movies.length) return null;

  return (
    <Reveal className="space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="group flex items-center gap-1 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:gap-4 sm:px-8 sm:pb-2">
        {movies.map((movie, i) => (
          <Reveal key={movie.id} delay={i * 55} direction="none">
            <MovieCard movie={movie} priority={i < 3} mediaType={mediaType} />
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}
