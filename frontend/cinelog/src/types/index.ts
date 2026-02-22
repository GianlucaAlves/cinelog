export interface Movie {
  id: string;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

export interface Shelf {
  id: string;
  title: string;
  movies: Movie[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title?: string; // movies
  name?: string; // tv
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  release_date?: string; // movies
  first_air_date?: string; // tv
  runtime?: number; // movies
  episode_run_time?: number[]; // tv
  number_of_seasons?: number;
  tagline?: string;
  status: string;
  media_type: "movie" | "tv";
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  user: { username: string };
}
