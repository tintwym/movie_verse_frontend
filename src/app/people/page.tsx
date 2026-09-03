import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { parsePageParam } from "@/lib/parsePage";
import { tmdbApi } from "@/lib/api/tmdb";
import { posterUrl } from "@/lib/utils";
import type { Person } from "@/lib/types";

export const metadata = { title: "People" };

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PeoplePage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const data = await tmdbApi.getPopularPeople(page);

  const buildHref = (p: number) => (p <= 1 ? "/people" : `/people?page=${p}`);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <PageHeader
          title="Popular People"
          subtitle="Actors and filmmakers trending on TMDB"
          meta={`Page ${data.page} of ${Math.max(data.total_pages, 1)}`}
        />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {data.results.map((person: Person) => (
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
        <Pagination
          currentPage={data.page}
          totalPages={Math.max(data.total_pages, 1)}
          buildHref={buildHref}
        />
      </div>
    </MainLayout>
  );
}
