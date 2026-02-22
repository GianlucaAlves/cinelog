import type { Shelf, MovieDetail, Review } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers ?? {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getShelves(): Promise<Shelf[]> {
  return apiFetch("/api/shelves");
}

export function getMovieDetail(
  tmdbId: string,
  type: "movie" | "tv",
): Promise<MovieDetail> {
  return apiFetch(`/api/movies/${tmdbId}?type=${type}`);
}

export function getReviews(tmdbId: string): Promise<Review[]> {
  return apiFetch(`/api/movies/${tmdbId}/reviews`);
}

export function createReview(
  tmdbId: string,
  payload: {
    rating: number;
    text: string;
    title: string;
    type: "movie" | "tv";
    releaseDate: string;
    posterPath: string;
  },
): Promise<Review> {
  return apiFetch(`/api/movies/${tmdbId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getWatchlistStatus(
  tmdbId: string,
): Promise<{ inWatchlist: boolean }> {
  return apiFetch(`/api/movies/${tmdbId}/watchlist`);
}

export function addToWatchlist(
  tmdbId: string,
  payload: {
    title: string;
    type: "movie" | "tv";
    releaseDate: string;
    posterPath: string;
  },
): Promise<unknown> {
  return apiFetch(`/api/movies/${tmdbId}/watchlist`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeFromWatchlist(tmdbId: string): Promise<unknown> {
  return apiFetch(`/api/movies/${tmdbId}/watchlist`, { method: "DELETE" });
}
