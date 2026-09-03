export interface Movie {
  id: number;
  title?: string;
  original_title?: string;
  original_name?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface PaginatedMovies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface PaginatedPeople {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface Person {
  id: number;
  name: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  profile_path?: string | null;
  known_for_department?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: { id: number; name: string; job: string }[];
}

export interface UserProfile {
  username: string;
  email: string;
  favouriteGenres: Genre[];
}

export interface AuthResponse {
  token?: string;
  message?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  favoriteGenres: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface MovieReview {
  originalReviewText?: string;
  editedReviewText?: string;
}

export interface MovieRating {
  rating: number;
}

export function movieTitle(movie: Movie): string {
  return (
    movie.title ||
    movie.original_title ||
    movie.name ||
    movie.original_name ||
    "Untitled"
  );
}
