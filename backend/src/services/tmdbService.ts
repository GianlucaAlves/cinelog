import axios from "axios";
import type { Shelf } from "../types/shelf";

const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_API_KEY ?? process.env.API_KEY;

interface TMDBResponse {
  results: {
    id: number;
    title?: string; // movies
    name?: string; // TV shows
    poster_path: string | null;
  }[];
}

async function tmdbGet(url: string): Promise<TMDBResponse> {
  if (!TMDB_TOKEN) {
    throw new Error(
      "Missing TMDB token. Set TMDB_API_KEY or API_KEY in backend .env",
    );
  }

  const response = await axios.get<TMDBResponse>(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });

  return response.data;
}

export async function getShelvesFromTMDB(): Promise<Shelf[]> {
  const shelfConfigs: {
    id: string;
    title: string;
    url: string;
    media_type: "movie" | "tv";
  }[] = [
    {
      id: "new",
      title: "🎬 New Releases",
      url: `${TMDB_API}/movie/now_playing?language=en-US&page=1`,
      media_type: "movie",
    },
    {
      id: "top_rated",
      title: "⭐ Top Rated",
      url: `${TMDB_API}/movie/top_rated?language=en-US&page=1`,
      media_type: "movie",
    },
    {
      id: "action",
      title: "💥 Action",
      url: `${TMDB_API}/discover/movie?with_genres=28&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "comedy",
      title: "😂 Comedy",
      url: `${TMDB_API}/discover/movie?with_genres=35&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "horror",
      title: "🎃 Horror",
      url: `${TMDB_API}/discover/movie?with_genres=27&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "scifi",
      title: "🚀 Sci-Fi",
      url: `${TMDB_API}/discover/movie?with_genres=878&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "drama",
      title: "🎭 Drama",
      url: `${TMDB_API}/discover/movie?with_genres=18&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "thriller",
      title: "🔪 Thriller",
      url: `${TMDB_API}/discover/movie?with_genres=53&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "romance",
      title: "💘 Romance",
      url: `${TMDB_API}/discover/movie?with_genres=10749&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "animation",
      title: "🎨 Animation",
      url: `${TMDB_API}/discover/movie?with_genres=16&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "crime",
      title: "🕵️ Crime",
      url: `${TMDB_API}/discover/movie?with_genres=80&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    {
      id: "documentary",
      title: "🎥 Documentary",
      url: `${TMDB_API}/discover/movie?with_genres=99&sort_by=popularity.desc&page=1`,
      media_type: "movie",
    },
    // ── TV Series ───────────────────────────────────────────────
    {
      id: "tv_trending",
      title: "📺 Trending Series",
      url: `${TMDB_API}/trending/tv/week?language=en-US`,
      media_type: "tv",
    },
    {
      id: "tv_toprated",
      title: "🏆 Top Rated Series",
      url: `${TMDB_API}/tv/top_rated?language=en-US&page=1`,
      media_type: "tv",
    },
    {
      id: "tv_drama",
      title: "🎭 Drama Series",
      url: `${TMDB_API}/discover/tv?with_genres=18&sort_by=popularity.desc&page=1`,
      media_type: "tv",
    },
    {
      id: "tv_scifi",
      title: "🚀 Sci-Fi Series",
      url: `${TMDB_API}/discover/tv?with_genres=10765&sort_by=popularity.desc&page=1`,
      media_type: "tv",
    },
  ];

  return Promise.all(
    shelfConfigs.map(async (shelf) => {
      const data = await tmdbGet(shelf.url);
      return {
        id: shelf.id,
        title: shelf.title,
        movies: data.results.map((m) => ({
          id: String(m.id),
          title: m.title ?? m.name ?? "Unknown",
          poster_path: m.poster_path,
          media_type: shelf.media_type,
        })),
      };
    }),
  );
}
