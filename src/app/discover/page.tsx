import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { parsePageParam } from "@/lib/parsePage";
import { tmdbApi } from "@/lib/api/tmdb";
import Link from "next/link";

export const metadata = { title: "Discover" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function DiscoverPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const [genresData, discover] = await Promise.all([
    tmdbApi.getGenres(),
    tmdbApi.discover({ sort_by: "popularity.desc" }, page),
  ]);

  const buildHref = (p: number) => (p <= 1 ? "/discover" : `/discover?page=${p}`);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <PageHeader
          title="Discover"
          subtitle="Explore by genre or browse what's popular"
          meta={`Page ${discover.page} of ${Math.max(discover.total_pages, 1)}`}
        />

        <div className="flex flex-wrap gap-2">
          {genresData.genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-indigo-500/50 hover:text-white"
            >
              {genre.name}
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Popular Picks</h2>
          <MovieGrid movies={discover.results} />
          <Pagination
            currentPage={discover.page}
            totalPages={Math.max(discover.total_pages, 1)}
            buildHref={buildHref}
          />
        </div>
      </div>
    </MainLayout>
  );
}
