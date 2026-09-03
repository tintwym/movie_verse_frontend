import { CatalogPage } from "@/components/movies/CatalogPage";
import { tmdbApi } from "@/lib/api/tmdb";

export const metadata = { title: "Upcoming" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default function UpcomingPage({ searchParams }: Props) {
  return (
    <CatalogPage
      title="Coming Soon"
      subtitle="Coming soon to theaters"
      basePath="/upcoming"
      fetchMovies={tmdbApi.getUpcoming}
      searchParams={searchParams}
    />
  );
}
