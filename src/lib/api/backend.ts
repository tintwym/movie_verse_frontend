import axios from "axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
  MovieReview,
  MovieRating,
} from "@/lib/types";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

const backend = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

backend.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

backend.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
    }
    return Promise.reject(error);
  }
);

export const backendApi = {
  auth: {
    login: (payload: LoginPayload) =>
      backend.post<AuthResponse>("/api/auth/users/login", payload),
    register: (payload: RegisterPayload) =>
      backend.post<AuthResponse>("/api/auth/users/register", payload),
    verifyUser: (username: string, email: string) =>
      backend.post<string>("/api/auth/verify-user", { username, email }),
    resetPassword: (username: string, email: string, newPassword: string) =>
      backend.post<string>("/api/users/reset-password", {
        username,
        email,
        newPassword,
      }),
    getProfile: () => backend.get<UserProfile>("/api/auth/profile/me"),
    changePassword: (currentPassword: string, newPassword: string) =>
      backend.post<string>("/api/users/change-password", {
        currentPassword,
        newPassword,
      }),
    verifyToken: (username: string) =>
      backend.post("/api/users/verify-token", { username }),
  },
  interactions: {
    logView: (movieId: number) =>
      backend.post(`/api/user-interactions/view/${movieId}`),
    toggleFavorite: (movieId: number) =>
      backend.post(`/api/user-interactions/favorite/${movieId}`),
    markWatched: (movieId: number) =>
      backend.put(`/api/user-interactions/watched/${movieId}`),
    unmarkWatched: (movieId: number) =>
      backend.put(`/api/user-interactions/unwatched/${movieId}`),
    getFavorites: () => backend.get<number[]>("/api/user-interactions/favorites"),
    getWatched: () => backend.get<number[]>("/api/user-interactions/watched"),
    getWatchlist: () => backend.get<number[]>("/api/user-interactions/watchlist"),
    toggleWatchlist: (movieId: number) =>
      backend.post(`/api/user-interactions/watchlist/${movieId}`),
    getWatchedCount: () =>
      backend.get<{ count: number }>("/api/user-interactions/watched-count"),
    getFavoriteCount: () =>
      backend.get<{ count: number }>("/api/user-interactions/favorite-count"),
    getUserInteractions: () =>
      backend.get<{ tmdbMovieId: number }[]>("/api/user-interactions/getuserinteractions"),
  },
  reviews: {
    getUserReview: (movieId: number) =>
      backend.get<MovieReview>(`/api/reviews/${movieId}/user`),
    submitReview: (movieId: number, reviewText: string, isEdit: boolean) =>
      backend.post(`/api/reviews/${movieId}`, null, {
        params: { reviewText, isEdit },
      }),
    deleteReview: (movieId: number) => backend.delete(`/api/reviews/${movieId}`),
    getReviewCount: () =>
      backend.get<{ reviewCount: number }>("/api/reviews/user/review-count"),
  },
  ratings: {
    getUserRating: (movieId: number) =>
      backend.get<MovieRating>(`/api/ratings/${movieId}/user`),
    submitRating: (movieId: number, rating: number) =>
      backend.post(`/api/ratings/${movieId}`, null, { params: { rating } }),
  },
};
