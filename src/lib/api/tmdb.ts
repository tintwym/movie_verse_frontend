import axios, { isAxiosError } from "axios";
import type {
  PaginatedMovies,
  Movie,
  MovieCredits,
  Genre,
  Person,
  PaginatedPeople,
  TvSeasonDetail,
} from "@/lib/types";

const TMDB_BASE = "https://api.themoviedb.org/3";

const EMPTY_MOVIES: PaginatedMovies = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const EMPTY_PEOPLE: PaginatedPeople = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

function getApiKey(): string {
  return (
    process.env.TMDB_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY?.trim() ||
    ""
  );
}

function hasApiKey(): boolean {
  const key = getApiKey();
  return key.length > 0 && key !== "test_key" && key !== "your_tmdb_api_key";
}

export function isTmdbConfigured(): boolean {
  return hasApiKey();
}

function toQuery(params?: Record<string, string | number>): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      search.set(key, String(value));
    }
  }
  return search.toString();
}

async function get<T>(
  url: string,
  params?: Record<string, string | number>
): Promise<T> {
  const onServer = typeof window === "undefined";

  if (onServer) {
    if (!hasApiKey()) {
      throw new Error("TMDB API key is not configured");
    }
    const search = new URLSearchParams(toQuery(params));
    search.set("api_key", getApiKey());
    const res = await fetch(`${TMDB_BASE}${url}?${search.toString()}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      throw new Error(`TMDB ${url} failed (${res.status})`);
    }
    return (await res.json()) as T;
  }

  const { data } = await axios.get<T>(`/api/tmdb${url}`, { params });
  return data;
}

async function getMovies(
  url: string,
  params?: Record<string, string | number>
): Promise<PaginatedMovies> {
  try {
    return await get<PaginatedMovies>(url, params);
  } catch (error) {
    if (isAxiosError(error) || error instanceof Error) {
      console.warn(`[TMDB] ${url} failed:`, error.message);
    }
    return EMPTY_MOVIES;
  }
}

async function getPeople(
  url: string,
  params?: Record<string, string | number>
): Promise<PaginatedPeople> {
  try {
    return await get<PaginatedPeople>(url, params);
  } catch (error) {
    if (isAxiosError(error) || error instanceof Error) {
      console.warn(`[TMDB] ${url} failed:`, error.message);
    }
    return EMPTY_PEOPLE;
  }
}

export const tmdbApi = {
  getPopular: (page = 1) => getMovies("/movie/popular", { page }),
  getTopRated: (page = 1) => getMovies("/movie/top_rated", { page }),
  getUpcoming: (page = 1) => getMovies("/movie/upcoming", { page }),
  getTrending: (page = 1) => getMovies("/trending/movie/day", { page }),
  getMovie: (id: number) =>
    get<Movie>(`/movie/${id}`, {
      append_to_response: "credits,videos,similar",
    }),
  getMovieCredits: (id: number) => get<MovieCredits>(`/movie/${id}/credits`),
  getSimilar: (id: number) => getMovies(`/movie/${id}/similar`),
  getGenres: async () => {
    try {
      return await get<{ genres: Genre[] }>("/genre/movie/list");
    } catch {
      return { genres: [] };
    }
  },
  discoverByGenre: (genreIds: number[], page = 1) =>
    getMovies("/discover/movie", {
      with_genres: genreIds.join("|"),
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
      page,
    }),
  discover: (params: Record<string, string | number>, page = 1) =>
    getMovies("/discover/movie", { ...params, page }),
  searchMovies: (query: string, page = 1) =>
    getMovies("/search/movie", { query, page, include_adult: "false" }),
  searchPeople: (query: string, page = 1) =>
    getPeople("/search/person", { query, page }),
  getPopularPeople: (page = 1) => getPeople("/person/popular", { page }),
  getTrendingTV: (page = 1) => getMovies("/trending/tv/day", { page }),
  getPopularTV: (page = 1) => getMovies("/tv/popular", { page }),
  getTopRatedTV: (page = 1) => getMovies("/tv/top_rated", { page }),
  getTV: (id: number) =>
    get<Movie>(`/tv/${id}`, {
      append_to_response: "credits,videos,similar",
    }),
  getTVSeason: (tvId: number, seasonNumber: number) =>
    get<TvSeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`),
  getTVCredits: (id: number) => get<MovieCredits>(`/tv/${id}/credits`),
  getSimilarTV: (id: number) => getMovies(`/tv/${id}/similar`),
  searchTV: (query: string, page = 1) =>
    getMovies("/search/tv", { query, page, include_adult: "false" }),
  getPerson: (id: number) =>
    get<Person & { combined_credits?: { cast: Movie[] } }>(`/person/${id}`, {
      append_to_response: "combined_credits,images",
    }),
};

export async function getRecommendedMovies(
  genreNames: string[],
  excludeIds: number[] = [],
  seedMovieIds: number[] = []
): Promise<Movie[]> {
  const { GENRE_NAME_TO_TMDB_ID } = await import("@/lib/constants");
  const genreIds = genreNames
    .map((name) => GENRE_NAME_TO_TMDB_ID[name])
    .filter(Boolean) as number[];

  const exclude = new Set(excludeIds.filter((id) => id > 0));
  const seen = new Set<number>();
  const pooled: Movie[] = [];

  const pushUnique = (movies: Movie[]) => {
    for (const movie of movies) {
      if (exclude.has(movie.id) || seen.has(movie.id)) continue;
      seen.add(movie.id);
      pooled.push(movie);
    }
  };

  const similarSeeds = seedMovieIds.filter((id) => id > 0).slice(0, 3);
  if (similarSeeds.length > 0) {
    const similarBatches = await Promise.all(
      similarSeeds.map((id) => tmdbApi.getSimilar(id).catch(() => EMPTY_MOVIES))
    );
    for (const batch of similarBatches) pushUnique(batch.results);
  }

  if (genreIds.length > 0) {
    const genreBatches = await Promise.all(
      genreIds.slice(0, 3).map((id) =>
        tmdbApi.discoverByGenre([id]).catch(() => EMPTY_MOVIES)
      )
    );
    for (const batch of genreBatches) pushUnique(batch.results);

    if (genreIds.length > 1) {
      const mixed = await tmdbApi.discoverByGenre(genreIds.slice(0, 3));
      pushUnique(mixed.results);
    }
  } else {
    const [popular, trending] = await Promise.all([
      tmdbApi.getPopular(),
      tmdbApi.getTrending(),
    ]);
    pushUnique(trending.results);
    pushUnique(popular.results);
  }

  for (let i = pooled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pooled[i], pooled[j]] = [pooled[j], pooled[i]];
  }

  return pooled.slice(0, 24);
}
