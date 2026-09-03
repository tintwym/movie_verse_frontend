import { CatalogPage } from "@/components/movies/CatalogPage";
import { tmdbApi } from "@/lib/api/tmdb";

export const metadata = { title: "Popular" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function PopularPage({ searchParams }: Props) {
  return (
    <CatalogPage
      title="Popular Movies"
      subtitle="Fan favorites on TMDB"
      basePath="/popular"
      fetchMovies={tmdbApi.getPopular}
      searchParams={searchParams}
    />
  );
}
