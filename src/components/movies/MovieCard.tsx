"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Movie } from "@/lib/types";
import { movieTitle } from "@/lib/types";
import { posterUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TruncateText } from "@/components/ui/TruncateText";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
  mediaType?: "movie" | "tv";
}

export function MovieCard({ movie, className, priority, mediaType = "movie" }: MovieCardProps) {
  const title = movieTitle(movie);
  const href = mediaType === "tv" ? `/tv/${movie.id}` : `/movies/${movie.id}`;

  return (
    <Link
      href={href}
      className={cn("group block w-[132px] flex-shrink-0 sm:w-[160px] md:w-[180px]", className)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition duration-300 ease-out active:scale-[0.98] group-hover:scale-[1.04] group-hover:shadow-xl group-hover:shadow-indigo-500/20 group-hover:ring-indigo-500/40 sm:rounded-2xl">
        <Image
          src={posterUrl(movie.poster_path)}
          alt={title}
          fill
          sizes="(max-width: 640px) 45vw, 180px"
          priority={priority}
          className="object-cover transition duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100 group-hover:duration-700" />
        {movie.vote_average != null && movie.vote_average > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm transition duration-300 group-hover:scale-105">
            <Star className="h-3 w-3 fill-current" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <TruncateText
        as="h3"
        lines={2}
        className={cn(
          "mt-2 w-full text-xs font-medium text-foreground transition-colors duration-200 group-hover:text-indigo-500 sm:mt-3 sm:text-sm",
          className
        )}
      >
        {title}
      </TruncateText>
    </Link>
  );
}
