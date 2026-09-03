import { CatalogPage } from "@/components/movies/CatalogPage";
import { tmdbApi } from "@/lib/api/tmdb";

export const metadata = { title: "Top Rated" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function TopRatedPage({ searchParams }: Props) {
  return (
    <CatalogPage
      title="Top Rated"
      subtitle="Highest rated movies of all time"
      basePath="/top-rated"
      fetchMovies={tmdbApi.getTopRated}
      searchParams={searchParams}
    />
  );
}
