"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Eye, Star, ArrowLeft, Bookmark, Play } from "lucide-react";
import type { Movie, CastMember } from "@/lib/types";
import { movieTitle, pickTrailer } from "@/lib/types";
import { backdropUrl, posterUrl, getYear } from "@/lib/utils";
import { backendApi } from "@/lib/api/backend";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TruncateText } from "@/components/ui/TruncateText";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Reveal } from "@/components/ui/Reveal";
import { MovieRow } from "@/components/movies/MovieRow";
import { TrailerModal } from "@/components/movies/TrailerModal";
import { ShareButton } from "@/components/movies/ShareButton";
import { AddToListButton } from "@/components/movies/AddToListButton";
import { CommunityReviews } from "@/components/movies/CommunityReviews";
import { TvSeasonTracker } from "@/components/tv/TvSeasonTracker";
import { recordRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface Props {
  movie: Movie;
  cast: CastMember[];
  similar: Movie[];
  mediaType?: "movie" | "tv";
}

export function MovieDetailClient({ movie, cast, similar, mediaType = "movie" }: Props) {
  const { isLoggedIn } = useAuth();
  const title = movieTitle(movie);
  const trailer = pickTrailer(movie);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    recordRecentlyViewed(movie, mediaType);
  }, [movie, mediaType]);

  useEffect(() => {
    if (!isLoggedIn) return;
    backendApi.interactions.logView(movie.id).catch(() => {});

    Promise.all([
      backendApi.interactions.getFavorites(),
      backendApi.interactions.getWatched(),
      backendApi.interactions.getWatchlist(),
      backendApi.ratings.getUserRating(movie.id).catch(() => null),
      backendApi.reviews.getUserReview(movie.id).catch(() => null),
    ]).then(([favRes, watchRes, watchlistRes, ratingRes, reviewRes]) => {
      setIsFavorite(favRes.data.includes(movie.id));
      setIsWatched(watchRes.data.includes(movie.id));
      setIsWatchlist(watchlistRes.data.includes(movie.id));
      if (ratingRes?.data?.rating) setRating(ratingRes.data.rating);
      if (reviewRes?.data) {
        setReview(
          reviewRes.data.editedReviewText ?? reviewRes.data.originalReviewText ?? ""
        );
      }
    });
  }, [isLoggedIn, movie.id]);

  const toggleFavorite = async () => {
    if (!isLoggedIn) return setMessage("Please sign in first");
    await backendApi.interactions.toggleFavorite(movie.id);
    setIsFavorite(!isFavorite);
  };

  const toggleWatched = async () => {
    if (!isLoggedIn) return setMessage("Please sign in first");
    if (isWatched) {
      await backendApi.interactions.unmarkWatched(movie.id);
    } else {
      await backendApi.interactions.markWatched(movie.id);
    }
    setIsWatched(!isWatched);
  };

  const toggleWatchlist = async () => {
    if (!isLoggedIn) return setMessage("Please sign in first");
    await backendApi.interactions.toggleWatchlist(movie.id);
    setIsWatchlist(!isWatchlist);
  };

  const submitReview = async () => {
    if (!isLoggedIn) return setMessage("Please sign in first");
    if (rating > 0) await backendApi.ratings.submitRating(movie.id, rating);
    if (review.trim()) {
      await backendApi.reviews.submitReview(movie.id, review, false);
    }
    setMessage("Saved!");
    setReviewRefresh((n) => n + 1);
  };

  return (
    <div>
      {showTrailer && trailer && (
        <TrailerModal
          youtubeKey={trailer.key}
          title={title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src={backdropUrl(movie.backdrop_path ?? movie.poster_path)}
          alt={title}
          fill
          priority
          className="object-cover object-top animate-ken-burns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent" />
        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-black/60 hover:-translate-x-0.5 sm:left-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        {trailer && (
          <button
            type="button"
            onClick={() => setShowTrailer(true)}
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-lg transition hover:scale-105"
          >
            <Play className="h-4 w-4 fill-current" />
            Watch Trailer
          </button>
        )}
      </section>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="-mt-32 flex flex-col gap-8 lg:flex-row">
          <AnimateIn variant="scale" delay={120} className="relative mx-auto h-[360px] w-[240px] flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/10 sm:mx-0">
            <Image
              src={posterUrl(movie.poster_path)}
              alt={title}
              fill
              className="object-cover"
              sizes="240px"
            />
          </AnimateIn>

          <div className="flex-1 space-y-4 pt-4 lg:pt-16">
            <AnimateIn delay={200}>
              <TruncateText
                as="h1"
                lines={2}
                className="text-3xl font-bold text-white sm:line-clamp-3 sm:text-4xl"
              >
                {title}
              </TruncateText>
            </AnimateIn>
            <AnimateIn delay={280}>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {movie.release_date && <span>{getYear(movie.release_date)}</span>}
                {movie.first_air_date && <span>{getYear(movie.first_air_date)}</span>}
                {movie.runtime && <span>{movie.runtime} min</span>}
                {movie.vote_average != null && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </AnimateIn>
            <AnimateIn delay={340}>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <Link key={g.id} href={`/genre/${g.id}?name=${encodeURIComponent(g.name)}`}>
                    <Badge>{g.name}</Badge>
                  </Link>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={400}>
              <p className="max-w-3xl text-zinc-300 leading-relaxed">{movie.overview}</p>
            </AnimateIn>

            <div className="flex flex-wrap gap-3 pt-2">
              {trailer && (
                <Button onClick={() => setShowTrailer(true)}>
                  <Play className="h-4 w-4 fill-current" />
                  Trailer
                </Button>
              )}
              <ShareButton title={title} />
              {mediaType === "movie" && <AddToListButton movieId={movie.id} />}
              {isLoggedIn && (
                <>
                  <Button
                    variant={isFavorite ? "danger" : "outline"}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button variant={isWatched ? "secondary" : "outline"} onClick={toggleWatched}>
                    <Eye className="h-4 w-4" />
                    {isWatched ? "Watched" : "Mark Watched"}
                  </Button>
                  <Button
                    variant={isWatchlist ? "secondary" : "outline"}
                    onClick={toggleWatchlist}
                  >
                    <Bookmark className={`h-4 w-4 ${isWatchlist ? "fill-current" : ""}`} />
                    {isWatchlist ? "On Watchlist" : "Watchlist"}
                  </Button>
                </>
              )}
            </div>
            {message && <p className="text-sm text-indigo-400">{message}</p>}

            {isLoggedIn && mediaType === "movie" && (
              <div className="glass-card max-w-xl space-y-4 p-6">
                <h3 className="font-semibold text-white">Rate & Review</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className={`rounded-lg p-2 transition ${
                        s <= rating ? "text-yellow-400" : "text-zinc-600"
                      }`}
                    >
                      <Star className={`h-6 w-6 ${s <= rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50"
                />
                <Button onClick={submitReview}>Save Review</Button>
              </div>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-white">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.slice(0, 12).map((person, i) => (
                <Reveal key={person.id} delay={i * 40} direction="none">
                  <Link
                    href={`/people/${person.id}`}
                    className="group flex w-28 flex-shrink-0 flex-col items-center text-center"
                  >
                    <div className="relative h-28 w-28 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-white/10 transition duration-300 group-hover:scale-105 group-hover:ring-indigo-500/40">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                            : "/placeholder-poster.svg"
                        }
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-white">{person.name}</p>
                    <p className="text-xs text-zinc-500">{person.character}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}

        {mediaType === "tv" && (
          <TvSeasonTracker tvId={movie.id} seasons={movie.seasons} />
        )}

        {mediaType === "movie" && (
          <CommunityReviews movieId={movie.id} refreshKey={reviewRefresh} />
        )}

        {similar.length > 0 && (
          <div className="mt-16 pb-16">
            <MovieRow
              title={mediaType === "tv" ? "Similar Shows" : "Similar Movies"}
              movies={similar}
              mediaType={mediaType}
            />
          </div>
        )}
      </div>
    </div>
  );
}
