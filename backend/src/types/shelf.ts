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
