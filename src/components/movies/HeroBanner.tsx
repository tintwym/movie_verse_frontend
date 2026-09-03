"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { Movie } from "@/lib/types";
import { movieTitle } from "@/lib/types";
import { backdropUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TruncateText } from "@/components/ui/TruncateText";
import { AnimateIn } from "@/components/ui/AnimateIn";

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const title = movieTitle(movie);

  return (
    <section data-on-media className="relative h-[52vh] min-h-[320px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[420px] lg:h-[70vh] lg:min-h-[480px]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={backdropUrl(movie.backdrop_path ?? movie.poster_path)}
          alt={title}
          fill
          priority
          className="object-cover object-top animate-ken-burns"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-[#050510]/30" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-8 sm:pb-16 lg:pb-24">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <AnimateIn delay={80}>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Featured
            </p>
          </AnimateIn>
          <AnimateIn delay={160}>
            <TruncateText
              as="h1"
              lines={3}
              className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              {title}
            </TruncateText>
          </AnimateIn>
          {movie.vote_average != null && (
            <AnimateIn delay={240}>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-zinc-500">/ 10</span>
              </div>
            </AnimateIn>
          )}
          <AnimateIn delay={320}>
            <p className="line-clamp-2 text-sm text-zinc-300 sm:line-clamp-3 sm:text-lg">
              {movie.overview}
            </p>
          </AnimateIn>
          <AnimateIn delay={400}>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/movies/${movie.id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  <Play className="h-5 w-5 fill-current" />
                  Watch Details
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
