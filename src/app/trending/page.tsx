import { CatalogPage } from "@/components/movies/CatalogPage";
import { tmdbApi } from "@/lib/api/tmdb";

export const metadata = { title: "Trending" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function TrendingPage({ searchParams }: Props) {
  return (
    <CatalogPage
      title="Trending Today"
      subtitle="What's hot right now"
      basePath="/trending"
      fetchMovies={tmdbApi.getTrending}
      searchParams={searchParams}
    />
  );
}
