import axios from "axios";
import type { PaginatedMovies, Movie, MovieCredits, Genre, Person, PaginatedPeople } from "@/lib/types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: apiKey },
});

async function get<T>(url: string, params?: Record<string, string | number>): Promise<T> {
  const { data } = await tmdb.get<T>(url, { params });
  return data;
}

export const tmdbApi = {
  getPopular: (page = 1) => get<PaginatedMovies>("/movie/popular", { page }),
  getTopRated: (page = 1) => get<PaginatedMovies>("/movie/top_rated", { page }),
  getUpcoming: (page = 1) => get<PaginatedMovies>("/movie/upcoming", { page }),
  getTrending: (page = 1) => get<PaginatedMovies>("/trending/movie/day", { page }),
  getMovie: (id: number) =>
    get<Movie>(`/movie/${id}`, {
      append_to_response: "credits,videos,similar",
    }),
  getMovieCredits: (id: number) => get<MovieCredits>(`/movie/${id}/credits`),
  getSimilar: (id: number) => get<PaginatedMovies>(`/movie/${id}/similar`),
  getGenres: () => get<{ genres: Genre[] }>("/genre/movie/list"),
  discoverByGenre: (genreIds: number[], page = 1) =>
    get<PaginatedMovies>("/discover/movie", {
      with_genres: genreIds.join("|"),
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
      page,
    }),
  discover: (params: Record<string, string | number>, page = 1) =>
    get<PaginatedMovies>("/discover/movie", { ...params, page }),
  searchMovies: (query: string, page = 1) =>
    get<PaginatedMovies>("/search/movie", { query, page, include_adult: "false" }),
  searchPeople: (query: string, page = 1) =>
    get<PaginatedPeople>("/search/person", {
      query,
      page,
    }),
  getPopularPeople: (page = 1) =>
    get<PaginatedPeople>("/person/popular", { page }),
  getTrendingTV: (page = 1) => get<PaginatedMovies>("/trending/tv/day", { page }),
  getPopularTV: (page = 1) => get<PaginatedMovies>("/tv/popular", { page }),
  getTopRatedTV: (page = 1) => get<PaginatedMovies>("/tv/top_rated", { page }),
  getTV: (id: number) =>
    get<Movie>(`/tv/${id}`, {
      append_to_response: "credits,videos,similar",
    }),
  getTVCredits: (id: number) => get<MovieCredits>(`/tv/${id}/credits`),
  getSimilarTV: (id: number) => get<PaginatedMovies>(`/tv/${id}/similar`),
  searchTV: (query: string, page = 1) =>
    get<PaginatedMovies>("/search/tv", { query, page, include_adult: "false" }),
  getPerson: (id: number) =>
    get<Person & { combined_credits?: { cast: Movie[] } }>(`/person/${id}`, {
      append_to_response: "combined_credits,images",
    }),
};

export async function getRecommendedMovies(
  genreNames: string[],
  excludeIds: number[] = []
): Promise<Movie[]> {
  const { GENRE_NAME_TO_TMDB_ID } = await import("@/lib/constants");
  const genreIds = genreNames
    .map((name) => GENRE_NAME_TO_TMDB_ID[name])
    .filter(Boolean);

  if (genreIds.length === 0) {
    const popular = await tmdbApi.getPopular();
    return popular.results.filter((m) => !excludeIds.includes(m.id)).slice(0, 20);
  }

  const data = await tmdbApi.discoverByGenre(genreIds);
  return data.results.filter((m) => !excludeIds.includes(m.id)).slice(0, 20);
}
