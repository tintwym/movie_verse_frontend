import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { SearchHistoryPanel } from "@/components/search/SearchHistoryPanel";
import { SearchRecorder } from "@/components/search/SearchRecorder";
import { SearchTabs } from "@/components/search/SearchTabs";
import { MobileSearchBar } from "@/components/search/MobileSearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { TruncateText } from "@/components/ui/TruncateText";
import { parsePageParam } from "@/lib/parsePage";
import { tmdbApi } from "@/lib/api/tmdb";
import { posterUrl } from "@/lib/utils";
import type { Person } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchType = "movies" | "people" | "tv";

interface Props {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const searchType = (type as SearchType) || "movies";
  const page = parsePageParam(pageParam);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchType !== "movies") params.set("type", searchType);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  let movieResults = null;
  let tvResults = null;
  let peopleResults = null;

  if (query) {
    if (searchType === "movies") {
      movieResults = await tmdbApi.searchMovies(query, page);
    } else if (searchType === "tv") {
      tvResults = await tmdbApi.searchTV(query, page);
    } else {
      peopleResults = await tmdbApi.searchPeople(query, page);
    }
  }

  return (
    <MainLayout>
      {query && <SearchRecorder query={query} />}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-4 lg:hidden">
          <MobileSearchBar defaultQuery={query} />
        </div>
        <TruncateText as="h1" lines={1} className="text-2xl font-bold text-white sm:text-3xl">
          {query ? `Results for "${query}"` : "Search"}
        </TruncateText>

        {!query ? (
          <>
            <p className="mt-4 text-zinc-400">
              Search movies, TV shows, and people from the navigation bar.
            </p>
            <SearchHistoryPanel />
          </>
        ) : (
          <>
            <SearchTabs query={query} active={searchType} />

            {searchType === "movies" && movieResults && (
              <>
                {movieResults.results.length === 0 ? (
                  <p className="mt-10 text-zinc-500">No movies found.</p>
                ) : (
                  <div className="mt-10">
                    <MovieGrid movies={movieResults.results} />
                    <Pagination
                      currentPage={movieResults.page}
                      totalPages={movieResults.total_pages}
                      buildHref={buildHref}
                    />
                  </div>
                )}
              </>
            )}

            {searchType === "tv" && tvResults && (
              <>
                {tvResults.results.length === 0 ? (
                  <p className="mt-10 text-zinc-500">No TV shows found.</p>
                ) : (
                  <div className="mt-10">
                    <MovieGrid movies={tvResults.results} mediaType="tv" />
                    <Pagination
                      currentPage={tvResults.page}
                      totalPages={tvResults.total_pages}
                      buildHref={buildHref}
                    />
                  </div>
                )}
              </>
            )}

            {searchType === "people" && peopleResults && (
              <>
                {peopleResults.results.length === 0 ? (
                  <p className="mt-10 text-zinc-500">No people found.</p>
                ) : (
                  <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {peopleResults.results.map((person: Person) => (
                      <Link
                        key={person.id}
                        href={`/people/${person.id}`}
                        className="group text-center"
                      >
                        <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/10 transition group-hover:ring-indigo-500/40">
                          <Image
                            src={posterUrl(person.profile_path)}
                            alt={person.name}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        </div>
                        <p className="mt-3 text-sm font-medium text-white group-hover:text-indigo-300">
                          {person.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
                {peopleResults.total_pages > 1 && (
                  <Pagination
                    currentPage={peopleResults.page}
                    totalPages={peopleResults.total_pages}
                    buildHref={buildHref}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
