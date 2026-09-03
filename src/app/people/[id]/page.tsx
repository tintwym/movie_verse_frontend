import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { FollowPersonButton } from "@/components/people/FollowPersonButton";
import { tmdbApi } from "@/lib/api/tmdb";
import { posterUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const person = await tmdbApi.getPerson(parseInt(id, 10));
    return { title: person.name };
  } catch {
    return { title: "Person" };
  }
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;

  try {
    const person = await tmdbApi.getPerson(parseInt(id, 10));
    const knownFor = (person.combined_credits?.cast ?? [])
      .slice(0, 12)
      .map((item) => ({
        ...item,
        media_type:
          item.media_type === "tv" || item.media_type === "movie"
            ? item.media_type
            : item.title || item.original_title
              ? "movie"
              : "tv",
      }));

    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
          <Link href="/people" className="text-sm text-indigo-400 hover:text-indigo-300">
            ← Back to People
          </Link>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row">
            <div className="relative h-64 w-48 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
              <Image
                src={posterUrl(person.profile_path)}
                alt={person.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">{person.name}</h1>
              {person.known_for_department && (
                <p className="text-indigo-400">{person.known_for_department}</p>
              )}
              {person.birthday && (
                <p className="text-sm text-zinc-400">Born: {person.birthday}</p>
              )}
              {person.place_of_birth && (
                <p className="text-sm text-zinc-400">{person.place_of_birth}</p>
              )}
              <FollowPersonButton
                personId={person.id}
                personName={person.name}
                profilePath={person.profile_path}
              />
              <p className="max-w-2xl text-zinc-300 leading-relaxed">
                {person.biography || "No biography available."}
              </p>
            </div>
          </div>
          {knownFor.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-xl font-bold text-white">Known For</h2>
              <MovieGrid movies={knownFor} />
            </div>
          )}
        </div>
      </MainLayout>
    );
  } catch {
    notFound();
  }
}
