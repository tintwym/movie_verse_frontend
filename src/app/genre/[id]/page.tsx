import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { parsePageParam } from "@/lib/parsePage";
import { tmdbApi } from "@/lib/api/tmdb";

interface Props {
  searchParams: Promise<{ name?: string; page?: string }>;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { name } = await searchParams;
  return { title: name ? `${name} Movies` : "Genre" };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const data = await tmdbApi.discoverByGenre([parseInt(id, 10)], page);
  const basePath = `/genre/${id}?name=${encodeURIComponent(sp.name ?? "Genre")}`;

  const buildHref = (p: number) =>
    p <= 1 ? basePath : `${basePath}&page=${p}`;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <PageHeader
          title={`${sp.name ?? "Genre"} Movies`}
          meta={`${data.total_results.toLocaleString()} results · Page ${data.page} of ${data.total_pages}`}
        />
        <MovieGrid movies={data.results} />
        <Pagination
          currentPage={data.page}
          totalPages={data.total_pages}
          buildHref={buildHref}
        />
      </div>
    </MainLayout>
  );
}
