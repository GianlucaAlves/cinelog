
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.API_KEY!;

const tmdbFetch = async (endpoint: string) => {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`);
  }

  return response.json();
};

export const tmdb = {
  getPopularMovies: (page = 1) => tmdbFetch(`/movie/popular?language=en-US&page=${page}`),
  getPopularSeries: (page = 1) => tmdbFetch(`/tv/popular?language=en-US&page=${page}`),
  searchMulti:  (query: string, page = 1) => tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`),
  getMovieById: (id: number) => tmdbFetch(`/movie/${id}?append_to_response=credits`),
  getSeriesById:(id: number) => tmdbFetch(`/tv/${id}?append_to_response=credits`),
};
