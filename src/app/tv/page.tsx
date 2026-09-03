import { CatalogPage } from "@/components/movies/CatalogPage";
import { tmdbApi } from "@/lib/api/tmdb";

export const metadata = { title: "TV Shows" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function TVPage({ searchParams }: Props) {
  return (
    <CatalogPage
      title="Popular TV Shows"
      subtitle="Binge-worthy series trending now"
      basePath="/tv"
      fetchMovies={tmdbApi.getPopularTV}
      searchParams={searchParams}
      mediaType="tv"
    />
  );
}
