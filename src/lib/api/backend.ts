import axios from "axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
  MovieReview,
  MovieRating,
  CommunityReview,
  AppNotification,
  FollowedPerson,
  TvProgressItem,
  AdminUser,
  AdminReview,
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
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("mv:unauthorized"));
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
      backend.post<{ message: string; resetToken?: string }>(
        "/api/auth/verify-user",
        { username, email }
      ),
    resetPassword: (
      username: string,
      email: string,
      newPassword: string,
      resetToken: string
    ) =>
      backend.post<string>("/api/users/reset-password", {
        username,
        email,
        newPassword,
        resetToken,
      }),
    // Prefer auth route as well
    resetPasswordAuth: (
      username: string,
      email: string,
      newPassword: string,
      resetToken: string
    ) =>
      backend.post<string>("/api/auth/reset-password", {
        username,
        email,
        newPassword,
        resetToken,
      }),    getProfile: () => backend.get<UserProfile>("/api/auth/profile/me"),
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
    getForMovie: (movieId: number) =>
      backend.get<CommunityReview[]>(`/api/reviews/${movieId}`),
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
    getAverage: (movieId: number) =>
      backend.get<number>(`/api/ratings/${movieId}/average`),
  },
  notifications: {
    list: () => backend.get<AppNotification[]>("/api/notifications"),
    unreadCount: () =>
      backend.get<{ count: number }>("/api/notifications/unread-count"),
    markRead: (id: string) => backend.post(`/api/notifications/${id}/read`),
    markAllRead: () => backend.post("/api/notifications/read-all"),
  },
  follows: {
    list: () => backend.get<FollowedPerson[]>("/api/follows"),
    status: (personId: number) =>
      backend.get<{ following: boolean }>(`/api/follows/${personId}/status`),
    follow: (payload: {
      tmdbPersonId: number;
      personName: string;
      profilePath?: string | null;
    }) => backend.post<FollowedPerson>("/api/follows", payload),
    unfollow: (personId: number) => backend.delete(`/api/follows/${personId}`),
    checkCredits: (
      credits: {
        tmdbPersonId: number;
        creditId: number;
        title: string;
        mediaType: string;
        releaseDate?: string;
      }[]
    ) => backend.post<{ created: number }>("/api/follows/check-credits", credits),
  },
  tvProgress: {
    list: (tvId: number) =>
      backend.get<TvProgressItem[]>(`/api/tv-progress/${tvId}`),
    upsert: (payload: {
      tmdbTvId: number;
      seasonNumber: number;
      episodeNumber: number;
      watched: boolean;
    }) => backend.put<TvProgressItem>("/api/tv-progress", payload),
    markSeason: (tvId: number, seasonNumber: number, episodeNumbers: number[]) =>
      backend.post(`/api/tv-progress/${tvId}/season/${seasonNumber}`, {
        episodeNumbers,
      }),
  },
  admin: {
    stats: () =>
      backend.get<{ userCount: number; reviewCount: number }>("/api/admin/stats"),
    users: () => backend.get<AdminUser[]>("/api/admin/users"),
    reviews: () => backend.get<AdminReview[]>("/api/admin/reviews"),
    deleteUser: (userId: string) => backend.delete(`/api/admin/users/${userId}`),
    deleteReview: (userId: string, tmdbMovieId: number) =>
      backend.delete("/api/admin/reviews", {
        params: { userId, tmdbMovieId },
      }),
  },
};
