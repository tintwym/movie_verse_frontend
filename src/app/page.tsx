import { MainLayout } from "@/components/layout/MainLayout";
import { HeroBanner } from "@/components/movies/HeroBanner";
import { MovieRow } from "@/components/movies/MovieRow";
import { RecentlyViewedRow } from "@/components/movies/RecentlyViewedRow";
import { EmptyCatalog } from "@/components/ui/EmptyCatalog";
import { tmdbApi, isTmdbConfigured } from "@/lib/api/tmdb";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [popular, trending, upcoming, topRated, popularTV] = await Promise.all([
    tmdbApi.getPopular(),
    tmdbApi.getTrending(),
    tmdbApi.getUpcoming(),
    tmdbApi.getTopRated(),
    tmdbApi.getPopularTV(),
  ]);

  const featured = trending.results[0] ?? popular.results[0];
  const hasCatalog =
    featured ||
    trending.results.length > 0 ||
    popular.results.length > 0 ||
    popularTV.results.length > 0;

  return (
    <MainLayout>
      {featured ? (
        <HeroBanner movie={featured} />
      ) : (
        <section className="relative flex min-h-[48vh] items-end overflow-hidden px-4 pb-14 sm:min-h-[56vh] sm:px-8 lg:min-h-[64vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/15 via-transparent to-transparent" />
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-400">
              MovieVerse
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Discover what to watch next
            </h1>
            <p className="mt-4 max-w-lg text-zinc-400">
              {isTmdbConfigured()
                ? "The catalog is unavailable right now. Try again in a moment."
                : "No catalog yet — add TMDB_API_KEY in the Vercel project settings, then redeploy."}
            </p>
          </div>
        </section>
      )}
      <div className="space-y-8 py-8 lg:space-y-12 lg:py-12">
        <RecentlyViewedRow />
        {hasCatalog ? (
          <>
            <MovieRow title="Trending Now" movies={trending.results.slice(0, 12)} href="/trending" />
            <MovieRow title="Popular" movies={popular.results.slice(0, 12)} href="/popular" />
            <MovieRow title="Popular TV" movies={popularTV.results.slice(0, 12)} href="/tv" mediaType="tv" />
            <MovieRow title="Coming Soon" movies={upcoming.results.slice(0, 12)} href="/upcoming" />
            <MovieRow title="Top Rated" movies={topRated.results.slice(0, 12)} href="/top-rated" />
          </>
        ) : (
          <EmptyCatalog
            detail={
              isTmdbConfigured()
                ? "TMDB did not return any titles. Refresh in a moment."
                : "The host is missing TMDB_API_KEY, so movie rows stay empty."
            }
          />
        )}
      </div>
    </MainLayout>
  );
}
