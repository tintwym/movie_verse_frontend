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
  media_type?: "movie" | "tv" | string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: TvSeasonSummary[];
  videos?: {
    results: MovieVideo[];
  };
}

export interface MovieVideo {
  id?: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export interface Genre {
  id: number | string;
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
  id?: string;
  username: string;
  email: string;
  role?: string;
  favouriteGenres: Genre[];
}

export interface AuthResponse {
  token?: string;
  role?: string;
  message?: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string | null;
  read: boolean;
  createdAt?: string | null;
}

export interface FollowedPerson {
  id: string;
  tmdbPersonId: number;
  personName: string;
  profilePath?: string | null;
  lastNotifiedCreditId?: number | null;
}

export interface TvProgressItem {
  tmdbTvId: number;
  seasonNumber: number;
  episodeNumber: number;
  watched: boolean;
}

export interface TvSeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count?: number;
  poster_path?: string | null;
  air_date?: string | null;
}

export interface TvEpisode {
  id: number;
  name: string;
  overview?: string;
  episode_number: number;
  season_number: number;
  still_path?: string | null;
  air_date?: string | null;
  runtime?: number | null;
}

export interface TvSeasonDetail {
  id: number;
  name: string;
  season_number: number;
  episodes: TvEpisode[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string | null;
}

export interface AdminReview {
  userId?: string | null;
  username: string;
  tmdbMovieId: number;
  reviewText: string;
  edited: boolean;
  sentiment?: string | null;
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

export interface CommunityReview {
  username: string;
  reviewText: string;
  edited: boolean;
  rating?: number | null;
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

export function pickTrailer(movie: Movie): MovieVideo | null {
  const videos = movie.videos?.results ?? [];
  const youtube = videos.filter((v) => v.site === "YouTube");
  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0] ||
    null
  );
}
