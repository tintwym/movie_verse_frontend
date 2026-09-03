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
    const movie = await tmdbApi.getMovie(parseInt(id, 10));
    return { title: movieTitle(movie) };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  try {
    const [movie, credits, similarData] = await Promise.all([
      tmdbApi.getMovie(movieId),
      tmdbApi.getMovieCredits(movieId),
      tmdbApi.getSimilar(movieId),
    ]);

    return (
      <MainLayout>
        <MovieDetailClient
          movie={movie}
          cast={credits.cast}
          similar={similarData.results.slice(0, 12)}
        />
      </MainLayout>
    );
  } catch {
    notFound();
  }
}
