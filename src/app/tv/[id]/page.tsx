import { MainLayout } from "@/components/layout/MainLayout";
import { MovieDetailClient } from "@/components/movies/MovieDetailClient";
import { tmdbApi } from "@/lib/api/tmdb";
import { movieTitle } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const show = await tmdbApi.getTV(parseInt(id, 10));
    return { title: movieTitle(show) };
  } catch {
    return { title: "TV Show" };
  }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  const showId = parseInt(id, 10);

  try {
    const [show, credits, similarData] = await Promise.all([
      tmdbApi.getTV(showId),
      tmdbApi.getTVCredits(showId),
      tmdbApi.getSimilarTV(showId),
    ]);

    return (
      <MainLayout>
        <MovieDetailClient
          movie={show}
          cast={credits.cast}
          similar={similarData.results.slice(0, 12)}
          mediaType="tv"
        />
      </MainLayout>
    );
  } catch {
    notFound();
  }
}
