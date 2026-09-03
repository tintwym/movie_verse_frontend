import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYear(date?: string): string {
  if (!date) return "";
  return date.split("-")[0] ?? "";
}

export const TMDB_IMAGE = {
  poster: "https://image.tmdb.org/t/p/w500",
  backdrop: "https://image.tmdb.org/t/p/original",
  profile: "https://image.tmdb.org/t/p/w300_and_h450_face",
};

export function posterUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-poster.svg";
  return `${TMDB_IMAGE.poster}${path}`;
}

export function backdropUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-backdrop.svg";
  return `${TMDB_IMAGE.backdrop}${path}`;
}
