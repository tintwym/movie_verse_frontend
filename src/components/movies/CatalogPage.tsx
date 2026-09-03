import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { parsePageParam } from "@/lib/parsePage";
import type { PaginatedMovies } from "@/lib/types";

interface CatalogPageProps {
  title: string;
  subtitle?: string;
  basePath: string;
  fetchMovies: (page?: number) => Promise<PaginatedMovies>;
  searchParams?: Promise<{ page?: string }>;
  mediaType?: "movie" | "tv";
}

export async function CatalogPage({
  title,
  subtitle,
  basePath,
  fetchMovies,
  searchParams,
  mediaType = "movie",
}: CatalogPageProps) {
  const params = searchParams ? await searchParams : {};
  const page = parsePageParam(params.page);
  const data = await fetchMovies(page);

  const buildHref = (p: number) =>
    p <= 1 ? basePath : `${basePath}?page=${p}`;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <PageHeader
          title={title}
          subtitle={subtitle}
          meta={`${data.total_results.toLocaleString()} titles · Page ${data.page} of ${Math.max(data.total_pages, 1)}`}
        />
        <MovieGrid movies={data.results} mediaType={mediaType} />
        <Pagination
          currentPage={data.page}
          totalPages={Math.max(data.total_pages, 1)}
          buildHref={buildHref}
        />
      </div>
    </MainLayout>
  );
}
