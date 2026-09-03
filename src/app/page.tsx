import { MainLayout } from "@/components/layout/MainLayout";
import { HeroBanner } from "@/components/movies/HeroBanner";
import { MovieRow } from "@/components/movies/MovieRow";
import { tmdbApi } from "@/lib/api/tmdb";

export default async function HomePage() {
  const [popular, trending, upcoming, topRated, popularTV] = await Promise.all([
    tmdbApi.getPopular(),
    tmdbApi.getTrending(),
    tmdbApi.getUpcoming(),
    tmdbApi.getTopRated(),
    tmdbApi.getPopularTV(),
  ]);

  const featured = trending.results[0] ?? popular.results[0];

  return (
    <MainLayout>
      {featured && <HeroBanner movie={featured} />}
      <div className="space-y-8 py-8 lg:space-y-12 lg:py-12">
        <MovieRow title="Trending Now" movies={trending.results.slice(0, 12)} href="/trending" />
        <MovieRow title="Popular" movies={popular.results.slice(0, 12)} href="/popular" />
        <MovieRow title="Popular TV" movies={popularTV.results.slice(0, 12)} href="/tv" mediaType="tv" />
        <MovieRow title="Coming Soon" movies={upcoming.results.slice(0, 12)} href="/upcoming" />
        <MovieRow title="Top Rated" movies={topRated.results.slice(0, 12)} href="/top-rated" />
      </div>
    </MainLayout>
  );
}
